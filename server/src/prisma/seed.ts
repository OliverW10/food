// server/src/prisma/seed.ts
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import "dotenv/config"; // load .env for DATABASE_URL

const prisma = new PrismaClient();

async function upsertCategory(name: string) {
  return prisma.category.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function upsertFood(categoryId: number, name: string) {
  return prisma.food.upsert({
    where: { name }, // assuming names are unique-ish in your dataset
    update: { categoryId },
    create: { name, categoryId },
  });
}

async function createImage(storageUrl: string) {
  return prisma.image.create({
    data: { storageUrl },
  });
}

async function main() {
  // === USERS ===
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
      passwordHash: await bcrypt.hash('password1', 10),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob',
      passwordHash: await bcrypt.hash('password1', 10),
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      email: 'charlie@example.com',
      name: 'Charlie',
      passwordHash: await bcrypt.hash('password1', 10),
    },
  });

  // === FOLLOWS ===
  // Alice follows Bob & Charlie
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: alice.id, followingId: bob.id } },
    update: {},
    create: { followerId: alice.id, followingId: bob.id },
  });
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: alice.id, followingId: charlie.id } },
    update: {},
    create: { followerId: alice.id, followingId: charlie.id },
  });

  // === CATEGORIES ===
  const catJapanese = await upsertCategory('Japanese');
  const catItalian  = await upsertCategory('Italian');
  const catMexican  = await upsertCategory('Mexican');
  const catBreakfast = await upsertCategory('Breakfast');

  // === FOODS ===
  const foodRamen     = await upsertFood(catJapanese.id, 'Ramen');
  const foodSushi     = await upsertFood(catJapanese.id, 'Sushi Platter');
  const foodPizza     = await upsertFood(catItalian.id,  'Margherita Pizza');
  const foodTacos     = await upsertFood(catMexican.id,  'Beef Tacos');
  const foodAvoToast  = await upsertFood(catBreakfast.id,'Avocado Toast');

  // === IMAGES ===
  // Use any URLs that your app can display. If you serve from /uploads, seed those paths.
  // Using picsum placeholders here:
  const imgRamen    = await createImage('https://picsum.photos/seed/ramen/800/600');
  const imgPizza    = await createImage('https://picsum.photos/seed/pizza/800/600');
  const imgTacos    = await createImage('https://picsum.photos/seed/tacos/800/600');
  const imgSushi    = await createImage('https://picsum.photos/seed/sushi/800/600');
  const imgAvoToast = await createImage('https://picsum.photos/seed/avotoast/800/600');

  // === POSTS ===
  // Note: Post.imageId is unique — create one image per post (done above).
  await prisma.post.createMany({
    data: [
      {
        authorId: bob.id,
        title: 'Homemade Ramen',
        description: 'Shoyu base with soft-boiled egg',
        published: true,
        foodId: foodRamen.id,
        imageId: imgRamen.id,
      },
      {
        authorId: charlie.id,
        title: 'Margherita Pizza',
        description: 'Fresh basil and buffalo mozzarella',
        published: true,
        foodId: foodPizza.id,
        imageId: imgPizza.id,
      },
      {
        authorId: bob.id,
        title: 'Beef Tacos',
        description: 'Crispy shells, pico de gallo, lime',
        published: true,
        foodId: foodTacos.id,
        imageId: imgTacos.id,
      },
      {
        authorId: charlie.id,
        title: 'Sushi Platter',
        description: 'Salmon, tuna, and tamago',
        published: true,
        foodId: foodSushi.id,
        imageId: imgSushi.id,
      },
      {
        authorId: bob.id,
        title: 'Avocado Toast',
        description: 'Sourdough + chilli flakes',
        published: true,
        foodId: foodAvoToast.id,
        imageId: imgAvoToast.id,
      },
    ]as Prisma.PostCreateManyInput[],
    skipDuplicates: true,
  });

  // Print a neat summary
  const [users, posts, follows, categories, foods, images] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.follow.count(),
    prisma.category.count(),
    prisma.food.count(),
    prisma.image.count(),
  ]);

  console.log('✅ Seed complete');
  console.table([{ users, posts, follows, categories, foods, images }]);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
