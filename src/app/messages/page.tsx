'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { format, isToday, isYesterday } from 'date-fns'
import clsx from 'clsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type Contact = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
  last_message: string | null
  last_message_at: string | null
  last_message_sender_id: string | null
}

type ContactResponse = {
  user: { id: string; full_name: string | null; avatar_url: string | null } | null
  teachers: Contact[]
  classmates: Contact[]
}

type Message = {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
}

export default function MessagesPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [user, setUser] = useState<ContactResponse['user']>(null)
  const [contacts, setContacts] = useState<{ teachers: Contact[]; classmates: Contact[] }>({
    teachers: [],
    classmates: [],
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [contactsLoading, setContactsLoading] = useState(true)
  const [threadLoading, setThreadLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [composerValue, setComposerValue] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const fetchContacts = useCallback(async () => {
    setContactsLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch('/api/messages/contacts', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (response.ok) {
        const data: ContactResponse = await response.json()
        setContacts({ teachers: data.teachers, classmates: data.classmates })
        setUser(data.user)
      } else if (response.status === 401) {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          router.replace('/login')
        } else {
          const body = await response.json().catch(() => null)
          setErrorMessage(body?.error || 'You are not authorized to view messages.')
        }
      } else {
        const body = await response.json().catch(() => null)
        setErrorMessage(body?.error || 'Unable to load contacts right now. Please try again shortly.')
      }
    } catch (error) {
      console.error('Failed to load contacts', error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load contacts right now. Please try again shortly.'
      )
    } finally {
      setContactsLoading(false)
    }
  }, [router, supabase])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const loadThread = useCallback(
    async (contact: Contact) => {
      setThreadLoading(true)
      try {
        const response = await fetch(`/api/messages/${contact.id}`, {
          cache: 'no-store',
          credentials: 'include',
        })
        if (!response.ok) {
          console.error('Failed to load conversation')
          setMessages([])
          return
        }

        const data = await response.json()
        setMessages(data.messages ?? [])
      } catch (error) {
        console.error('Failed to load conversation', error)
        setMessages([])
      } finally {
        setThreadLoading(false)
      }
    },
    [setMessages]
  )

  const updateContactPreview = useCallback((contactId: string, message: Message) => {
    setContacts((prev) => {
      const updateList = (list: Contact[]) =>
        list.map((contact) =>
          contact.id === contactId
            ? {
                ...contact,
                last_message: message.content,
                last_message_at: message.created_at,
                last_message_sender_id: message.sender_id,
              }
            : contact
        )

      return {
        teachers: updateList(prev.teachers),
        classmates: updateList(prev.classmates),
      }
    })
  }, [])

  useEffect(() => {
    if (!user?.id) return
    const channel = supabase
      .channel(`messages-feed-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const message = payload.new as Message
          if (message.sender_id !== user.id && message.recipient_id !== user.id) return
          const counterpartId = message.sender_id === user.id ? message.recipient_id : message.sender_id
          updateContactPreview(counterpartId, message)
          if (selectedContact && counterpartId === selectedContact.id) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === message.id)) return prev
              return [...prev, message]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user?.id, selectedContact, updateContactPreview])

  useEffect(() => {
    if (selectedContact) {
      loadThread(selectedContact)
    } else {
      setMessages([])
    }
  }, [selectedContact, loadThread])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleContactSelect = (contact: Contact) => {
    if (selectedContact?.id === contact.id) return
    setSelectedContact(contact)
    setComposerValue('')
  }

  const handleSendMessage = async () => {
    if (!selectedContact || !composerValue.trim()) return
    setSending(true)
    try {
      const response = await fetch(`/api/messages/${selectedContact.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: composerValue }),
      })

      if (!response.ok) {
        console.error('Failed to send message')
        return
      }

      const data = await response.json()
      const message = data.message as Message
      setMessages((prev) => [...prev, message])
      updateContactPreview(selectedContact.id, message)
      setComposerValue('')
    } catch (error) {
      console.error('Failed to send message', error)
    } finally {
      setSending(false)
    }
  }

  const formatSidebarTimestamp = (timestamp: string | null) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    if (isToday(date)) return format(date, 'p')
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMM d')
  }

  const sortContacts = useCallback(
    (list: Contact[]) => {
      const query = searchTerm.trim().toLowerCase()
      const filtered = query
        ? list.filter(
            (contact) =>
              contact.full_name?.toLowerCase().includes(query) || contact.last_message?.toLowerCase().includes(query)
          )
        : [...list]

      return filtered.sort((a, b) => {
        if (a.last_message_at && b.last_message_at) {
          return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
        }
        if (a.last_message_at) return -1
        if (b.last_message_at) return 1
        return (a.full_name || '').localeCompare(b.full_name || '')
      })
    },
    [searchTerm]
  )

  const filteredTeachers = useMemo(() => sortContacts(contacts.teachers), [contacts.teachers, sortContacts])
  const filteredClassmates = useMemo(() => sortContacts(contacts.classmates), [contacts.classmates, sortContacts])

  const renderContactSection = (title: string, items: Contact[]) => {
    if (!items.length) return null
    return (
      <div key={title}>
        <p className="px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <div className="mt-2 space-y-1">
          {items.map((contact) => {
            const isActive = selectedContact?.id === contact.id
            const preview =
              contact.last_message_sender_id && contact.last_message_sender_id === user?.id
                ? `You: ${contact.last_message ?? ''}`
                : contact.last_message ?? 'No messages yet'

            return (
              <button
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={clsx(
                  'w-full px-4 py-3 text-left transition-colors',
                  'hover:bg-white/80 dark:hover:bg-white/10',
                  isActive ? 'bg-white text-gray-900 shadow dark:bg-white/10 dark:text-white' : 'bg-transparent text-white/90'
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-white/20">
                    <AvatarImage src={contact.avatar_url || undefined} />
                    <AvatarFallback>
                      {(contact.full_name || contact.role || '??')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{contact.full_name || 'Unknown Contact'}</p>
                      <span className="text-xs text-muted-foreground">{formatSidebarTimestamp(contact.last_message_at)}</span>
                    </div>
                    <p className="line-clamp-1 text-sm text-muted-foreground">{preview}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const conversationHeader = selectedContact ? (
    <div className="flex items-center justify-between border-b bg-white/80 px-6 py-4 shadow-sm backdrop-blur dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={selectedContact.avatar_url || undefined} />
          <AvatarFallback>
            {(selectedContact.full_name || '??')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold">{selectedContact.full_name || 'Conversation'}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {selectedContact.role === 'admin' ? 'Teacher' : selectedContact.role || 'Classmate'}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-between border-b bg-white/60 px-6 py-4 backdrop-blur dark:bg-slate-900/80">
      <p className="text-lg font-semibold">Messages</p>
    </div>
  )

  const conversationBody = selectedContact ? (
    <>
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-100/60 to-white px-6 py-6 dark:from-slate-900 dark:to-slate-950">
        {threadLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading conversation...</div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Start the conversation with {selectedContact.full_name || 'this contact'}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isMine = message.sender_id === user?.id
              const timestamp = format(new Date(message.created_at), 'MMM d • p')
              return (
                <div key={message.id} className={clsx('flex', isMine ? 'justify-end' : 'justify-start')}>
                  <div
                    className={clsx(
                      'max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm',
                      isMine
                        ? 'rounded-br-md bg-purple-600 text-white'
                        : 'rounded-bl-md bg-white text-gray-900 dark:bg-slate-800 dark:text-white'
                    )}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    <span className={clsx('mt-1 block text-[10px]', isMine ? 'text-white/80' : 'text-gray-500 dark:text-gray-300')}>
                      {timestamp}
                    </span>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="border-t bg-white/80 px-6 py-4 backdrop-blur dark:bg-slate-900/80">
        <div className="flex items-end gap-3">
          <Textarea
            value={composerValue}
            onChange={(e) => setComposerValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Send a message..."
            className="min-h-[52px] flex-1 resize-none rounded-2xl bg-muted/40 px-4 py-3 text-sm shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!composerValue.trim() || sending}
            className="rounded-full bg-purple-600 px-6 py-6 text-white hover:bg-purple-700"
          >
            Send
          </Button>
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-white text-center dark:from-slate-900 dark:to-slate-950">
      <p className="text-2xl font-semibold text-slate-800 dark:text-white">Select a conversation</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Choose a teacher or classmate from the left to start chatting in real time. Messages sync instantly and stay in Supabase.
      </p>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col bg-slate-950/95 text-white md:flex-row">
      <aside className="w-full border-b border-white/10 bg-slate-900/80 backdrop-blur md:w-80 md:border-b-0 md:border-r">
        <div className="flex flex-col gap-4 px-4 py-4">
          <div>
            <p className="text-xl font-semibold">Messages</p>
            <p className="text-sm text-white/70">Stay connected with your studio</p>
          </div>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="border-white/10 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white"
          />
        </div>
        <div className="h-[calc(100%-120px)] overflow-y-auto pb-6">
          {contactsLoading ? (
            <p className="px-4 text-sm text-white/70">Loading contacts...</p>
          ) : errorMessage ? (
            <p className="px-4 text-sm text-red-200">{errorMessage}</p>
          ) : (
            <div className="space-y-6">
              {filteredTeachers.length === 0 && filteredClassmates.length === 0 ? (
                <p className="px-4 text-sm text-white/70">No contacts yet.</p>
              ) : (
                <>
                  {renderContactSection('Teachers', filteredTeachers)}
                  {renderContactSection('Classmates', filteredClassmates)}
                </>
              )}
            </div>
          )}
        </div>
      </aside>
      <section className="flex flex-1 flex-col overflow-hidden bg-white/80 text-slate-900 backdrop-blur dark:bg-slate-900 dark:text-white">
        {conversationHeader}
        {conversationBody}
      </section>
    </div>
  )
}
