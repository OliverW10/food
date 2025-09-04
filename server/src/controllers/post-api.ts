import { TRPCError } from "@trpc/server";
import { idInputSchema } from "../api-schema/app-schema";
import {
  createPostInputSchema,
} from "../api-schema/post-schemas";
import { db } from "../db";

import { publicProcedure, router } from "../trpc";

export const postApi = router({
  create: publicProcedure
    .input(createPostInputSchema)
    .mutation(async ({ input }) => {
      const post = await db.post.create({
        data: {
          title: input.title,
          description: input.description,
          ...(input.foodId && { food: { connect: { id: input.foodId } } }),
          author: { connect: { id: input.authorId } },
        },
      });
      return post;
    }),
  getById: publicProcedure
    .input(idInputSchema)
    .query(async ({ input }) => {
      const post = await db.post.findUnique({
        where: { id: input.id },
      });
      return post ?? undefined;
    }),
  getAll: publicProcedure.query(async () => {
    const posts = await db.post.findMany();
    return posts;
  }),
  delete: publicProcedure
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


