import { ChatResolvers } from "@/src/domain/graphql";
import { Context, Role } from "@/src/infrastructure/context";

export const Chat: ChatResolvers = {
  sender: async (parent, _args, context: Context) => {
    return context.prisma.chat
      .findUnique({ where: { id: parent.id } })
      .sender();
  },
  reciever: async (parent, _args, context: Context) => {
    return context.prisma.chat
      .findUnique({ where: { id: parent.id } })
      .reciever();
  },
};
