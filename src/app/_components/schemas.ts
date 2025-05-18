import { z } from "zod";

export const signupSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
})