// Rianna
import { z } from "zod";
import { db } from "../db";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentsApi = router({
  add: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = Number(ctx.user?.sub);
      if (!userId) throw new Error("Unauthenticated");

      return db.comment.create({
        data: {
          text: input.text,
          postId: input.postId,
          userId,
        },
        include: {
          author: { select: { name: true, email: true } },
        },
      });
    }),

  list: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        cursor: z.number().nullable().default(null),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const where = { postId: input.postId };
      const cursorObj = input.cursor ? { id: input.cursor } : undefined;

      const comments = await db.comment.findMany({
        where,
        orderBy: { id: "desc" },
        take: input.limit + 1,
        cursor: cursorObj,
        include: {
          author: { select: { name: true, email: true } },
        },
      });

      let nextCursor: number | null = null;
      if (comments.length > input.limit) {
        nextCursor = comments[input.limit].id;
        comments.pop();
      }

      return { items: comments, nextCursor };
    }),
});
