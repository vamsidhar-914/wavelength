"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "~/trpc/react";

type User = {
    id: string
    role: string
}

type UserContextType = {
    user: User | undefined | null;
    isLoading: boolean;
    refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: user, isLoading, refetch } = api.user.getCurrentUser.useQuery();
    
    return (
        <UserContext.Provider value={{ user,isLoading,refetch }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser must be used within a UserProvider")
    }
    return context;
}