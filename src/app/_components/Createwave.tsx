"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

type UserType = {
    id: string,
    role: string
} | null

export default function Createwave({ user }: { user: UserType }) {
    const [content, setContent] = useState("");
    const router = useRouter()

    const trpcUtils = api.useUtils();

    const { mutate: tweetMutation, isPending, error } = api.tweet.create.useMutation({
        onSuccess(data) {
            trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
                if (oldData == null || oldData.pages[0] == null) {
                    return;
                }
                const newCachedTweet = {
                    ...data,
                    likeCount: 0,
                    likedByMe: false,
                    user: {
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
         onError(error, variables, context) {
                if(error.data?.code === 'UNAUTHORIZED'){
                  toast({
                    title: "UNAUTHORIZED",
                    description: "You need to login to create a wave",
                    variant: 'destructive'
                  })
                }
            },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        tweetMutation({ content })

    }
    return (
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
    )
}