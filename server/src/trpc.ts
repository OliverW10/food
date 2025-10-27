// This file was created by Oliver/Mukund on setup and was worked on by a few people
import { initTRPC, TRPCError } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/dist/adapters/standalone.cjs";
import { IncomingMessage, ServerResponse } from "http";
import { UserClaims, verifyAccessToken } from "./service/auth";
import { flattedTransformer } from "./transformer";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

export interface Context {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
}

export type AuthedContext = Context & { user: UserClaims };

export function createContext(opts: CreateHTTPContextOptions) {
  return { req: opts.req, res: opts.res };
}
const t = initTRPC.context<Context>().create({
  transformer: flattedTransformer,
});

const isAuthed = t.middleware<AuthedContext>(({ ctx, next }) => {
  const token = ctx.req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = verifyAccessToken(token);
    if (typeof decoded === "string") {
      throw new TRPCError({
        message: "Invalid token",
        code: "PARSE_ERROR",
      });
    }
    return next({ ctx: { ...ctx, user: decoded } });
  } catch {
    throw new TRPCError({
      message: "Invalid token",
      code: "UNAUTHORIZED",
    });
  }
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
