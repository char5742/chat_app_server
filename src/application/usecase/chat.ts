import { ChatInfo } from "@/src/domain/graphql";
import { PrismaClient } from "@prisma/client";
import { uuid } from "uuidv4";
export class ChatUsecase {
  static async send({
    db,
    info,
    senderKey,
  }: {
    db: PrismaClient;
    info: ChatInfo;
    senderKey: string;
  }) {
    const chat = await db.chat.create({
      data: {
        ...info,
        key: uuid(),
        senderKey,
      },
    });
    return chat;
  }

  static async delete({ db, chatKey }: { db: PrismaClient; chatKey: string }) {
    const chat = await db.chat.delete({
      where: {
        key: chatKey,
      },
    });
    return chat;
  }
}
