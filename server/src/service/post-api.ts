import { TRPCError } from "@trpc/server";
import { idInputSchema } from "../schema/app-schema";
import {
  createPostInputSchema,
  postOutputSchema,
  postsOutputSchema,
} from "../schema/post-schemas";
import { publicProcedure, router } from "../trpc";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
} from "./post-service";

export const postApi = router({
  create: publicProcedure
    .input(createPostInputSchema)
    .output(postOutputSchema)
    .mutation(async ({ input }) => {
      const post = await createPost(input);
      return post;
    }),
  getById: publicProcedure
    .input(idInputSchema)
    .output(postOutputSchema.optional())
    .query(async ({ input }) => {
      const post = await getPostById(input.id);
      return post ?? undefined;
    }),
  getAll: publicProcedure.output(postsOutputSchema).query(async () => {
    const posts = await getAllPosts();
    return posts;
  }),
  delete: publicProcedure
    .input(idInputSchema)
    .output(postOutputSchema)
    .mutation(async ({ input }) => {
      const existing = await getPostById(input.id);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      await deletePost(input.id);
      return existing;
    }),
});
