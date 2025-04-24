// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '../../../utils/api';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data) {
            return {
              id: response.data.user_id || credentials.email,
              email: credentials.email,
              accessToken: response.data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth Error:', error.response?.data || error.message);
          throw new Error(error.response?.data?.detail || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});