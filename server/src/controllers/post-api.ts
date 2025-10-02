import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { idInputSchema } from "../api-schema/app-schema";
import { createPostInputSchema } from "../api-schema/post-schemas";
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
  getById: publicProcedure.input(idInputSchema).query(async ({ input }) => {
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
        limit: z.number().int().min(1).max(50).default(6),
        cursor: z.number().int().positive().nullable().default(null),
      })
    )
    .query(async ({ input, ctx }) => {
      const where: Prisma.PostWhereInput = { published: true };
      let orderBy: Prisma.PostOrderByWithRelationInput | undefined = undefined;
      let useCursor = false;

      if (input.mode === "following") {
        // Only posts from followed users
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
        orderBy = { id: "desc" };
        useCursor = true;
      } else {
        orderBy = {};
        useCursor = false;
      }

      let rows;
      if (input.mode === "explore") {
        rows = await db.$queryRawUnsafe(
          `SELECT p.id, p.title, p.description, p."authorId", p."imageId", u.email as author_email, i."storageUrl" as image_url
           FROM "Post" p
           JOIN "User" u ON p."authorId" = u.id
           LEFT JOIN "Image" i ON p."imageId" = i.id
           WHERE p.published = true
           ORDER BY RANDOM()
           LIMIT $1`,
          input.limit + 1
        );
      } else {
        if (useCursor && input.cursor) {
          where.id = { lt: input.cursor };
        }
        rows = await db.post.findMany({
          where,
          orderBy,
          take: input.limit + 1,
          include: {
            author: { select: { id: true, email: true } },
            image: { select: { storageUrl: true } },
          },
        });
      }

      let nextCursor: number | null = null;
      type samplePost = {
        id: number;
        title: string;
        description: string;
        authorId: number;
        imageId: number | null;
        author_email?: string;
        image_url?: string;
        author: { id: number; email: string };
      } & {
        author: { id: number; email: string };
        image?: { storageUrl: string };
      };
      let items: samplePost[] = Array.isArray(rows) ? rows : [];
      if (items.length > input.limit) {
        const next = items[input.limit];
        nextCursor = next?.id ?? null;
        items = items.slice(0, input.limit);
      }

      // Map to PostUI expected by client
      let mapped;
      if (input.mode === "explore") {
        mapped = items.map((p: samplePost) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          author: { id: p.authorId, email: p.author_email },
          likesCount: 0, // TODO
          likedByMe: false,
          commentsCount: 0,
          imageUrl: p.image_url || "",
        }));
      } else {
        mapped = items.map((p: samplePost) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          author: { id: p.author.id, email: p.author.email },
          likesCount: 0, // TODO
          likedByMe: false,
          commentsCount: 0,
          imageUrl: p.image?.storageUrl || "",
        }));
      }

      return { items: mapped, nextCursor };
    }),
  forUser: protectedProcedure.input(idInputSchema).query(async ({ input }) => {
    const posts = await db.post.findMany({ where: { authorId: input.id } });
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
