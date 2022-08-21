import "@/src/application/usecase";
import { UserUsecase, ChatUsecase } from "@/src/application/usecase";
import { ChatInfo, MutationResolvers, UserInfo } from "@/src/domain/graphql";
import { Context, Role } from "@/src/infrastructure/context";
import { pubsub, Topic } from "../pubsub";
export const Mutation: MutationResolvers = {
  userSignUp: async (
    _parent,
    args: {
      info: UserInfo;
    },
    context: Context
  ) => {
    const user = await UserUsecase.signUp({
      db: context.prisma,
      info: args.info,
    });
    context.userKey = user.key;
    return user;
  },
  userDelete: async (
    _parent,
    args: {
      userKey: string;
    },
    context: Context
  ) => {
    if (!context.userKey) {
      throw Error("not authorized");
    }
    return await UserUsecase.delete({
      db: context.prisma,
      userKey: context.userKey,
    });
  },
  userFollow: async (
    _parent,
    args: {
      userKey: string;
    },
    context: Context
  ) => {
    if (!context.userKey) {
      throw Error("not authorized");
    }
    const user = await UserUsecase.follow({
      db: context.prisma,
      userKey: context.userKey,
      targetKey: args.userKey,
    });
    await pubsub.publish(`${Topic.USER_FOLLOW_TOPIC}.${args.userKey}`, {
      userFollow: await UserUsecase.getUser({
        db: context.prisma,
        userKey: context.userKey,
      }),
    });
    return user;
  },

  userUnFollow: async (
    _parent,
    args: {
      userKey: string;
    },
    context: Context
  ) => {
    if (!context.userKey) {
      throw Error("not authorized");
    }
    const user = await UserUsecase.unfollow({
      db: context.prisma,
      userKey: context.userKey,
      targetKey: args.userKey,
    });
    await pubsub.publish(`${Topic.USER_UNFOLLOW_TOPIC}.${args.userKey}`, {
      userUnfollow: await UserUsecase.getUser({
        db: context.prisma,
        userKey: context.userKey,
      }),
    });
    return user;
  },

  chatSend: async (
    parent,
    args: {
      info: ChatInfo;
    },
    context: Context
  ) => {
    if (!context.userKey) {
      throw Error("not authorized");
    }
    const chat = await ChatUsecase.send({
      db: context.prisma,
      info: args.info,
      senderKey: context.userKey!,
    });
    await pubsub.publish(`${Topic.CHAT_SENDED_TOPIC}.${chat.recieverKey}`, {
      chatSend: chat,
    });
    return chat;
  },
  chatDelete: async (
    parent,
    args: {
      chatKey: string;
    },
    context: Context
  ) => {
    if (!context.userKey) {
      throw Error("not authorized");
    }
    const chat = await ChatUsecase.delete({
      db: context.prisma,
      chatKey: args.chatKey,
    });
    await pubsub.publish(`${Topic.CHAT_DELETED_TOPIC}.${chat.recieverKey}`, {
      chatDelete: chat.id,
    });

    return chat.id;
  },
};
