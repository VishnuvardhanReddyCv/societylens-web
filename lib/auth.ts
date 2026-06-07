import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        accessToken: { label: 'Access Token', type: 'text' },
        name: { label: 'Name', type: 'text' },
        role: { label: 'Role', type: 'text' },
        complexId: { label: 'Complex ID', type: 'text' },
        unitId: { label: 'Unit ID', type: 'text' },
        userId: { label: 'User ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        // If an accessToken is passed directly (register/join flow), use it
        if (credentials.accessToken) {
          return {
            id: credentials.userId,
            name: credentials.name,
            email: credentials.email,
            role: credentials.role,
            complexId: credentials.complexId,
            unitId: credentials.unitId || null,
            accessToken: credentials.accessToken,
          }
        }

        // Normal login flow
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            { email: credentials.email, password: credentials.password }
          )
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            complexId: data.user.complex_id,
            unitId: data.user.unit_id || null,
            accessToken: data.access_token,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken
        token.role = (user as any).role
        token.complexId = (user as any).complexId
        token.unitId = (user as any).unitId
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.role = token.role as string
      session.user.complexId = token.complexId as string
      session.user.unitId = token.unitId as string | null
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
}
