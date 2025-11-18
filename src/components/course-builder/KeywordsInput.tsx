'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface KeywordsInputProps {
  keywords: string[]
  onChange: (keywords: string[]) => void
  placeholder?: string
}

export function KeywordsInput({ keywords, onChange, placeholder = 'Type keyword and press Enter' }: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newKeyword = inputValue.trim()

      // Avoid duplicates
      if (!keywords.includes(newKeyword)) {
        onChange([...keywords, newKeyword])
      }

      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      // Remove last keyword if input is empty
      onChange(keywords.slice(0, -1))
    }
  }

  const removeKeyword = (indexToRemove: number) => {
    onChange(keywords.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <Badge key={index} variant="secondary" className="gap-1 pl-2 pr-1">
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="ml-1 rounded-full hover:bg-secondary-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <p className="text-xs text-muted-foreground">
        Press Enter to add keywords. Keywords help students search for specific topics.
      </p>
    </div>
  )
}
