import { initTRPC, TRPCError } from "@trpc/server";
import type { NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";
import cookie from 'cookie'

import { db } from "~/server/db";
import { getUserSessionById } from "~/app/auth/core/session";
import { cookies } from "next/headers";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export interface CreateContextOptions {
  headers: Headers,
  req?: NextRequest,
  res?: Response
}

export const createTRPCContext = async (opts: CreateContextOptions) => {
  const { headers,res,req } = opts;
  const cookieHeader = opts.headers.get("cookie") || ""
  const cookies = cookie?.parse(cookieHeader);
  
  let sessionId: string | undefined;
  if(req?.cookies){
    sessionId = cookies["session-id"]
  }else{
    const cookieHeader = headers.get('cookie')
    if(cookieHeader){
      const cookies = cookieHeader.split(";")
      for(const cookie of cookies){
        const [name,value] = cookie.trim().split("=")
        if(name === "session-id"){
          sessionId = value;
        }
      }
    }
  }

  let user = null;
  let isAdmin = false
  if(sessionId){
    try{
        user = await getUserSessionById(sessionId);
        if(user?.role === 'ADMIN'){
          isAdmin = true
        }else{
          isAdmin = false
        }
    }catch(error){
      console.log("error fetching user session:", error);
    }
  }

  return {
    isAdmin,
    db,
    cookies,
    headers,
    user,
    req,
    res
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */

const protectedMiddleware = t.middleware(async ({ ctx,next }) => {
  if(!ctx.user){
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: "you are not authenticated"
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  })
})

const adminMiddleware = t.middleware(async ({ ctx,next }) => {
  if(!ctx.isAdmin){
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: "you does not have admin access"
    })
  }
  return next({
    ctx: {
      ...ctx,
      isAdmin: ctx.isAdmin
    }
  })
})

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);
export const protectedProcedure = t.procedure.use(protectedMiddleware);
export const adminProcedure = t.procedure.use(adminMiddleware);
