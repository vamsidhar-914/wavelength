import type { Prisma } from "@prisma/client";
import { TRPCError, type inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      const currentUserId = ctx.user?.id;

      const data = await ctx.db.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        where: { userId },
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = {
            id: nextItem.id,
            createdAt: nextItem.createdAt,
          };
        }
      }
      return {
        tweets: data.map((tweet) => {
          return {
            id: tweet.id,
            content: tweet.content,
            createdAt: tweet.createdAt,
            likeCount: tweet._count.likes,
            user: tweet.user,
            likedByMe: tweet.likes?.length > 0,
          };
        }),
        nextCursor,
      };
    }),
  // infiniteQuery
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ input: { limit = 10, onlyFollowing, cursor }, ctx }) => {
      const currentUserId = ctx.user?.id;

      const data = await ctx.db.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        where:
          currentUserId == null || !onlyFollowing
            ? undefined
            : {
                user: {
                  followers: { some: { id: currentUserId } },
                },
              },
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = {
            id: nextItem.id,
            createdAt: nextItem.createdAt,
          };
        }
      }
      return {
        tweets: data.map((tweet) => {
          return {
            id: tweet.id,
            content: tweet.content,
            createdAt: tweet.createdAt,
            likeCount: tweet._count.likes,
            user: tweet.user,
            likedByMe: tweet.likes?.length > 0,
          };
        }),
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const tweet = await ctx.db.tweet.create({
        data: {
          content,
          userId: ctx.user.id,
        },
      });
      return tweet;
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { userId: ctx.user.id, tweetId: id };
      const existingLike = await ctx.db.like.findUnique({
        where: { userId_tweetId: data },
      });
      if (existingLike == null) {
        await ctx.db.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.db.like.delete({
          where: { userId_tweetId: data },
        });
        return { addedLike: false };
      }
    }),
  adminRoute: adminProcedure.mutation(async ({ ctx }) => {
    return ctx.isAdmin;
  }),
  getUserById: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx,input: { id } }) => {
      const currentUserId = ctx.user?.id
        const user = await ctx.db.user.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            _count: {
              select: {
                followers: true,
                follows: true,
                tweets: true,
              },
            },
            followers:
              currentUserId == null ? undefined : { where: { id: currentUserId } },
          },
        });
        if (user == null) return;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          tweetsCount: user._count.tweets,
          followsCount: user._count.follows,
          followersCount: user._count.followers,
          isFollowing: user.followers.length > 0
        }
    }),
  toggleFollow: protectedProcedure
    .input(z.object({
      userId: z.string()
    }))
    .mutation(async({ ctx,input: { userId} }) => {
      const currentUserId = ctx.user.id
      // we are getting user by userid if they are followed by me
      const existingFollow = await ctx.db.user.findFirst({
        where: {
          id: userId,
          followers: {
            some: { id: currentUserId }
          }
        }
      })
      let addedFollow;
      if(existingFollow == null){
        await ctx.db.user.update({
          where: { id: userId },
          data: {
            followers: { connect: { id: currentUserId } }
          }
        })
        addedFollow = true;
      }else{
        await ctx.db.user.update({
          where: { id: userId },
          data: {
            followers: { disconnect: { id: currentUserId } }
          }
        })
        addedFollow = false
      }
      return { addedFollow };
    }),
  getWaveById: publicProcedure
    .input(
      z.object({
        waveId: z.string(),
      })
    )
    .query(async ({ ctx,input: { waveId } }) => {
      const currentUserId = ctx.user?.id
      const wave = await ctx.db.tweet.findFirst({
        where: {
          id: waveId,
        },
        select:{
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        }
      })
      if(wave == null){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "no post found with this id"
        })
      }
      return {
        id: wave.id,
        content: wave.content,
        createdAt: wave.createdAt,
        likeCount: wave._count.likes,
        user: wave.user,
        likedByMe: wave.likes?.length > 0,
      };
    }),
  deleteWave: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
        isAuthor: z.boolean(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input: { tweetId, isAuthor, createdAt } }) => {
      const existingTweet = await ctx.db.tweet.findUnique({
        where: { createdAt_id: { id: tweetId, createdAt } },
      });
      if (!existingTweet) {
        return { isDeleted: false };
      }
      if (isAuthor) {
        await ctx.db.tweet.delete({
          where: {
            createdAt_id: { createdAt, id: tweetId },
          },
        });
        return { isDeleted: true };
      } else {
        return { isDeleted: false };
      }
    }),
  updateWave: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
        createdAt: z.date(),
        isAuthor: z.boolean(),
      })
    )
    .mutation(async ({ ctx,input: { tweetId, createdAt, isAuthor } }) => {
      if(isAuthor){
        const wave = await ctx.db.tweet.update({
          data:{
            content: "this is the updated content",
            userId: ctx.user.id,
            id: tweetId
          },
          where: { createdAt_id: { createdAt, id: tweetId } },
        })
        return wave;
      }else{
        return null;
      }
    })
});
