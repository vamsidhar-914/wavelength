'use client'

import { api } from "~/trpc/react";
import Header from "./_components/Header";
import RecentTweets from "./_components/RecentTweets";

export default function Home() {

  const tweets = api.tweet.infiniteFeed.useInfiniteQuery({},{
          getNextPageParam: lastPage => lastPage.nextCursor
      });

  return (
      <div className="container max-w-4xl py-6">
         <Header />
         <RecentTweets
          tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage}
          fetchNewTweets={tweets.fetchNextPage}
         />
      </div>
  );
}
