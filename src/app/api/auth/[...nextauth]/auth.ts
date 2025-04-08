import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

async function refreshAccessToken(token: any) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("トークンの更新中にエラーが発生しました:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/calendar.events openid email',
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
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Debug: JWT Callback - Setting tokens from account');
          console.log('Debug: Access token:', account.access_token?.substring(0, 10) + '...');
          console.log('Debug: Refresh token exists:', !!account.refresh_token);
          console.log('Debug: Token expiration:', new Date(token.accessTokenExpires as number));
        }
        return token;
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Debug: Token is still valid, no refresh needed');
        }
        return token;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Debug: Token expired, refreshing...');
      }
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Debug: Session Callback - Token:', token ? 'Token exists' : 'No token');
      }
      if (token) {
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
        session.error = token.error;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Debug: Session Callback - Setting session from token');
        }
      }
      return session;
    },
  },
};  