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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          });

          const userData = response.data;

          if (userData && userData.access_token) {
            return {
              id: userData.user_id || credentials.email,
              email: credentials.email,
              accessToken: userData.access_token,
              name: userData.name || credentials.email, // Optional: if your API returns a name
              role: userData.role || 'user', // Optional: if your API returns a role
            };
          }

          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('Auth Error:', error.response?.data || error.message);
          
          // More specific error messages
          if (error.response?.status === 401) {
            throw new Error('Invalid email or password');
          }
          if (error.response?.status === 404) {
            throw new Error('User not found');
          }
          if (error.response?.status === 429) {
            throw new Error('Too many attempts. Please try again later');
          }
          
          throw new Error(error.response?.data?.detail || 'Authentication failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          email: user.email,
          role: user.role,
        };
      }

      // Return previous token if the access token has not expired yet
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: token.email,
        role: token.role,
      };
      session.accessToken = token.accessToken;
      
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error', // Add an error page
    signOut: '/', // Redirect to home after signout
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});