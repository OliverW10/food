import { z } from "zod";

export const postIdSchema = z.number().int().positive();
export const userIdSchema = z.number().int().positive();
export const foodIdSchema = z.number().int().positive();

export const createPostInputSchema = z.object({
  title: z.string().min(1).max(255),
  authorId: userIdSchema,
  foodId: foodIdSchema.optional(),
});
export type CreatePostInput = z.infer<typeof createPostInputSchema>;

export const idInputSchema = z.object({ id: postIdSchema });
export type IdInput = z.infer<typeof idInputSchema>;

export const postOutputSchema = z.object({
  id: postIdSchema,
  createdAt: z.date(),
  title: z.string(),
  published: z.boolean(),
  authorId: userIdSchema,
  foodId: foodIdSchema.nullish(),
});
export type PostOutput = z.infer<typeof postOutputSchema>;

export const postsOutputSchema = z.array(postOutputSchema);