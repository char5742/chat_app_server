import "@/src/application/usecase";
import { UserUsecase } from "@/src/application/usecase";
import { QueryResolvers } from "@/src/domain/graphql";
import { Role } from "@/src/infrastructure/context";
export const Query: QueryResolvers = {
  user: async (
    _parent,
    args: {
      userKey: string;
    },
    context
  ) => {
    if (context.role == Role.guest) {
      throw Error("not authorized");
    }
    return await UserUsecase.getUser({
      db: context.prisma,
      userKey: args.userKey,
    });
  },
};
