import { WaveIcon } from "./wave-icon";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useUser } from "~/context/userContext";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import Link from "next/link";

export default function Header(){
    const { user: data,isLoading,refetch } = useUser()
      
      const { mutate } = api.auth.logout.useMutation({
        onSuccess(data, variables, context) {
            refetch()
            console.log(data)
            toast({
              title: "user logged out",
              description: data,
              variant: "destructive"
          })
        },
      })
    
      function handleLogout(){
        mutate(); 
      }

    return (
        <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Link href="/">
                    <WaveIcon className="h-8 w-8 text-emerald-500" />
                  </Link>
                  <h1 className="text-2xl font-bold">Wavelength</h1>
                </div>
                {isLoading ?  (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                ) : data ? (
                  <div className="flex items-center gap-4">
                  <Link href="/createTweet">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">New Wave</Button>
                  </Link>
                  <Link href={`/`}>
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                  </Link>
                </div>
                ) : (
                  <div className="flex items-center gap-4">
                  <Link href="/login">
                    <Button variant="outline">Log in</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Sign up</Button>
                  </Link>
                </div>
                )}
              </header>
    )
}