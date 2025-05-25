"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { ReplyForm } from "./ReplyForm";
import type { Reply } from "./CommentsList";
import { TweetSkeleton } from "~/skeleton/TweetSkeleton";
import { ReplyComment } from "./ReplyComment";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
  replies: Reply[]
}

type CommentItemProps = {
  comment: Comment | Reply
  currentUser: {
    id: string;
    role: string;
  } | null;
  waveId: string;
  depth: number;
  isLast?: boolean;
  replies: Reply[]
};

const MAX_DEPTH = 6;

export function CommentItem({
  comment,
  replies,
  waveId,
  depth,
  currentUser,
  isLast = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loadreplies, setLoadReplies] = useState<Reply[]>(replies);
  const isAuthor = true
  const hasReplies = loadreplies.length > 0;
  const canReply = depth < MAX_DEPTH;

  const handleReplySuccess = (newReply: Reply) => {
    setLoadReplies(prev => [newReply,...prev])
    setShowReplyForm(false);
  };

  const getThreadColor = (depth: number) => {
    const colors = [
      "border-l-emerald-300 dark:border-l-emerald-700",
      "border-l-blue-300 dark:border-l-blue-700",
      "border-l-purple-300 dark:border-l-purple-700",
      "border-l-orange-300 dark:border-l-orange-700",
      "border-l-pink-300 dark:border-l-pink-700",
      "border-l-yellow-300 dark:border-l-yellow-700",
    ]
    return colors[depth % colors.length]
  }

  return (
    <div className="relative">
      {depth > 0 && (
        <>
          <div
            className={cn(
              "absolute w-0.5 bg-border",
              getThreadColor(depth - 1),
              "left-0 top-0",
              isLast ? "h-6" : "h-full",
            )}
            style={{ left: `${(depth - 1) * 24 + 16}px` }}
          />
          <div
            className={cn(
              "absolute h-0.5 bg-border",
              getThreadColor(depth - 1),
              "top-6 w-6",
            )}
            style={{ left: `${(depth - 1) * 24 + 16}px` }}
          />
        </>
      )}

      <div className={cn("relative", depth > 0 && "ml-6")}>
        <Card className={cn(
          "border-muted/40 dark:border-muted/20 bg-card/30 bg-muted/20 backdrop-blur-sm hover:bg-card/40 transition-colors border-l-4",depth > 0 && getThreadColor(depth)
        )} >
          <CardHeader className="flex flex-row items-start gap-3 p-3">
            <Link href={`/profile/${comment.user.id}`}>
              <Avatar
                className={cn(
                  "border-2 ring-2 ring-transparent hover:ring-emerald-500/50 transition-all flex-shrink-0",
                  depth === 0 ? "h-8 w-8" : "h-6 w-6",
                )}
              >
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt={comment.user.name}
                />
                <AvatarFallback className={depth === 0 ? "text-sm" : "text-xs"}>
                  {comment.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Link
                  href={`/profile/${comment.user.id}`}
                  className="font-medium hover:underline text-sm"
                >
                  {comment.user.name}
                </Link>
                <span className="text-xs text-muted-foreground">
                  @{comment.user.name}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
                {depth > 0 && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Level {depth} reply
                    </span>
                  </>
                )}
              </div>

              <div className="text-sm whitespace-pre-wrap mb-3 leading-relaxed">
                {comment.content}
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                {canReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-2 text-xs rounded-full",
                      showReplyForm
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    <MessageCircle size={14} />
                    <span className="ml-1">Reply</span>
                  </Button>
                )}

                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-2 text-xs rounded-full",
                      !isCollapsed
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    {isCollapsed ? (
                      <ChevronRight size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                    <span className="ml-1">
                      {loadreplies.length}{" "}
                      {loadreplies.length === 1 ? "reply" : "replies"}
                    </span>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <MoreHorizontal size={14} />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      {isAuthor ? "Delete" : "Report"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>Copy link</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <ReplyForm
                commentId={comment.id}
                waveId={waveId}
                onSuccessReply={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
                replyingTo={comment.user.name}
                depth={depth}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasReplies && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-3"
            >
              {depth + 1 < MAX_DEPTH && loadreplies.length > 0 &&
                loadreplies.map((reply, index) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    currentUser={currentUser}
                    waveId={waveId}
                    depth={depth + 1}
                    isLast={index === loadreplies.length - 1}
                    replies={Array.isArray(reply.replies) ? reply.replies : []}
                  />
                ))
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

