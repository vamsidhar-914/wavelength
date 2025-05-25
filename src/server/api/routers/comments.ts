import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  // top level comments
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
          replyToId: null
        },
        select: {
          content: true,
          id: true,
          createdAt: true,
          replies: {
            select: {
              id: true,
              createdAt: true,
              content: true,
              replyToId: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              },
              replies: {
                select: {
                  createdAt: true,
                  content: true,
                  id: true,
                  replyToId: true,
                  user: {
                    select: {
                      id: true,
                      name: true
                    }
                  },
                  replies: {
                    select: {
                      createdAt: true,
                      content: true,
                      id: true,
                      replyToId: true,
                      user: {
                        select: {
                          id: true,
                          name: true
                        }
                      },
                    }
                  }
                }
              }
            }
          },
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
            replies: comment.replies
          };
        }),
      };
    }),
  createComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        waveId: z.string(),
        parentId: z.string().optional()
      }),
    )
    .mutation(async ({ ctx, input: { content, waveId,parentId } }) => {
      const wave = await ctx.db.comment.create({
        data: {
          content,
          tweetId: waveId,
          replyToId: parentId,
          userId: ctx.user.id,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          replies: {
            select: {
              id: true,
              createdAt: true,
              content: true,
              replyToId: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              },
              replies: {
                select: {
                  createdAt: true,
                  content: true,
                  id: true,
                  replyToId: true,
                  user: {
                    select: {
                      id: true,
                      name: true
                    }
                  },
                  replies: {
                    select: {
                      createdAt: true,
                      content: true,
                      id: true,
                      replyToId: true,
                      user: {
                        select: {
                          id: true,
                          name: true
                        }
                      },
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return {
        id: wave.id,
        content: wave.content,
        createdAt: wave.createdAt,
        user: wave.user,
        replies: wave.replies
      };
    }),
  createReply: protectedProcedure
    .input(
      z.object({
        parentId: z.string(),
        waveId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { parentId, waveId, content } }) => {
      const replyComment = await ctx.db.comment.create({
        data: {
          content,
          replyToId: parentId,
          userId: ctx.user.id,
          tweetId: waveId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          replies: {
            select: {
              id: true,
              createdAt: true,
              content: true,
              replyToId: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              },
              replies: {
                select: {
                  createdAt: true,
                  content: true,
                  id: true,
                  replyToId: true,
                  user: {
                    select: {
                      id: true,
                      name: true
                    }
                  },
                  replies: {
                    select: {
                      createdAt: true,
                      content: true,
                      id: true,
                      replyToId: true,
                      user: {
                        select: {
                          id: true,
                          name: true
                        }
                      },
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return {
        id: replyComment.id,
        content: replyComment.content,
        createdAt: replyComment.createdAt,
        user: replyComment.user,
        replies: replyComment.replies
      };
    }),
});
