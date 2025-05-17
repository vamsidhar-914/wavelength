import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { signupSchema } from "~/app/_components/schemas";
import { generateSalt, hashPassowrd } from "~/app/auth/core/passwordHasher";
import { createUserSession } from "~/app/auth/core/session";
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
    secretData: adminProcedure
        .query(({ ctx }) => {
            console.log(ctx.user);
            return "super top secret data"
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
    getcookie: publicProcedure.query(({ ctx }) => {
        const cookieValue = ctx.cookies["session-id"]
        return cookieValue;
    })
})