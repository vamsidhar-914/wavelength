"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { api } from "~/trpc/react"
import { toast } from "~/hooks/use-toast"


interface CommentFormProps {
  waveId: string
}

export function CommentForm({ waveId }: CommentFormProps) {
  const [content, setContent] = useState("")
  const router = useRouter();
  const trpcUtils = api.useUtils();
  const data = api.comment.createComment.useMutation({
    onSuccess(data) {
      trpcUtils.comment.getCommentsByWaveId.setData({ waveId } , (oldData) => {
        if(oldData == null || oldData.comments == null){
          return
        }
        const newCachedComment = {
          ...data,
          replies: []
        }
        return {
          ...oldData,
          comments: [...oldData.comments,newCachedComment]
        }
      })
      setContent("")
        toast({
          title: "created comment",
          description: data.id,
        })
    
    },  
    onError(error) {
        console.log(error);
        toast({
          title: "something went wrong",
          description: error.message,
          variant: 'destructive'
        })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    data.mutate({ content,waveId })
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
          disabled={!content.trim() || data.isPending}
        >
          {data.isPending ? "Responding..." : "Respond"}
        </Button>
      </div>
    </form>
  )
}
