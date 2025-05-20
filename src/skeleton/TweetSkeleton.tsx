import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"

export function TweetSkeleton() {
  return (
    <Card className="overflow-hidden border-muted/40 dark:border-muted/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Random chance to show image skeleton */}
        {Math.random() > 0.5 && <Skeleton className="h-[200px] w-full rounded-md mt-3" />}

        <div className="flex gap-2 mt-3">
          {Math.random() > 0.5 && <Skeleton className="h-5 w-16 rounded-full" />}
          {Math.random() > 0.5 && <Skeleton className="h-5 w-16 rounded-full" />}
        </div>

        <Skeleton className="h-3 w-[100px] mt-2" />
      </CardContent>
      <CardFooter className="border-t border-muted/30 p-2 flex items-center justify-between">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </CardFooter>
    </Card>
  )
}

export function TweetSkeletonList() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <TweetSkeleton key={index} />
      ))}
    </div>
  )
}
