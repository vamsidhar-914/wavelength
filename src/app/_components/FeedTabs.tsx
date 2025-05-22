import TabsFeed from "./TabsFeed"

interface FeedTabsProps {
    recentTweets?: Tweet[]
    followingPosts?: Tweet[]
    hasMore: boolean
    fetchNewTweets: () => Promise<unknown>
    user: {
        id: string
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

export function FeedTabs({ recentTweets, fetchNewTweets, hasMore ,user}: FeedTabsProps) {
    return (
        <TabsFeed followingPosts={recentTweets} recentTweets={recentTweets} fetchNewTweets={fetchNewTweets} hasMore={hasMore} user={user} />
    )
}
