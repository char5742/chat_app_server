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
    context.role = Role.user;
    return user;
  },
  userDelete: async (
    _parent,
    args: {
      userKey: string;
    },
    context: Context
  ) => {
    if (context.role == Role.guest) {
      throw Error("not authorized");
    }
    return await UserUsecase.delete({
      db: context.prisma,
      userKey: args.userKey,
    });
  },

  chatSend: async (
    parent,
    args: {
      info: ChatInfo;
    },
    context: Context
  ) => {
    if (context.role == Role.guest) {
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
    if (context.role == Role.guest) {
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
