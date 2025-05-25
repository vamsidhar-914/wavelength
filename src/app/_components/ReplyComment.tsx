import { CommentItem } from "./CommentItem";
import type { Reply } from "./CommentsList";

type ReplyCommentType = {
  reply: Reply;
  currentUser: {
    id: string;
    role: string;
  } | null;
  waveId: string;
  depth: number;
  index: number;
  replies: Reply[];
};

export function ReplyComment({
  reply,
  currentUser,
  waveId,
  depth,
  index,
  replies,
}: ReplyCommentType) {
  return (
    <CommentItem
      key={reply.id}
      comment={reply}
      currentUser={currentUser}
      waveId={waveId}
      depth={depth + 1}
      isLast={index === replies.length - 1}
      replies={replies}
    />
  );
}
