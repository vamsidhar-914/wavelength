"use client";

import { UserMinus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { api } from "~/trpc/react";
// import { followUser, unfollowUser } from "@/lib/actions"

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  currentUser: {
    id: string
    role: string
  }
  username: string | null
}

export function FollowButton({
  userId,
  currentUser,
  username,
  isFollowing: initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

    const trpcUtils = api.useUtils()
  const { data,mutate,isPending } = api.tweet.toggleFollow.useMutation({
    onSuccess ({ addedFollow }) {
      trpcUtils.tweet.getUserById.setData({ id: userId } , (oldData) => {
        if(oldData == null){
            return
        }  
        const countModifier = addedFollow ? 1 : -1
        return{
            ...oldData,
            followersCount: oldData.followersCount + countModifier,
            isFollowing: addedFollow
        }
      })
      trpcUtils.tweet.getUserById.setData({ id: currentUser.id },(oldData) => {
        if(oldData == null) return
        const countModifier = addedFollow ? 1 : -1
        return{
            ...oldData,
            followsCount: oldData.followsCount + countModifier
        }
      })
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  const handleFollow = async () => {
    mutate({ userId });
  };

  return (
    // <Button
    //   onClick={handleFollow}
    //   disabled={isPending}
    //   variant={data?.addedFollow ?? isFollowing ? "outline" : "default"}
    //   className={data?.addedFollow ?? isFollowing ? "" : "bg-emerald-600 hover:bg-emerald-700"}
    // >
    //   {data?.addedFollow ?? isFollowing ? "Following" : "Follow"}
    // </Button>
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className={data?.addedFollow ?? isFollowing ? "text-emerald-600 dark:text-emerald-400" : ""}
          onClick={handleFollow}
        >
          {data?.addedFollow ?? isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
          <span className="sr-only">{data?.addedFollow ?? isFollowing ? "Unfollow" : "Follow"}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {data?.addedFollow ?? isFollowing  ? "Unfollow" : "Follow"} @{username}
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  );
}
