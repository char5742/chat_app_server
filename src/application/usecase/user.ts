import { UserInfo } from "@/src/domain/graphql";
import { PrismaClient, User } from "@prisma/client";
import { createToken } from "../component/auth";
import { v4 } from "uuid";
export class UserUsecase {
  static async signUp({ db, info }: { db: PrismaClient; info: UserInfo }) {
    return await db.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          ...info,
          key: v4(),
          accessToken: "",
        },
      });
      const token = createToken(user.key);
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

  static async delete({ db, userKey }: { db: PrismaClient; userKey: string }) {
    const user = await db.user.delete({
      where: {
        key: userKey,
      },
    });
    return user.id;
  }

  static async follow({
    db,
    userKey,
    targetKey,
  }: {
    db: PrismaClient;
    userKey: string;
    targetKey: string;
  }) {
    const targetUser = await db.user.update({
      where: {
        key: targetKey,
      },
      data: {
        followBy: {
          connect: {
            key: userKey,
          },
        },
      },
    });

    await db.user.update({
      where: {
        key: userKey,
      },
      data: {
        following: {
          connect: {
            key: targetKey,
          },
        },
      },
    });
    return targetUser;
  }

  static async unfollow({
    db,
    userKey,
    targetKey,
  }: {
    db: PrismaClient;
    userKey: string;
    targetKey: string;
  }) {
    const targetUser = await db.user.update({
      where: {
        key: targetKey,
      },
      data: {
        followBy: {
          disconnect: {
            key: userKey,
          },
        },
      },
    });

    await db.user.update({
      where: {
        key: userKey,
      },
      data: {
        following: {
          disconnect: {
            key: targetKey,
          },
        },
      },
    });
    return targetUser;
  }
}
