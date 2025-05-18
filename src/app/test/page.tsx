"use client"

import { api } from "~/trpc/react"

export default function TestPage(){

    const { data,error ,isError,isLoading } = api.user.getContext.useQuery(undefined,{
        retry: false
    });

    if(isLoading) return <h1>Loading</h1>    

    if (isError && error?.data?.code === "UNAUTHORIZED") {
        return <div>You must be logged in to view this page.</div>;
      }

    return (
        <h1>testing</h1>
    )
}