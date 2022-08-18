import { UserResolvers } from "@/src/domain/graphql";
import { Context, Role } from "@/src/infrastructure/context";

export const User: UserResolvers = {
  accessToken: async (parent, _args, context: Context) => {
    if (
      (context.userKey == parent.key || context.role == Role.admin) &&
      parent.accessToken
    ) {
      return parent.accessToken;
    }
    return null;
  },
  followBy: async (parent, _args, context: Context) => {
    return context.prisma.user
      .findUnique({
        where: {
          id: parent.id,
        },
      })
      .followBy();
  },
  following: async (parent, _args, context: Context) => {
    return context.prisma.user
      .findUnique({
        where: {
          id: parent.id,
        },
      })
      .following();
  },
  recieve: async (parent, _args, context: Context) => {
    if (context.userKey == parent.key || context.role == Role.admin) {
      return context.prisma.user
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .recieve();
    }
    return null;
  },
  send: async (parent, _args, context: Context) => {
    if (context.userKey == parent.key || context.role == Role.admin) {
      return context.prisma.user
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .send();
    }
    return null;
  },
};
