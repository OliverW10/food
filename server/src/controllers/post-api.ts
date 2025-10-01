import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { idInputSchema } from "../api-schema/app-schema";
import {
  createPostInputSchema,
} from "../api-schema/post-schemas";
import { db } from "../db";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postApi = router({
  create: protectedProcedure
    .input(createPostInputSchema)
    .mutation(async ({ input }) => {
      const post = await db.post.create({
        data: {
          title: input.title,
          description: input.description,
          ...(input.foodId && { food: { connect: { id: input.foodId } } }),
          author: { connect: { id: input.authorId } },
          ...(input.imageId && { image: { connect: { id: input.imageId } } }),
        },
        include: { image: true },
      });
      return post;
    }),
  getById: publicProcedure
    .input(idInputSchema)
    .query(async ({ input }) => {
      const post = await db.post.findUnique({
        where: { id: input.id },
        include: { image: true },
      });
      return post ?? undefined;
    }),
  // Cursor-paginated feed for HomeScreen
  getFeed: protectedProcedure
    .input(
      z.object({
        mode: z.enum(["following", "explore"]),
        limit: z.number().int().min(1).max(50).default(10),
        cursor: z.number().int().positive().nullable().default(null),
      })
    )
    .query(async ({ input, ctx }) => {

      // Build base where clause
      const where: Prisma.PostWhereInput = { published: true };

      // If following mode, try to resolve current user from bearer token
      const userId = ctx.user?.sub;
      if (userId == undefined) {
        throw new Error("Invalid token subject");
      }

      const followees = await db.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = followees.map((f) => f.followingId);
      if (followingIds.length === 0) {
        return { items: [], nextCursor: null as number | null };
      }
      where.authorId = { in: followingIds };

      // Cursor pagination by id DESC
      if (input.cursor) {
        where.id = { lt: input.cursor };
      }

      const rows = await db.post.findMany({
        where,
        orderBy: { id: "desc" },
        take: input.limit + 1,
        include: {
          author: { select: { id: true, email: true } },
        },
      });

      let nextCursor: number | null = null;
      let items = rows;
      if (rows.length > input.limit) {
        const next = rows[input.limit];
        nextCursor = next?.id ?? null;
        items = rows.slice(0, input.limit);
      }

      // Map to PostUI expected by client
      const mapped = items.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        author: { id: p.author.id, email: p.author.email },
        likesCount: 0, // TODO
        likedByMe: false,
        commentsCount: 0,
      }));

      return { items: mapped, nextCursor };
    }),
  forUser: protectedProcedure
    .input(idInputSchema)
    .query(async ({ input }) => {
      const posts = await db.post.findMany({ where: { authorId: input.id }})
      return posts;
    }),
  delete: protectedProcedure
    .input(idInputSchema)
    .mutation(async ({ input }) => {
      const existing = await db.post.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      await db.post.delete({
        where: { id: input.id },
      });
      return existing;
    }),
});


