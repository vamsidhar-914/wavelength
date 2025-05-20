"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "~/trpc/react";

type User =  typeof api.user.getCurrentUser.useQuery extends () => {
    data: infer U
} 
    ? U
    : unknown;

type UserContextType = {
    user: User | undefined;
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