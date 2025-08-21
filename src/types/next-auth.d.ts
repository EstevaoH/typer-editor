import "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
  }


  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      username?: string;
      email?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id: string;
    username?: string;
    email?: string;
  }
}