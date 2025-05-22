import { getServerSideUser } from "~/lib/user_utils"
import TabsFeed from "./TabsFeed"

interface FeedTabsProps {
    recentTweets?: Tweet[]
    followingPosts?: Tweet[]
    hasMore: boolean
    fetchNewTweets: () => Promise<unknown>
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

export  async function FeedTabs({ recentTweets, fetchNewTweets, hasMore }: FeedTabsProps) {
    const user = await getServerSideUser();
    return (
        <TabsFeed followingPosts={recentTweets} recentTweets={recentTweets} fetchNewTweets={fetchNewTweets} hasMore={hasMore} user={user} />
    )
}
