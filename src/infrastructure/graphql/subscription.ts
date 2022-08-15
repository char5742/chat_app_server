import "@/src/application/usecase";
import { UserUsecase, ChatUsecase } from "@/src/application/usecase";
import {
  Chat,
  SubscriptionResolvers,
  User,
  UserInfo,
} from "@/src/domain/graphql";
import { Context, Role } from "@/src/infrastructure/context";
import { pubsub, Topic } from "@/src/infrastructure/pubsub";

export const Subscription: SubscriptionResolvers = {
  chatSend: {
    subscribe: (_, __, context: Context) => {
      if (context.role == Role.guest) {
        throw Error("not authorized");
      }
      return {
        [Symbol.asyncIterator]: () =>
          pubsub.asyncIterator<{ chatSend: Chat }>(
            `${Topic.CHAT_SENDED_TOPIC}.${context.userKey}`
          ),
      };
    },
  },
  chatDelete: {
    subscribe: (_, __, context: Context) => {
      if (context.role == Role.guest) {
        throw Error("not authorized");
      }
      return {
        [Symbol.asyncIterator]: () =>
          pubsub.asyncIterator<{ chatDelete: number }>(
            `${Topic.CHAT_DELETED_TOPIC}.${context.userKey}`
          ),
      };
    },
  },
  userFollow: {
    subscribe: (_, __, context: Context) => {
      if (context.role == Role.guest) {
        throw Error("not authorized");
      }
      return {
        [Symbol.asyncIterator]: () =>
          pubsub.asyncIterator<{ userFollow: number }>(
            `${Topic.USER_FOLLOW_TOPIC}.${context.userKey}`
          ),
      };
    },
  },
  userUnFollow: {
    subscribe: (_, __, context: Context) => {
      if (context.role == Role.guest) {
        throw Error("not authorized");
      }
      return {
        [Symbol.asyncIterator]: () =>
          pubsub.asyncIterator<{ userUnFollow: number }>(
            `${Topic.USER_UNFOLLOW_TOPIC}.${context.userKey}`
          ),
      };
    },
  },
};
