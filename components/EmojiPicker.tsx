'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

interface EmojiPickerButtonProps {
  value: string
  onChange: (emoji: string) => void
  label?: string
}

export default function EmojiPickerButton({ 
  value, 
  onChange,
  label = "Select Icon"
}: EmojiPickerButtonProps) {
  const [showPicker, setShowPicker] = useState(false)
  
  const handleEmojiClick = (emojiData: any) => {
    onChange(emojiData.emoji)
    setShowPicker(false)
  }
  
  return (
    <div className="relative">
      <Label className="block text-sm font-medium mb-1">
        {label}
      </Label>
      
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full px-4 py-2 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {value ? (
            <>
              <span className="text-2xl">{value}</span>
              <span className="text-gray-600">Change icon</span>
            </>
          ) : (
            <span className="text-gray-400">No icon selected</span>
          )}
        </span>
        <span className="text-gray-400">▼</span>
      </button>
      
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onChange('')
          }}
          className="absolute right-10 top-9 text-red-600 hover:text-red-800 text-sm"
        >
          Clear
        </button>
      )}
      
      {showPicker && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute z-50 mt-2 left-0">
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              searchPlaceHolder="Search emoji..."
              width={350}
              height={400}
            />
          </div>
        </>
      )}
    </div>
  )
}
