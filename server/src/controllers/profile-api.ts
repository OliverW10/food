// server/routers/profile.ts
import { TRPCError } from "@trpc/server";
import { idInputSchema } from "../api-schema/app-schema";
import { db } from "../db";
import { protectedProcedure, router } from "../trpc";

export const profileApi = router({
  get: protectedProcedure
    .input(idInputSchema)
    .query(async ({ input, ctx }) => {
      const viewerId = Number(ctx.user?.sub);
      if (!viewerId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const u = await db.user.findUnique({
        where: { id: input.id },
        include: {
          posts: {
            orderBy: { createdAt: "desc" },
            include: {
              image: true,
              author: { select: { id: true, email: true, name: true } },
              _count: { select: { likes: true, comments: true } },
              likes: { select: { userId: true } },
            },
          },
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
          author: {
            id: p.author.id,
            email: p.author.email,
            name: p.author.name ?? p.author.email.split("@")[0],
          },
          likesCount: p._count.likes,
          commentsCount: p._count.comments,
          likedByMe: p.likes.some((l) => l.userId === viewerId),
          recentComments: undefined, // not needed for profile view currently
          createdAt: p.createdAt,
          imageUrl: p.image?.storageUrl,
        })),
      };
    }),
});
