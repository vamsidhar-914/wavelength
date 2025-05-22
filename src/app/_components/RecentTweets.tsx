import Link from "next/link";
import { Button } from "~/components/ui/button";
import { TweetCard } from "./TweetCard";
import InfiniteScroll from 'react-infinite-scroll-component'
import { TweetSkeletonList } from "~/skeleton/TweetSkeleton";

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

type InfiniteTweetListProps = {
  isLoading: boolean
  isError: boolean
  hasMore: boolean
  fetchNewTweets: () => Promise<unknown>
  tweets?: Tweet[],
  user: {
    id: string
    role: string
  } | null
}

export default function RecentTweets({ tweets, isLoading, isError, hasMore, fetchNewTweets, user }: InfiniteTweetListProps) {

  if (isLoading) return <TweetSkeletonList />

  if (isError) return <h1>Error while loading the tweets</h1>
  if (tweets == null) return <h1>No tweets</h1>

  return (
    <main>
      <div className="grid gap-6">
        {user ? (
          <>
            <h2 className="text-xl font-semibold">Your Wavelength</h2>
            {tweets == null || tweets.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Your feed is empty</h3>
                <p className="text-muted-foreground">Follow some users to see their waves in your feed</p>
                <p className="text-muted-foreground">or</p>
                <p className="text-muted-foreground mb-4">Start wavelength by creating <Link href="/createTweet">
                  <span className="text-muted-forground text-lg hover:text-white">New Wave</span>
                </Link></p>
                <Link href="/discover">
                  <Button>Discover users</Button>
                </Link>
              </div>
            ) : (
              <ul>
                <InfiniteScroll
                  dataLength={tweets.length}
                  next={fetchNewTweets}
                  hasMore={hasMore}
                  loader={
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }
                >
                  {tweets.map((tweet) => (
                    <TweetCard
                      key={tweet.id}
                      tweet={tweet}
                      currentUserId={user}
                    />
                  ))}

                </InfiniteScroll>
              </ul>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gradient-to-r from-emerald-900 to-teal-700 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Find your wavelength</h2>
            <p className="text-lg text-secondary max-w-md mx-auto mb-6">
              Connect with like-minded people and share ideas that resonate with others.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Join Wavelength
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}