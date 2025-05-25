import { Skeleton } from "~/components/ui/skeleton";

export default function ProfileSkeleton(){
    return(
        <>
            <div className="mb-8">
          <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-300 rounded-t-lg" />
          <div className="px-6 -mt-12">
            <div className="h-24 w-24 rounded-full border-4 border-background overflow-hidden">
              <div className="h-full w-full">
            <Skeleton className="h-full w-full rounded-full" />
              </div>
            </div>
            <div className="flex items-start justify-between mt-4">
              <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <span className="text-muted-foreground">Waves</span>
              </div>
              <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <span className="text-muted-foreground">Following</span>
              </div>
              <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <span className="text-muted-foreground">Followers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
          <div className="md:col-span-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
          <div className="md:col-span-4 rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        </>
    )
}