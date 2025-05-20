import { WaveIcon } from "./wave-icon";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useUser } from "~/context/userContext";
import Link from "next/link";
import { UserNav } from "./UserNav";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./theme-toggle";
import { Skeleton } from "~/components/ui/skeleton";

export default function Header(){
    const { user: data,isLoading,refetch } = useUser()

    return (
           <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3">
        <div className="containe  r flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-all hover:opacity-80">
              <WaveIcon className="h-8 w-8 text-emerald-500" />
              <h1 className="text-2xl font-bold">Wavelength</h1>
            </Link>
          </div>
          <div className="hidden md:block flex-1 px-8 max-w-md mx-4">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            {/* <ThemeToggle />  */}
            {isLoading ?  (
                <Skeleton className="h-10 w-10 rounded-full" />
            ) : data ? (
              <UserNav user={data} />
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    )
}