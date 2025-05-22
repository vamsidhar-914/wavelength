"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Sparkles, Users } from "lucide-react"
import { TweetCard } from "./TweetCard"
import InfiniteScroll from "react-infinite-scroll-component"
import Link from "next/link"
import { Button } from "~/components/ui/button"

type TabsFeedType = {
    recentTweets?: Tweet[]
    followingPosts?: Tweet[]
    hasMore: boolean
    fetchNewTweets: () => Promise<unknown>
    user: {
        id: string,
        role: string
    } | null
}

type Tweet = {
    id: string
    content: string
    createdAt: Date
    likeCount: number
    likedByMe: boolean
    user: {
        id: string
        name: string | null
    }
}

export default function TabsFeed({ recentTweets, user, fetchNewTweets, hasMore }: TabsFeedType) {

    const [activeTab, setActiveTab] = useState("recent")

    const handleTabChange = (value: string) => {
        setActiveTab(value)
    }


    if (recentTweets == null) return (
        <>
            {/* <div className="border-b mb-6">
                <Tabs>
                <TabsList className="w-full justify-start h-auto bg-transparent p-0 mb-0">
                    <TabsTrigger
                        value="recent"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-3 h-auto bg-transparent relative"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} />
                            <span>Recent</span>
                        </div>
                        {activeTab === "recent" && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                                layoutId="activeTab"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2}}
                            />
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="following"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-3 h-auto bg-transparent relative"
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            <span>Following</span>
                        </div>
                        {activeTab === "following" && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                                layoutId="activeTab"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                    </TabsTrigger>
                </TabsList>
                </Tabs>
            </div>
        <TweetSkeletonList /> */}
            loading...
        </>)

    return (
        <Tabs defaultValue="recent" className="mb-6" onValueChange={handleTabChange}>
            <div className="border-b mb-6">
                <TabsList className="w-full justify-start h-auto bg-transparent p-0 mb-0">
                    <TabsTrigger
                        value="recent"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-3 h-auto bg-transparent relative"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} />
                            <span>Recent</span>
                        </div>
                        {activeTab === "recent" && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                                layoutId="activeTab"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="following"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-3 h-auto bg-transparent relative"
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            <span>Following</span>
                        </div>
                        {activeTab === "following" && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                                layoutId="activeTab"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="recent" className="m-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="recent-loaded"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.1 }}
                        className="grid gap-6"
                    >
                        {recentTweets.length === 0 ? (
                            <div className="text-center py-12 bg-muted/30 rounded-lg border">
                                <h3 className="text-lg font-medium mb-2">No waves yet</h3>
                                <p className="text-muted-foreground mb-4">Be the first to create a wave!</p>
                            </div>
                        ) : (
                            <ul>
                                <InfiniteScroll
                                    dataLength={recentTweets.length}
                                    next={fetchNewTweets}
                                    hasMore={hasMore}
                                    loader={
                                        <div className="flex items-center justify-center">
                                            <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    }
                                >
                                    {recentTweets.map((tweet) => (
                                        <TweetCard
                                            key={tweet.id}
                                            tweet={tweet}
                                            currentUserId={user}
                                        />
                                    ))}

                                </InfiniteScroll>
                            </ul>
                        )}
                    </motion.div>
                </AnimatePresence>
            </TabsContent>

            {activeTab === 'following' && user == null ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Login to see your followers waves</h3>
                    <Link href="/login">
                        <Button variant="destructive">Login</Button>
                    </Link>
                </div>
            ) : (
                <TabsContent value="following" className="m-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="following-loaded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="grid gap-6"
                        >
                            {recentTweets.length === 0 ? (
                                <div className="text-center py-12 bg-muted/30 rounded-lg border">
                                    <h3 className="text-lg font-medium mb-2">No waves yet</h3>
                                    <p className="text-muted-foreground mb-4">Be the first to create a wave!</p>
                                </div>
                            ) : (
                                <ul>
                                    <InfiniteScroll
                                        dataLength={recentTweets.length}
                                        next={fetchNewTweets}
                                        hasMore={hasMore}
                                        loader={
                                            <div className="flex items-center justify-center">
                                                <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        }
                                    >
                                        {recentTweets.map((tweet) => (
                                            <TweetCard
                                                key={tweet.id}
                                                tweet={tweet}
                                                currentUserId={user}
                                            />
                                        ))}

                                    </InfiniteScroll>
                                </ul>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </TabsContent>
            )}
        </Tabs>
    )
}