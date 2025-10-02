import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { idInputSchema } from "../api-schema/app-schema";
import { createPostInputSchema } from "../api-schema/post-schemas";
import { db } from "../db";
import { protectedProcedure, router } from "../trpc";

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

  getById: protectedProcedure
    .input(idInputSchema)
    .query(async ({ input, ctx }) => {
      // Get userId if available (for likedByMe)
      let userId: number | null = null;
      if (ctx?.user?.sub) {
        userId = Number(ctx.user.sub);
      }

      const post = await db.post.findUnique({
        where: { id: input.id },
        include: {
          author: true,
          image: true,
        },
      });
      if (!post) return undefined;

      // Likes count
      const likesCount = await db.like.count({ where: { postId: post.id } });
      // Comments count
      const commentsCount = await db.comment.count({ where: { postId: post.id } });
      // Liked by me
      let likedByMe = false;
      if (userId) {
        likedByMe = !!(await db.like.findFirst({ where: { postId: post.id, userId } }));
      }

      return {
        id: post.id,
        title: post.title,
        description: post.description,
        author: {
          id: post.author.id,
          email: post.author.email,
          name: post.author.name ?? post.author.email.split("@")[0],
        },
        likesCount,
        commentsCount,
        likedByMe,
        imageUrl: post.image?.storageUrl,
      };
    }),

  getFeed: protectedProcedure
    .input(
      z.object({
        mode: z.enum(["following", "explore"]),
        limit: z.number().int().min(1).max(50).default(10),
      cursor: z.date().nullable().default(null), // use createdAt as cursor
    })
  )
    .query(async ({ input, ctx }) => {
      const where: Prisma.PostWhereInput = { published: true };

      const userIdStr = ctx.user?.sub;
      if (!userIdStr) throw new Error("Invalid token subject");
      const userId = Number(userIdStr);

      // === FOLLOWING MODE ===
      if (input.mode === "following") {
        const followees = await db.follow.findMany({
          where: { followerId: userId },
          select: { followingId: true },
        });
        const followingIds = followees.map((f) => f.followingId);
        if (followingIds.length === 0) {
          return { items: [], nextCursor: null as Date | null };
        }
        where.authorId = { in: followingIds };

        if (input.cursor) {
          where.createdAt = { lt: input.cursor };
        }
      }

      const postWithExtras = Prisma.validator<Prisma.PostDefaultArgs>()({
        include: {
          author: { select: { id: true, email: true, name: true } },
          _count: { select: { likes: true, comments: true } },
          likes: { select: { userId: true } },
          comments: {
            take: 2,
            orderBy: { createdAt: "desc" },
            include: {
              author: { select: { id: true, name: true, email: true } },
            },
          },
          image: true,
        },
      });

      type PostWithExtras = Prisma.PostGetPayload<typeof postWithExtras>;

      let rows: PostWithExtras[];

      if (input.mode === "explore") {
        rows = await db.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...postWithExtras,
        });
      } else {
        rows = await db.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: input.limit + 1,
          ...postWithExtras,
        });
      }

      let nextCursor: Date | null = null;
      let items = rows;

      if (input.mode === "following" && rows.length > input.limit) {
        const next = rows[input.limit];
        nextCursor = next?.createdAt ?? null;
        items = rows.slice(0, input.limit);
      }

      const mapped = items.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        author: {
          id: p.author.id,
          email: p.author.email,
          name: p.author.name ?? p.author.email.split("@")[0],
        },
        likesCount: p._count.likes,
        commentsCount: p._count.comments,
        likedByMe: p.likes.some((l) => l.userId === userId),
        recentComments: p.comments.map((c) => ({
          id: c.id,
          text: c.text,
          author: c.author.name ?? c.author.email.split("@")[0],
        })),
        createdAt: p.createdAt,
        imageUrl: p.image?.storageUrl
      }));

      return { items: mapped, nextCursor };
  }),


  forUser: protectedProcedure
    .input(idInputSchema)
    .query(async ({ input, ctx }) => {
      const userId = Number(ctx.user?.sub);
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const postWithExtras = Prisma.validator<Prisma.PostDefaultArgs>()({
        include: {
          author: { select: { id: true, email: true, name: true } },
          _count: { select: { likes: true, comments: true } },
          likes: { select: { userId: true } },
          comments: {
            take: 2,
            orderBy: { createdAt: "desc" },
            include: {
              author: { select: { id: true, name: true, email: true } },
            },
          },
          image: true,
        },
      });

      type PostWithExtras = Prisma.PostGetPayload<typeof postWithExtras>;

      const rows: PostWithExtras[] = await db.post.findMany({
        where: { authorId: input.id },
        orderBy: { createdAt: "desc" },
        ...postWithExtras,
      });

      const mapped = rows.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        author: {
          id: p.author.id,
          email: p.author.email,
          name: p.author.name ?? p.author.email.split("@")[0],
        },
        likesCount: p._count.likes,
        commentsCount: p._count.comments,
        likedByMe: p.likes.some((l) => l.userId === userId),
        recentComments: p.comments.map((c) => ({
          id: c.id,
          text: c.text,
          author: c.author.name ?? c.author.email.split("@")[0],
        })),
        createdAt: p.createdAt,
        imageUrl: p.image?.storageUrl,
      }));

      return mapped;
    }),

  delete: protectedProcedure
    .input(idInputSchema)
    .mutation(async ({ input }) => {
      const existing = await db.post.findUnique({ where: { id: input.id } });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      await db.post.delete({ where: { id: input.id } });
      return existing;
    }),

  likeToggle: protectedProcedure
    .input(z.object({ postId: z.number(), like: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const userId = Number(ctx.user?.sub);
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (input.like) {
        await db.like.upsert({
          where: { postId_userId: { postId: input.postId, userId } },
          update: {},
          create: { postId: input.postId, userId },
        });
      } else {
        await db.like.deleteMany({
          where: { postId: input.postId, userId },
        });
      }
      return { success: true };
    }),
});
