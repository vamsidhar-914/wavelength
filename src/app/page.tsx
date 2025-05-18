"use client"

import { getQueryKey } from "@trpc/react-query";
import { WaveIcon } from "./_components/wave-icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { ArrowUp, Icon, LoaderIcon } from "lucide-react";
import { toast } from "~/hooks/use-toast";

export default function Home() {
  const { data , refetch , isLoading } = api.user.getCurrentUser.useQuery();

  const { mutate } = api.user.logout.useMutation({
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
      <div className="container max-w-4xl py-6">
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
          <Link href="/">
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
      </div>
  );
}
