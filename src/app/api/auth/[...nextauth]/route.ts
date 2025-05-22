import NextAuth, { type NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { db } from "~/server/db"
import Credentials from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    session:{
        strategy: 'jwt'
    },
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    Credentials({
      name: "sign in",
      credentials: {
        email: {
          label: 'Email',
          placeholder: "example@.com",
          type: "email"
        },
        password: {
          label: 'Password',
          type: "password"
        }
      },
      async authorize(credentials){
        const user = { id : "1222", name: "vamsi",email:"hello@example.com" }
        return user;
      }
    })
  ],
  adapter: PrismaAdapter(db),
}

const handler = NextAuth(authOptions)
export { handler as GET,handler as POST }