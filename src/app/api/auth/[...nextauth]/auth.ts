import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar openid email profile',
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Debug: JWT Callback - Account:', account ? 'Account exists' : 'No account');
      }
      if (account) {
        token.accessToken = account.access_token;
        if (process.env.NODE_ENV === 'development') {
          console.log('Debug: JWT Callback - Setting access token:', account.access_token?.substring(0, 10) + '...');
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Debug: Session Callback - Token:', token ? 'Token exists' : 'No token');
      }
      if (token) {
        session.accessToken = token.accessToken;
        if (process.env.NODE_ENV === 'development') {
          console.log('Debug: Session Callback - Setting session access token');
        }
      }
      return session;
    },
  },
}; 