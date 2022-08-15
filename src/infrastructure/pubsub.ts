import { PubSub } from "graphql-subscriptions";
export const pubsub = new PubSub();
export enum Topic {
  CHAT_SENDED_TOPIC,
  CHAT_DELETED_TOPIC,
  USER_FOLLOW_TOPIC,
  USER_UNFOLLOW_TOPIC,
}
