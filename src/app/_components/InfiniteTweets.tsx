"use client"

import { api } from "~/trpc/react";
import RecentTweets from "./RecentTweets";

type UserType = {
    id: string,
    role: string
} | null

export default function InfiniteTweets({ user }: { user: UserType }) {
    const tweets = api.tweet.infiniteFeed.useInfiniteQuery({}, {
        getNextPageParam: lastPage => lastPage.nextCursor,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });
    return (
        <RecentTweets
            user={user}
            tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
            isError={tweets.isError}
            isLoading={tweets.isLoading}
            hasMore={tweets.hasNextPage}
            fetchNewTweets={tweets.fetchNextPage}
        />
    )
}