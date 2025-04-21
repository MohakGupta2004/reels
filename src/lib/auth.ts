import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Username", type: "text", placeholder: "jsmit" },
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.name || !credentials?.email || !credentials?.password) {
          throw new Error("Missing email")
        }

        try {
          await connectDB()
          const email = credentials.email
          const existedUser = await User.findOne({
            email
          })
          if (!existedUser) {
            throw new Error("NO user found")
          }
          const checkPassword = await bcrypt.compare(credentials.password, existedUser.password)
          if (!checkPassword) {
            throw new Error("Wrong password")
          }
          return {
            id: existedUser._id.toString(),
            email: existedUser.email
          }
        } catch (error) {

        }

        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
}
