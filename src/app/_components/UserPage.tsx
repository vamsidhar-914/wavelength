"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react"
import { FollowButton } from "./FollowButton"
import UserWaves from "./UserWaves"
import { TrendingTopics } from "./TrendingTopics"
import ProfileSkeleton from "./ProfileSkeleton"
import { useMemo } from "react"

export default function UserPage({ userId,authUser }: { userId: string,authUser: { id: string,role: string } }){
    const stableUserId = useMemo(() => userId, [userId]);
    const user = api.tweet.getUserById.useQuery({ id: stableUserId },{
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
    })
    if(user.data == null) return <ProfileSkeleton />
    const isCurrentUser = authUser.id === userId
    return(
        <>
        <div className="mb-8">
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-300 rounded-t-lg" />
        <div className="px-6 -mt-12">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={"https://github.com/shadcn.png"} alt={user.data.name} />
            <AvatarFallback className="text-2xl">{user.data.id.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex items-start justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold">{user.data.name}</h1>
              <p className="text-muted-foreground">@{user.data.email}</p>
              {user.data.id && <p className="mt-2">{user.data.id}</p>}
            </div>

            {isCurrentUser ? (
              <Link href="/settings">
                <Button variant="outline">Edit profile</Button>
              </Link>
            ) : (
              <FollowButton userId={user.data.id} isFollowing={user.data.isFollowing} currentUser={authUser} username={user.data.name}/>
            )}
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="font-semibold">{user.data.tweetsCount}</span>{" "}
              <span className="text-muted-foreground">Waves</span>
            </div>
            <Link href={`/profile/${user.data.id}/following`} className="hover:underline">
              <span className="font-semibold">{user.data.followsCount}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </Link>
            <Link href={`/profile/${user.data.id}/followers`} className="hover:underline">
              <span className="font-semibold">{user.data.followersCount}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </Link>
          </div>
        </div>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
      <div className="md:col-span-6">
        <UserWaves user={authUser} paramsId={userId} />
      </div>
      <div className="md:col-span-4 rounded-lg p-6">
        <TrendingTopics />
      </div>
    </div>
        </>
    )
}