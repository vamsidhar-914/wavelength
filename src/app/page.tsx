'use client'

import { api } from "~/trpc/react";
import Header from "./_components/Header";
import RecentTweets from "./_components/RecentTweets";
import { TrendingTopics } from "./_components/TrendingTopics";
import { FeedTabs } from "./_components/FeedTabs";

export default function Home() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery({}, {
    getNextPageParam: lastPage => lastPage.nextCursor,
  });
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 dark:from-background dark:to-background/95">
      <Header />
      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* <RecentTweets
              tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
              isError={tweets.isError}
              isLoading={tweets.isLoading}
              hasMore={tweets.hasNextPage}
              fetchNewTweets={tweets.fetchNextPage}
            /> */}
            <FeedTabs
              followingPosts={tweets.data?.pages.flatMap((page) => page.tweets)}
              hasMore={tweets.hasNextPage}
              fetchNewTweets={tweets.fetchNextPage}
              recentTweets={tweets.data?.pages.flatMap((page) => page.tweets)}

            />
          </div>
          <div className="hidden md:block">
            <div className="sticky top-24">
              <TrendingTopics />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
