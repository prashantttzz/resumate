import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
session: {
  strategy: "jwt",
  maxAge: 7 * 24 * 60 * 60, // 7 days
  updateAge: 24 * 60 * 60,  // re-issue token every 24h if user is active
},


  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.id, email: user.email, name: user.name };
        }
        return null
      },
    }),
  ],
  pages: {
    error:"/login"  // show errors on the same page
  },  
  secret: process.env.NEXT_AUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: user.name || "user",
            email: user.email!,
          },
        });
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },

    redirect({ url, baseUrl }) {
      // if it's a relative path
      if (url.startsWith("/")) return `${baseUrl}${url}`
      
      try {
        const targetUrl = new URL(url)
        // allow same-origin external URLs
        if (targetUrl.origin === baseUrl) return url
        return baseUrl
      } catch {
        return baseUrl
      }
    }
    

  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
