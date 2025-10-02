import { z } from "zod";
import { idSchema } from "./app-schema";

export const createPostInputSchema = z.object({
  title: z.string().min(1).max(255),
  authorId: idSchema,
  foodId: idSchema.optional(),
  description: z.string().min(1).max(1000),
  imageId: idSchema.optional(),
});
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
