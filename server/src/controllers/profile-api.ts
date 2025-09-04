import { db } from "../db";
import { publicProcedure, router } from "../trpc";

export const profileApi = router({
  get: publicProcedure.query(async () => {
    const u = await db.user.findUnique({
      where: { id: 1 },
      include: { _count: { select: { Followers: true, Following: true } } },
    });
    if (!u) return null;
  const posts = await db.post.findMany({ where: { authorId: 1 } });
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      followers: u._count.Followers,
      following: u._count.Following,
      posts: posts.map(p => ({ id: p.id, title: p.title })),
    };
  }),
});
