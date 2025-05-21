"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Heart, MessageCircle, UserPlus, UserMinus, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { api } from "~/trpc/react"
import { toast } from "~/hooks/use-toast"
import type { User } from "~/context/userContext"

type TweetCardProps = {
  tweet: {
    content: string
    id: string
    createdAt: Date
    likeCount: number
    likedByMe: boolean
    user: {
      id: string
      name: string | null
    }
  }
  currentUserId: User
}

export function TweetCard({ tweet, currentUserId }: TweetCardProps) {

  const isAuthor = currentUserId?.id === tweet.user.id
  const tweetId = tweet.id;

  const trpcUtils = api.useUtils()
  const { mutate: likeMutation } = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<typeof trpcUtils.tweet.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if (oldData == null) {
          return;
        }
        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === tweetId) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike
                  }
                }
                return tweet;
              })
            }
          })
        }
      }
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
    }
  })

  const { mutate: deleteTweetMutation, isError, error } = api.tweet.adminRoute.useMutation();

  function handleToggle() {
    likeMutation({ id: tweet.id })
  }

  function handleDelete() {
    deleteTweetMutation();
    if (isError && error.data?.code === 'UNAUTHORIZED') {
      toast({
        title: "UNAUTHORIZED",
        description: "you does not have admin access to delete",
        variant: 'destructive'
      })
      return;
    }
  }

  return (
    <Card className="overflow-hidden mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Link href={`/profile/${tweet.user.id}`}>
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="https://github.com/shadcn.png" alt={tweet.user.name!} />
            <AvatarFallback>{tweet.user.name!.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link href={`/profile/${tweet.user.id}`} className="font-medium hover:underline">
                {tweet.user.name}
              </Link>
              <p className="text-sm text-muted-foreground">@{tweet.user.name}</p>
            </div>
            <div className="flex items-center gap-2">
              {!isAuthor && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600"
                >
                  <span className="sr-only">follow</span>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal size={18} />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete}>{isAuthor ? "Delete wave" : "Report wave"}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap">{tweet.content}</p>
        <p className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(tweet.createdAt, { addSuffix: true })}</p>
      </CardContent>
      <CardFooter className="border-t p-2 flex items-center justify-between">
        <Button variant="ghost" size="sm" className={tweet.likedByMe ? "text-rose-500" : ""}
          onClick={handleToggle}
        >
          <Heart size={18} className={tweet.likedByMe ? "fill-rose-500" : ""} />
          <span className="ml-1">{tweet.likeCount > 0 ? tweet.likeCount : "0"}</span>
          <span className="sr-only">Resonance</span>
        </Button>
        <Link href={`/post/${tweet.id}`}>
          <Button variant="ghost" size="sm">
            <MessageCircle size={18} />
            {/* <span className="ml-1">{tweets.comments > 0 ? tweets.comments : ""}</span> */}
            <span className="sr-only">Comments</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
