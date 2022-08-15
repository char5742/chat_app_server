import { Resolvers } from "@/src/domain/graphql";
import {
  Query,
  Mutation,
  User,
  Subscription,
  Chat,
} from "@/src/infrastructure/graphql";

export const resolvers: Resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Chat,
};
