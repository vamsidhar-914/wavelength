"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardContent } from "~/components/ui/card"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import { toast } from "~/hooks/use-toast"
import type { Reply } from "./CommentsList"

interface ReplyFormProps {
  commentId: string
  waveId: string
  onSuccessReply: (reply: Reply) => void
  onCancel: () => void
  replyingTo: string
  depth?: number
}

export function ReplyForm({ commentId, waveId, onSuccessReply, onCancel, replyingTo, depth = 0 }: ReplyFormProps) {
  const [content, setContent] = useState("")
  const trpcUtils = api.useUtils()

  const reply = api.comment.createComment.useMutation({
    onSuccess(data, variables, context) {
        trpcUtils.comment.getCommentsByWaveId.setData({waveId}, (oldData) => {
            if(oldData == null || oldData.comments == null){
                return
            }
            const newReply = {
                ...data,
                replyToId: commentId,
                replies:[]
            }
            return {
                ...oldData,
                comments: oldData.comments.map((comment) => {
                    if(comment.id === commentId){
                        return {
                            ...comment,
                            replies: [newReply,...comment.replies]
                        }
                    }
                    return comment
                })
            }
        })
        onSuccessReply({
          ...data,
          replyToId: commentId,
          replies:[]
        })
        setContent("")
        toast({
            title: "replied successfully",
            description: "success"
        })
    },
    onError(error, variables, context) {
        toast({
            title: "something went wrong",
            description: error.message
        })
    },
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
     reply.mutate({ content,waveId,parentId: commentId })
  }

  const getThreadColor = (depth: number) => {
    const colors = [
      "border-l-emerald-300 dark:border-l-emerald-700",
      "border-l-blue-300 dark:border-l-blue-700",
      "border-l-purple-300 dark:border-l-purple-700",
      "border-l-orange-300 dark:border-l-orange-700",
      "border-l-pink-300 dark:border-l-pink-700",
      "border-l-yellow-300 dark:border-l-yellow-700",
    ]
    return colors[depth % colors.length]
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card
        className={cn(
          "border-muted/40 dark:border-muted/20 bg-card/20 backdrop-blur-sm border-l-4",
          depth > 0 && getThreadColor(depth),
        )}
      >
        <CardContent className="p-3">
          <div className="flex gap-3">
            <Avatar className="h-7 w-7 border-2 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=28&width=28" alt="Your avatar" />
              <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Replying to</span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">@{replyingTo}</span>
                {depth > 0 && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">Level {depth + 1}</span>
                  </>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Textarea
                  placeholder="Write a thoughtful reply..."
                  className="min-h-[80px] text-sm resize-none border-muted/40 focus:border-emerald-500 dark:focus:border-emerald-400"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={300}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {content.length}/300 characters
                    {content.length > 250 && (
                      <span className="ml-2 text-orange-500">({300 - content.length} remaining)</span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onCancel}
                      disabled={reply.isPending}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-xs"
                      disabled={!content.trim() || reply.isPending}
                    >
                      {reply.isPending ? "Replying..." : "Reply"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
