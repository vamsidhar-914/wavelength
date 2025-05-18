import { z } from "zod";
import {  createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { signupSchema } from "~/app/_components/schemas";
import { comparePasswords, generateSalt, hashPassowrd } from "~/app/auth/core/passwordHasher";
import { COOKIE_SESSION_KEY, createUserSession, getUserSessionById, removeUserFromSession } from "~/app/auth/core/session";
import { cookies } from "next/headers";

export const userRouter = createTRPCRouter({
    getUser: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(({ input }) => {
            return  {
                id:input.userId,
                name: "vamsi"
            }
        }),
    signUp: publicProcedure
        .input(signupSchema).mutation(async ({ input,ctx }) => {
            const existingUser = await ctx.db.user.findFirst({
                where: {
                    email: input.email
                }
            })
            if(existingUser != null){
                return "account already exists for this email"
            }
           try{
                const salt = generateSalt()
                const hashedPassword = await hashPassowrd(input.password, salt);
                const user = await ctx.db.user.create({
                    data: {
                        email: input.email,
                        name: input.name,
                        password: hashedPassword,
                        salt
                    },
                    select: {
                        id: true,
                        role: true
                    }
                })
                if(user == null){
                    return 'unable to create a account'
                }
                await createUserSession(user, await cookies());

                return 'user created successfully'
           }catch(err){
            return `unable to create account ${err}`
           }
           
        }),
    getCurrentUser: publicProcedure
        .query(async({ ctx }) => {
            const sessionId = ctx.cookies[COOKIE_SESSION_KEY];
            if(sessionId == null) return null   
            const user = await getUserSessionById(sessionId);
            return user
        }),
    signIn: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string()
        }))
        .mutation(async ({ ctx,input }) => {
            const user = await ctx.db.user.findFirst({
                where: {
                    email: input.email
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    salt: true,
                    password: true,
                    role:true
                }
            })
            if(user == null) return "user not found,unable to login"
            const isCorrectPassword = await comparePasswords({
                hashedPassword: user.password,
                password: input.password,
                salt: user.salt
            })
            if(!isCorrectPassword){
                return "incorrect password"
            }
            const userData = {
                id: user.id,
                role: user.role
            }
            await createUserSession(userData , await cookies());
            return "user logged in successfully"
        }),
    logout: publicProcedure
        .mutation(async ({ ctx }) => {
            const sessionId = ctx.cookies[COOKIE_SESSION_KEY];
            if(sessionId == null){
                return "sessionId not found"
            }
            await removeUserFromSession(await cookies(),sessionId)
            return "loggedout successfully"
        }),
    getContext: protectedProcedure
        .query(async ({ ctx }) => {
            return "this is protected route"
        })
})