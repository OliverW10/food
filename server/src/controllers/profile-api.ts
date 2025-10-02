// server/routers/profile.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../db";
import { protectedProcedure, router } from "../trpc";

export const profileApi = router({
  get: protectedProcedure
    .input(
      z
        .object({
          id: z.number().int().positive().optional(),
          email: z.string().email().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      // Precedence: explicit id → explicit email → claims.email
      const claimsEmail = (ctx.user as { email?: string } | undefined)?.email;

      const where:
        | { id: number }
        | { email: string }
        | undefined =
        input?.id != null
          ? { id: input.id }
          : input?.email
          ? { email: input.email }
          : claimsEmail
          ? { email: claimsEmail }
          : undefined;

      if (!where) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Provide a user id/email or have an email in the auth claims.",
        });
      }

      const u = await db.user.findUnique({
        where,
        include: {
          posts: true,
          _count: {
            // ⚠ match your Prisma relation names (lowercase if your schema uses lowercase)
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
          imageId: p.imageId ?? null,
          createdAt: p.createdAt,
          published: p.published ?? false,
        })),
      };
    }),
});
