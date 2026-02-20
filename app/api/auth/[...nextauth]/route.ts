// lib/auth.ts  o  app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth"; // ✅ Importar NextAuthOptions
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ✅ CAMBIO 1: Exportar authOptions como constante tipada
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { 
            profile: true,
            subscription: {
              include: {
                plan: true
              }
            },
            // ✅ MEJORA OPCIONAL: Incluir messageUsage
            messageUsage: true,
          },
        });

        if (user) {
          session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile ? {
              birthDate: user.profile.birthDate,
              gender: user.profile.gender,
              country: user.profile.country,
            } : null,
            subscription: user.subscription ? {
              id: user.subscription.id,
              status: user.subscription.status,
              expiresAt: user.subscription.expires_at,
              plan: {
                id: user.subscription.plan.id,
                name: user.subscription.plan.name,
                price: user.subscription.plan.price,
              }
            } : null,
            // ✅ MEJORA OPCIONAL: Incluir info de mensajes en sesión
            messageUsage: user.messageUsage ? {
              messagesSent: user.messageUsage.messagesSent,
              maxMessages: user.messageUsage.maxMessages,
              remaining: user.messageUsage.maxMessages - user.messageUsage.messagesSent,
            } : null,
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };