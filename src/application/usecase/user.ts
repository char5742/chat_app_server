import { UserInfo } from "@/src/domain/graphql";
import { PrismaClient, User } from "@prisma/client";
import { createToken } from "../component/auth";
import { uuid } from "uuidv4";
export class UserUsecase {
  static async signUp({ db, info }: { db: PrismaClient; info: UserInfo }) {
    return await db.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          ...info,
          key: uuid(),
          accessToken: "",
        },
      });
      const token = createToken(user.id);
      const updatedUser = await prisma.user.update({
        data: {
          accessToken: token,
        },
        where: {
          id: user.id,
        },
      });
      return updatedUser;
    });
  }
  static async getUser({ db, userKey }: { db: PrismaClient; userKey: string }) {
    const user = await db.user.findUnique({
      where: {
        key: userKey,
      },
    });
    return user;
  }

  static getUserWatch({ db, userKey }: { db: PrismaClient; userKey: string }) {
    const user = db.user.findUnique({
      where: {
        key: userKey,
      },
    });
    return user;
  }

  static async delete({ db, userKey }: { db: PrismaClient; userKey: string }) {
    const user = await db.user.delete({
      where: {
        key: userKey,
      },
    });
    return user.id;
  }
}
