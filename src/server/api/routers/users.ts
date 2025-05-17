import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    getUser: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(({ input }) => {
            return  {
                id:input.userId,
                name: "vamsi"
            }
        }),
    updateUser: publicProcedure
        .input(z.object({ 
            name: z.string(), 
            userId: z.string()
        }))
        .output(z.object({
            name: z.string(),
            id: z.string()
        }))
        .mutation(req => {
            console.log(`updating the user ${req.input.userId} to have the name ${req.input.name}`)
            return {
                id: req.input.userId,
                name: req.input.name
             }
        }),
    secretData: adminProcedure
        .query(({ ctx }) => {
            console.log(ctx.user);
            return "super top secret data"
        })
})