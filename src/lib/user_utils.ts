import { getUserSessionById } from "~/app/auth/core/session";
import { cookies } from "next/headers"

export const getServerSideUser = async () => {
    const nextCookies = await cookies()
    const sessionId = nextCookies.get("session-id")?.value

    if(sessionId == null){
        return null
    }
    const user = getUserSessionById(sessionId);
    return user;
}

export const getSessionCookie = async () => {
    const nextCookies = await cookies()
    const sessionId = nextCookies.get("session-id")?.value
    if(sessionId == null){
        return null
    }
    return sessionId
}