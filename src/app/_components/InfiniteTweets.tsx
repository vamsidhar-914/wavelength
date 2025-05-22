"use client"

import { api } from "~/trpc/react";
import { FeedTabs } from "./FeedTabs";

type UserType = {
    id: string,
    role: string
} | null

export default function InfiniteTweets({ user }: { user: UserType }) {
    const tweets = api.tweet.infiniteFeed.useInfiniteQuery({}, {
        getNextPageParam: lastPage => lastPage.nextCursor,
    });
    return (
        <>
        {/* <RecentTweets
            user={user}
            tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
            isError={tweets.isError}
            isLoading={tweets.isLoading}
            hasMore={tweets.hasNextPage}
            fetchNewTweets={tweets.fetchNextPage}
        /> */}
         <FeedTabs
                user={user}
              followingPosts={tweets.data?.pages.flatMap((page) => page.tweets)}
              hasMore={tweets.hasNextPage}
              fetchNewTweets={tweets.fetchNextPage}
              recentTweets={tweets.data?.pages.flatMap((page) => page.tweets)}
            /> 
        </>
    )
}