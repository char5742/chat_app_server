import { PrismaClient } from "@prisma/client";
import {
  decodeAuthHeader,
  AuthTokenPayload,
} from "@/src/application/component/auth";
import { Request } from "express";
import { GraphQLRequestContext } from "apollo-server-core";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userKey?: string;
  role: Role;
}

export enum Role {
  admin,
  user,
  guest,
}
export const context = ({ req }: { req: Request }): Context => {
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;
  return {
    prisma,
    userKey: token?.userKey,
    role: Role.user,
  };
};

export const wscontext = (ctx: any, _: any, __: any): Context => {
  const token =
    ctx && ctx.connectionParams.Authorization
      ? decodeAuthHeader(ctx.connectionParams.Authorization)
      : null;
  return {
    prisma,
    userKey: token?.userKey,
    role: Role.user,
  };
};
