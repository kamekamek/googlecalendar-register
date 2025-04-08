import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
} 
