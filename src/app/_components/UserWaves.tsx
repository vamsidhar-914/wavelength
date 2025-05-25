"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TweetCard } from "./TweetCard";
import { api } from "~/trpc/react";
import { motion,AnimatePresence } from "framer-motion";
import { TweetSkeletonList } from "~/skeleton/TweetSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";

export default function UserWaves({ user,paramsId }: { user: { id: string,role: string },paramsId: string }){
    const data = api.tweet.infiniteProfileFeed.useInfiniteQuery({ userId: paramsId}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
      })
    const userWaves = data.data?.pages.flatMap((page) => page.tweets)
    if(userWaves == null) return <TweetSkeletonList />
    return(
        <Tabs  defaultValue="posts">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Waves</TabsTrigger>
          <TabsTrigger value="likes">Resonance</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
             <AnimatePresence mode="wait">
                        <motion.div
                          key="following-loaded"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="grid gap-6"
                        >
                          {userWaves.length === 0 ? (
                            <div className="text-center py-12 bg-muted/30 rounded-lg border">
                              <h3 className="text-lg font-medium mb-2">No waves yet</h3>
                              <p className="text-muted-foreground mb-4">
                                create your first Wave
                              </p>
                            </div>
                          ) : (
                            <ul>
                              <InfiniteScroll
                                dataLength={userWaves.length}
                                next={data.fetchNextPage}
                                hasMore={data.hasNextPage}
                                loader={
                                  <div className="flex items-center justify-center">
                                    <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                }
                              >
                                {userWaves.map((tweet) => (
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
      </Tabs>
    )
}