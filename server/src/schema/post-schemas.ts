import { z } from "zod";
import { idSchema } from "./app-schema";

export const createPostInputSchema = z.object({
  title: z.string().min(1).max(255),
  authorId: idSchema,
  foodId: idSchema.optional(),
  description: z.string().min(1).max(1000),
});
export type CreatePostInput = z.infer<typeof createPostInputSchema>;

export const postOutputSchema = z.object({
  id: idSchema,
  createdAt: z.date(),
  title: z.string(),
  published: z.boolean(),
  authorId: idSchema,
  foodId: idSchema.nullish(),
});
export type PostOutput = z.infer<typeof postOutputSchema>;

export const postsOutputSchema = z.array(postOutputSchema);