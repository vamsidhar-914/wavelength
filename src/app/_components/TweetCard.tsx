"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  Heart,
  MessageCircle,
  UserPlus,
  UserMinus,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TweetSkeleton } from "~/skeleton/TweetSkeleton";

type User = {
  id: string;
  role: string;
} | null;

type TweetCardProps = {
  tweet: {
    content: string;
    id: string;
    createdAt: Date;
    likeCount: number;
    likedByMe: boolean;
    user: {
      id: string;
      name: string | null;
    };
  };
  currentUserId: User;
};

export function TweetCard({ tweet, currentUserId }: TweetCardProps) {
  const router = useRouter();
  const pathName = window.location.pathname
  const isAuthor = currentUserId?.id === tweet.user.id;
  const tweetId = tweet.id;

  const trpcUtils = api.useUtils();
  // const {  data,isLoading } = api.comment.getCommentsByWaveId.useQuery({ waveId: tweet.id }, {
  //   retry: false,
  //   refetchOnWindowFocus: false,
  // },)
  const { mutate: likeMutation } = api.tweet.toggleLike.useMutation({
    // onMutate: async({ id }) => {
    //    await trpcUtils.tweet.infiniteFeed.cancel()
    //    const prevData = trpcUtils.tweet.infiniteFeed.getInfiniteData()

    //    trpcUtils.tweet.infiniteFeed.setInfiniteData({} , (oldData) => {
    //     if(oldData == null) return;
    //     return {
    //       ...oldData,
    //       pages: oldData.pages.map((page) => {
    //         return{
    //           ...page,
    //           tweets: page.tweets.map((tweet) => {
    //             if(tweet.id === id){
    //               if(tweet.likedByMe){
    //                 return {
    //                   ...tweet,
    //                   likedByMe: false,
    //                   likeCount: tweet.likeCount - 1
    //                 }
    //               }else{
    //                 return {
    //                   ...tweet,
    //                   likedByMe: true,
    //                   likeCount: tweet.likeCount + 1
    //                 }
    //               }
    //             }
    //             return tweet;
    //           })
    //         }
    //       })
    //     }
    //    })

    //    return ({ prevData })
    // },
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) {
          return;
        }
        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === tweetId) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      console.log("success")
    },
    onError(error, variables, context) {
      // trpcUtils.tweet.infiniteFeed.setInfiniteData({}, context?.prevData)
      // toast({
      //   title: "something went wrong",
      //   variant: 'destructive'
      // })
        if (error.data?.code === "UNAUTHORIZED") {
          toast({
            title: "UNAUTHORIZED",
            description: "You need to login to like",
            variant: "destructive",
          });
        }
    },
  });
  const { mutate: deleteMutation } = api.tweet.deleteWave.useMutation({
    onSuccess(data, variables) {
      if (!data.isDeleted) {
        toast({
          title: "permission denied",
          description: "you does not have permission to delete others wave",
          variant: "destructive",
        });
        return;
      }
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) {
          return;
        }
        const tweetId = variables.tweetId;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.filter((tweet) => tweet.id !== tweetId),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      const segments = pathName.split("/");
      if(segments[1] === "wave"){
        router.push("/")
      }
      toast({
        title: "Deleted wave",
        description: "wave got succesfully deleted",
        variant: "default",
      });
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        toast({
          title: "UNAUTHORIZED",
          description: "You are not authorized to delete/report wave",
          variant: "destructive",
        });
      }
    },
  });
  const { mutate: updateMutation } = api.tweet.updateWave.useMutation({
    onSuccess(data) {
      if (data == null) {
        toast({
          title: "Permission denied",
          description: "you does not have permission to update",
          variant: "destructive",
        });
        return;
      }
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) {
          return;
        }
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === tweetId) {
                  return {
                    ...tweet,
                    content: data.content,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      });
      toast({
        title: "updated wave",
        description: "successfully updated with new content",
      });
    },
    onError(error) {
      toast({
        title: "something went wrong",
        description: error.message,
      });
    },
  });

  function handleToggle() {
    likeMutation({ id: tweet.id });
  }

  function handleDelete() {
    deleteMutation({ createdAt: tweet.createdAt, tweetId: tweet.id, isAuthor });
  }

  function handleReport() {
    updateMutation({ createdAt: tweet.createdAt, tweetId: tweet.id, isAuthor });
  }

  // if(isLoading) return <TweetSkeleton />

  return (
    <Card className="overflow-hidden mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Link href={`/profile/${tweet.user.id}`}>
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={tweet.user.name!}
            />
            <AvatarFallback>{tweet.user.name!.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/profile/${tweet.user.id}`}
                className="font-medium hover:underline"
              >
                {tweet.user.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                @{tweet.user.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isAuthor && (
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  <span className="sr-only">follow</span>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal size={18} />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAuthor ? (
                    <DropdownMenuItem onClick={handleDelete}>
                      Delete wave
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleReport}>
                      Report wave
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Link href={`/wave/${tweet.id}`}>
          <p className="whitespace-pre-wrap">{tweet.content}</p>
        </Link>
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(tweet.createdAt, { addSuffix: true })}
        </p>
      </CardContent>
      <CardFooter className="border-t p-2 flex items-center">
        {currentUserId ? (
          <Button
          variant="ghost"
          size="sm"
          className={tweet.likedByMe ? "text-rose-500" : ""}
          onClick={handleToggle}
       >
           <Heart size={18} className={tweet.likedByMe ? "fill-rose-500" : ""} />
          <span className="ml-1">
            {tweet.likeCount > 0 ? tweet.likeCount : "0"}
          </span>
          <span className="sr-only">Resonance</span>
        </Button>
        ): (
          <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
       >
           <Heart size={18} />
          <span className="ml-1">
            {tweet.likeCount > 0 ? tweet.likeCount : "0"}
          </span>
          <span className="sr-only">Resonance</span>
        </Button>
        )}
        <Link href={`/wave/${tweet.id}`}>
          <Button variant="ghost" size="sm">
            <MessageCircle size={18} />
            {/* <span className="ml-1">{data?.comments.length! > 0 ? data?.comments.length : ""}</span> */}
            <span className="sr-only">Comments</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
