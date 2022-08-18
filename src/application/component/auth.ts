import { APP_SECRET } from "@/src/const";
import * as jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userKey: string;
}

export function decodeAuthHeader(authHeader: string): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token found");
  }
  return jwt.verify(token, APP_SECRET) as AuthTokenPayload;
}

export function createToken(userKey: string): string {
  return jwt.sign({ userKey: userKey }, APP_SECRET);
}
