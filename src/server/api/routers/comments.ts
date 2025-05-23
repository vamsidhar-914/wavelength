import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  getCommentsByWaveId: protectedProcedure
    .input(
      z.object({
        waveId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { waveId } }) => {
      const data = await ctx.db.comment.findMany({
        where: {
          tweetId: waveId,
        },
        select: {
          content: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return {
        comments: data.map((comment) => {
          return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            user: comment.user,
          };
        }),
      };
    }),
});
