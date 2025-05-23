import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  COOKIE_SESSION_KEY,
  getUserSessionById,
} from "~/app/auth/core/session";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return {
        id: input.userId,
        name: "vamsi",
      };
    }),
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    const sessionId = ctx.cookies[COOKIE_SESSION_KEY];
    if (sessionId == null) return null;
    const user = await getUserSessionById(sessionId);
    return user;
  }),
  getContext: protectedProcedure.query(async ({ ctx }) => {
    return "this is protected route";
  }),
});
