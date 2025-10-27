// Oliver
// server/src/routers/searchApi.ts
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "../db";
import { protectedProcedure, router } from "../trpc";

export const searchApi = router({
  search: protectedProcedure
    .input(
      z.object({
        q: z.string().trim().optional(),
        limit: z.number().int().min(1).max(50).default(20),
        cursor: z.number().int().nullable().optional(), // paginate by user.id
      })
    )
    .query(async ({ ctx, input }) => {
      const email = (ctx.user as { email?: string })?.email;
      if (!email) throw new Error("Unauthorized");

      const me = await db.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!me) throw new Error("Unauthorized");

      const where: Prisma.UserWhereInput = {
        id: { not: me.id }, // ← exclude self
        ...(input.q
          ? {
              OR: [
                { name: { contains: input.q, mode: "insensitive" } },
                { email: { contains: input.q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(input.cursor ? { id: { gt: input.cursor } } : {}),
      };

      const rows = await db.user.findMany({
        where,
        orderBy: { id: "asc" },
        take: input.limit + 1,
        include: {
          Followers: {
            where: { followerId: me.id },
            select: { followerId: true },
          },
        },
      });

      const hasMore = rows.length > input.limit;
      const data = hasMore ? rows.slice(0, input.limit) : rows;
      const nextCursor = hasMore ? data[data.length - 1]!.id : null;

      return {
        items: data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: null, // TODO: profile pictures
          followedByMe: u.Followers.length > 0, // ← drives “Follow/Following”
        })),
        nextCursor,
      };
    }),

  followToggle: protectedProcedure
    .input(
      z.object({
        targetUserId: z.number().int().positive(),
        follow: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = (ctx.user as { email?: string })?.email;
      if (!email) throw new Error("Unauthorized");

      const me = await db.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!me) throw new Error("Unauthorized");
      if (me.id === input.targetUserId) return { ok: true }; // ignore self
      if (input.follow) {
        await db.follow.upsert({
          where: {
            followerId_followingId: {
              followerId: me.id,
              followingId: input.targetUserId,
            },
          },
          update: {},
          create: { followerId: me.id, followingId: input.targetUserId },
        });
      } else {
        await db.follow.deleteMany({
          where: { followerId: me.id, followingId: input.targetUserId },
        });
      }

      // Returning follow state lets the client decide how to reconcile if needed
      return { ok: true, follow: input.follow };
    }),

  followers: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(20),
        cursor: z.number().int().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const email = (ctx.user as { email?: string })?.email;
      if (!email) throw new Error("Unauthorized");

      const me = await db.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!me) throw new Error("Unauthorized");

      const where: Prisma.UserWhereInput = {
        Following: { some: { followingId: me.id } }, // users who follow ME
        ...(input.cursor ? { id: { gt: input.cursor } } : {}),
      };

      const rows = await db.user.findMany({
        where,
        orderBy: { id: "asc" },
        take: input.limit + 1,
        include: {
          Followers: {
            where: { followerId: me.id },
            select: { followerId: true },
          }, // do I follow them back?
        },
      });

      const hasMore = rows.length > input.limit;
      const data = hasMore ? rows.slice(0, input.limit) : rows;
      const nextCursor = hasMore ? data[data.length - 1]!.id : null;

      return {
        items: data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: null, // TODO: profile pictures
          followedByMe: u.Followers.length > 0,
        })),
        nextCursor,
      };
    }),

  following: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(20),
        cursor: z.number().int().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const email = (ctx.user as { email?: string })?.email;
      if (!email) throw new Error("Unauthorized");

      const me = await db.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!me) throw new Error("Unauthorized");

      const where: Prisma.UserWhereInput = {
        Followers: { some: { followerId: me.id } }, // users I FOLLOW
        ...(input.cursor ? { id: { gt: input.cursor } } : {}),
      };

      const rows = await db.user.findMany({
        where,
        orderBy: { id: "asc" },
        take: input.limit + 1,
        include: {
          Followers: {
            where: { followerId: me.id },
            select: { followerId: true },
          }, // always true but keep shape
        },
      });

      const hasMore = rows.length > input.limit;
      const data = hasMore ? rows.slice(0, input.limit) : rows;
      const nextCursor = hasMore ? data[data.length - 1]!.id : null;

      return {
        items: data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: null, // TODO
          followedByMe: u.Followers.length > 0,
        })),
        nextCursor,
      };
    }),
});
