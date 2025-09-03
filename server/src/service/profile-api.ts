import { db } from "../db";
import { publicProcedure, router } from "../trpc";
import { getPostsByAuthor } from "./post-service";

async function ensureUser1() {
  const u = await db.user.findUnique({ where: { id: 1 } });
  if (!u) {
    await db.user.create({ data: { id: 1, email: "joshua@roy.com", name: "J24" } });
  }
}

async function ensureSeedPosts() {
  const count = await db.post.count({ where: { authorId: 1 } });
  if (count === 0) {
    await db.post.createMany({
      data: Array.from({ length: 9 }).map((_, i) => ({
        title: `Post ${i + 1}`,
        description: `Description ${i + 1}`,
        authorId: 1,
        published: true,
      })),
    });
  }
}

export const profileApi = router({
  get: publicProcedure.query(async () => {
    await ensureUser1();
    await ensureSeedPosts();
    const u = await db.user.findUnique({
      where: { id: 1 },
      include: { _count: { select: { Followers: true, Following: true } } },
    });
    if (!u) return null;
    const posts = await getPostsByAuthor(1);
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
