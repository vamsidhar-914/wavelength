"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"


interface CommentFormProps {
  waveId: string
}

export function CommentForm({ waveId }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // create trpc post query
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Share your thoughts on this wave..."
        className="min-h-[100px]"
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        maxLength={300}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{content.length}/300 characters</p>
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? "Responding..." : "Respond"}
        </Button>
      </div>
    </form>
  )
}
