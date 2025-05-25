import { CommentItem } from "./CommentItem"

export type Reply = {
    id: string
    createdAt: Date
    content: string
    replyToId: string | null
    user: {
        id: string;
        name: string;
    };
    replies: Reply[]
}

type Comment =  {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name: string
  }
  replies: Reply[]
}

interface CommentListProps {
  comments: Comment[] | undefined
  currentUser: {
    id: string
    role: string
  } | null
  waveId: string
}

export function CommentList({ comments, currentUser,waveId }: CommentListProps) {
  if (comments?.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No responses yet. Be the first to respond!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments?.map((comment,index) => (
        // <Card key={comment.id}>
        //   <CardHeader className="flex flex-row items-center gap-4 p-4">
        //     <Link href={`/profile/${comment.user.id}`}>
        //       <Avatar className="h-8 w-8 border">
        //         <AvatarImage src={"https://github.com/shadcn.png"} alt={comment.user.name} />
        //         <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        //       </Avatar>
        //     </Link>
        //     <div>
        //       <Link href={`/profile/${comment.user.id}`} className="font-medium hover:underline">
        //         {comment.user.name}
        //       </Link>
        //       <p className="text-xs text-muted-foreground">
        //         @{comment.user.name} · {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
        //       </p>
        //     </div>
        //   </CardHeader>
        //   <CardContent className="p-4 pt-0">
        //     <p className="whitespace-pre-wrap">{comment.content}</p>
        //   </CardContent>
        // </Card>
        <CommentItem
            replies={comment.replies}
            key={index}
            comment={comment}
            currentUser={currentUser}
            waveId={waveId}
            depth={0}
            isLast={index === comments.length -1}
        />
      ))}
    </div>
  )
}
