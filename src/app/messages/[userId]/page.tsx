'use client'

import { useState, useEffect, useRef } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, ArrowLeft, Paperclip } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface MessagePageProps {
  params: {
    userId: string
  }
}

// Mock data - replace with actual Supabase real-time subscription
const userData = {
  id: 'user-1',
  name: 'Sarah Johnson',
  avatar: null,
  role: 'instructor' as const,
  online: true,
}

const initialMessages = [
  {
    id: '1',
    senderId: 'user-1',
    content: 'Hi! How are your breathing exercises going?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '2',
    senderId: 'current-user',
    content: 'Great! I\'ve been practicing daily like you suggested.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
  },
  {
    id: '3',
    senderId: 'user-1',
    content: 'That\'s wonderful! Keep up the good work. Have you tried the new pitch exercises?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '4',
    senderId: 'current-user',
    content: 'Yes, they\'re challenging but I can feel improvement!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '5',
    senderId: 'user-1',
    content: 'Great progress on your breathing exercises!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
]

export default function MessagePage({ params }: MessagePageProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage('')

    // Here you would send to Supabase real-time
  }

  return (
    <AuthenticatedLayout>
      <Card className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/messages">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Avatar className="h-10 w-10">
                <AvatarImage src={userData.avatar || undefined} />
                <AvatarFallback>
                  {userData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{userData.name}</h2>
                  {userData.role === 'instructor' && (
                    <Badge variant="secondary" className="text-xs">
                      Instructor
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userData.online ? (
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                      Online
                    </span>
                  ) : (
                    'Offline'
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === 'current-user'
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        isCurrentUser
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {format(message.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </AuthenticatedLayout>
  )
}
