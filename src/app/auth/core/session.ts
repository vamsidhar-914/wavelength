import { cookies } from "next/headers";
import { z } from "zod";
import crypto from 'crypto'
import { redisClient } from "~/redis/redis";

const sessionSchema = z.object({
    id: z.number(),
    role: z.string()
})

const SESSION_EXPIRATION = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY= "session-id"

export type Cookies = {
    set: (
        key: string,
        value: string,
        options: {
            secure?: boolean
            httpOnly?: boolean
            sameSite?: "strict" | "lax"
            expires?: number
        }
    ) => void
    get: (key: string) => { name: string , value: string } | undefined
    delete: (key: string) => void
}

export async function createUserSession(user: z.infer<typeof sessionSchema>, cookies: Cookies){
    const sessionId = crypto.randomBytes(512).toString('hex').normalize();
    // you can store in a database
    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION
    });

    setCookie(sessionId,cookies);
}

function setCookie(sessionId: string, cookies: Pick<Cookies, 'set'>){
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXPIRATION * 1000
    })
}

