import { UserType } from "@prisma/client";
import "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User {
    type: string;
  }

  interface Session {
    user: {
      type: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    type: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    type: string;
  }
}
