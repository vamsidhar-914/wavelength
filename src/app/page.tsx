import Header from "./_components/Header";
import { TrendingTopics } from "./_components/TrendingTopics";
import InfiniteTweets from "./_components/InfiniteTweets";
import { getServerSideUser } from "~/lib/user_utils";

export default async function Home() {

  const user = await getServerSideUser();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 dark:from-background dark:to-background/95">
      <Header />
      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <InfiniteTweets user={user} />
            {/* <FeedTabs
              followingPosts={tweets.data?.pages.flatMap((page) => page.tweets)}
              hasMore={tweets.hasNextPage}
              fetchNewTweets={tweets.fetchNextPage}
              recentTweets={tweets.data?.pages.flatMap((page) => page.tweets)}

            /> */}
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
