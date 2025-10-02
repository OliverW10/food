// server/routers/profile.ts
import { TRPCError } from "@trpc/server";
import { idInputSchema } from "../api-schema/app-schema";
import { db } from "../db";
import { protectedProcedure, router } from "../trpc";

export const profileApi = router({
  get: protectedProcedure
    .input(idInputSchema)
    .query(async ({ input }) => {
      const u = await db.user.findUnique({
        where: { id: input.id },
        include: {
          posts: { include: { image: true } },
          _count: {
            select: { Followers: true, Following: true },
          },
        },
      });

      if (!u) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found." });
      }

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        followers: u._count.Followers ?? 0,
        following: u._count.Following ?? 0,
        posts: u.posts.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description ?? "",
          authorId: p.authorId,
          foodId: p.foodId ?? null,
          imageUrl: p.image?.storageUrl,
          createdAt: p.createdAt,
          published: p.published ?? false,
        })),
      };
    }),
});
