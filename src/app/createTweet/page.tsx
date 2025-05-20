"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { api } from "~/trpc/react"
import { toast } from "~/hooks/use-toast"
import { useUser } from "~/context/userContext"

export default function CreatePost() {
  const { user } = useUser()
  const [content, setContent] = useState("")
  const router = useRouter()

  // if(user == null) return null;
  
  const trpcUtils = api.useUtils();
  
  const { mutate: tweetMutation,isPending,isError,error } = api.tweet.create.useMutation({
    onSuccess(data, variables, context) {
      trpcUtils.tweet.infiniteFeed.setInfiniteData({} , (oldData) => {
        if(oldData == null || oldData.pages[0] == null){
          return;
        }
        const newCachedTweet = {
          ...data,
          likeCount: 0,
          likedByMe: false,
          user : {
            id: user!.id, 
            name: "vamsidhar reddy"
          }
        }
        
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCachedTweet, ...oldData.pages[0].tweets]
            },
            ...oldData.pages.slice(1)
          ]
        }
        
      })
      toast({
        title: "created tweet",
        description: `successgully tweet created at ${data.createdAt}`
      })
      router.push("/")
    },
    onError(error){
      console.log("api failed", error);
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
   // implement create post mutation
   tweetMutation({ content })

   if(error && error.data?.code === 'UNAUTHORIZED'){
    toast({
        title: "UNAUTHORIZED",
        description: "you are not authenticated to create a tweet, please Login/Register",
        variant:'destructive'
    })
    return;
   }


  }

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="text-2xl font-bold mb-6">Create a new wave</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Share your thoughts..."
          className="min-h-[200px] text-lg"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{content.length}/500 characters</p>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={!content.trim() || isPending}
          >
            {isPending ? "Sending..." : "Send wave"}
          </Button>
        </div>
      </form>
    </div>
  )
}
