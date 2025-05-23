"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { TweetCard } from "./TweetCard";
import { api } from "~/trpc/react";
import { TweetSkeleton } from "~/skeleton/TweetSkeleton";
import { CommentForm } from "./commentForm";
import { toast } from "~/hooks/use-toast";

type User = {
  id: string;
  role: string;
} | null;

type WavePostType = {
  waveId: string;
  user: User;
};

export function WavePost({ waveId, user }: WavePostType) {
  const { data: comments, error: commentsError } =
    api.comment.getCommentsByWaveId.useQuery(
      { waveId },
      {
        retry: false,
        refetchOnWindowFocus: false,
      },
    );
  const { data, isLoading, error, isError } = api.tweet.getWaveById.useQuery(
    { waveId },
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading)
    return (
      <div className="container max-w-2xl py-6">
        <TweetSkeleton />
      </div>
    );
  if (data == undefined || isError) {
    return (
      <div className="container max-w-2xl py-6 ">
        <h1>{error?.message}</h1>
      </div>
    );
  }
  if (commentsError?.data?.code === "UNAUTHORIZED") {
    toast({
      title: "Please login",
      description: commentsError.message,
      variant: "destructive",
    });
  }
  return (
    <div className="container max-w-2xl py-6">
      <Link href="/" className="inline-flex items-center mb-6">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      <TweetCard tweet={data} currentUserId={user} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Responses</h2>
        {user ? (
          <CommentForm waveId={waveId} />
        ) : (
          <div className="bg-muted/30 p-4 rounded-lg text-center mb-6">
            <p className="mb-2">Sign in to join the conversation</p>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-6">
          {comments?.comments.length === 0 ? (
            <h1>no comments found for this wave</h1>
          ) : (
            comments?.comments.map((comment) => <h1 key={comment.id}>{comment.content}</h1>)
          )}
        </div>
      </div>
    </div>
  );
}
