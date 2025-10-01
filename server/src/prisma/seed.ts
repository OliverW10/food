// server/src/prisma/seed.ts
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
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
    where: { email: "alice@example.com" },
    update: {},
    create: {
      id: 1,
      email: "alice@example.com",
      name: "Alice",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      id: 2,
      email: "bob@example.com",
      name: "Bob",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: "charlie@example.com" },
    update: {},
    create: {
      id: 3,
      email: "charlie@example.com",
      name: "Charlie",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const diana = await prisma.user.upsert({
    where: { email: "diana@example.com" },
    update: {},
    create: {
      id: 4,
      email: "diana@example.com",
      name: "Diana",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const edward = await prisma.user.upsert({
    where: { email: "edward@example.com" },
    update: {},
    create: {
      id: 5,
      email: "edward@example.com",
      name: "Edward",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const fiona = await prisma.user.upsert({
    where: { email: "fiona@example.com" },
    update: {},
    create: {
      id: 6,
      email: "fiona@example.com",
      name: "Fiona",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const george = await prisma.user.upsert({
    where: { email: "george@example.com" },
    update: {},
    create: {
      id: 7,
      email: "george@example.com",
      name: "George",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const helen = await prisma.user.upsert({
    where: { email: "helen@example.com" },
    update: {},
    create: {
      id: 8,
      email: "helen@example.com",
      name: "Helen",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const ian = await prisma.user.upsert({
    where: { email: "ian@example.com" },
    update: {},
    create: {
      id: 9,
      email: "ian@example.com",
      name: "Ian",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const jessica = await prisma.user.upsert({
    where: { email: "jessica@example.com" },
    update: {},
    create: {
      id: 10,
      email: "jessica@example.com",
      name: "Jessica",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const kevin = await prisma.user.upsert({
    where: { email: "kevin@example.com" },
    update: {},
    create: {
      email: "kevin@example.com",
      name: "Kevin",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const laura = await prisma.user.upsert({
    where: { email: "laura@example.com" },
    update: {},
    create: {
      id: 11,
      email: "laura@example.com",
      name: "Laura",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const michael = await prisma.user.upsert({
    where: { email: "michael@example.com" },
    update: {},
    create: {
      id: 12,
      email: "michael@example.com",
      name: "Michael",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  // === FOLLOWS ===
  // Alice follows Bob & Charlie
  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId: alice.id, followingId: bob.id },
    },
    update: {},
    create: { followerId: alice.id, followingId: bob.id },
  });
  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId: alice.id, followingId: charlie.id },
    },
    update: {},
    create: { followerId: alice.id, followingId: charlie.id },
  });

  await prisma.follow.createMany({
    data: [
      { followerId: alice.id, followingId: diana.id },
      { followerId: alice.id, followingId: edward.id },
      { followerId: alice.id, followingId: fiona.id },
    ],
    skipDuplicates: true,
  });

  await prisma.follow.createMany({
    data: [
      { followerId: diana.id, followingId: alice.id },
      { followerId: edward.id, followingId: alice.id },
      { followerId: fiona.id, followingId: alice.id },
      { followerId: george.id, followingId: alice.id },
      { followerId: helen.id, followingId: alice.id },
    ],
    skipDuplicates: true,
  });

  await prisma.follow.createMany({
    data: [
      { followerId: bob.id, followingId: alice.id },
      { followerId: bob.id, followingId: charlie.id },
      { followerId: bob.id, followingId: ian.id },
      { followerId: bob.id, followingId: jessica.id },
      { followerId: bob.id, followingId: kevin.id },
    ],
    skipDuplicates: true,
  });

  await prisma.follow.createMany({
    data: [
      { followerId: charlie.id, followingId: bob.id },
      { followerId: diana.id, followingId: bob.id },
      { followerId: fiona.id, followingId: bob.id },
      { followerId: george.id, followingId: bob.id },
      { followerId: michael.id, followingId: bob.id },
    ],
    skipDuplicates: true,
  });

  await prisma.follow.createMany({
    data: [
      { followerId: charlie.id, followingId: alice.id },
      { followerId: charlie.id, followingId: diana.id },
      { followerId: charlie.id, followingId: helen.id },
      { followerId: charlie.id, followingId: laura.id },
    ],
    skipDuplicates: true,
  });

  await prisma.follow.createMany({
    data: [
      { followerId: edward.id, followingId: charlie.id },
      { followerId: ian.id, followingId: charlie.id },
      { followerId: jessica.id, followingId: charlie.id },
      { followerId: kevin.id, followingId: charlie.id },
    ],
    skipDuplicates: true,
  });

  // === CATEGORIES ===
  const catJapanese = await upsertCategory("Japanese");
  const catItalian = await upsertCategory("Italian");
  const catMexican = await upsertCategory("Mexican");
  const catBreakfast = await upsertCategory("Breakfast");

  // === FOODS ===
  const foodRamen = await upsertFood(catJapanese.id, "Ramen");
  const foodSushi = await upsertFood(catJapanese.id, "Sushi Platter");
  const foodTempuraUdon = await upsertFood(catJapanese.id, "Tempura Udon");
  const foodChickenKatsuCurry = await upsertFood(
    catJapanese.id,
    "Chicken Katsu Curry"
  );
  const foodSalmonNigiri = await upsertFood(catJapanese.id, "Salmon Nigiri");
  const foodTonkotsuRamen = await upsertFood(catJapanese.id, "Tonkotsu Ramen");
  const foodTakoyaki = await upsertFood(catJapanese.id, "Takoyaki");
  const foodOkonomiyaki = await upsertFood(catJapanese.id, "Okonomiyaki");
  const foodMisoSoup = await upsertFood(catJapanese.id, "Miso Soup");
  const foodUnagiDon = await upsertFood(catJapanese.id, "Unagi Don");
  const foodBeefYakiniku = await upsertFood(catJapanese.id, "Beef Yakiniku");
  const foodChashuRiceBowl = await upsertFood(
    catJapanese.id,
    "Chashu Rice Bowl"
  );
  const foodMatchaIceCream = await upsertFood(
    catJapanese.id,
    "Matcha Ice Cream"
  );
  const foodPockySticks = await upsertFood(catJapanese.id, "Pocky Sticks");
  const foodDorayakiPancakes = await upsertFood(
    catJapanese.id,
    "Dorayaki Pancakes"
  );

  const foodPizza = await upsertFood(catItalian.id, "Margherita Pizza");
  const foodSpaghettiCarbonara = await upsertFood(
    catItalian.id,
    "Spaghetti Carbonara"
  );
  const foodLasagna = await upsertFood(catItalian.id, "Lasagna");
  const foodFettuccineAlfredo = await upsertFood(
    catItalian.id,
    "Fettuccine Alfredo"
  );
  const foodCapreseSalad = await upsertFood(catItalian.id, "Caprese Salad");
  const foodRisotto = await upsertFood(catItalian.id, "Risotto alla Milanese");
  const foodBruschetta = await upsertFood(catItalian.id, "Bruschetta");
  const foodGnocchiWithPesto = await upsertFood(
    catItalian.id,
    "Gnocchi with Pesto"
  );
  const foodTiramisu = await upsertFood(catItalian.id, "Tiramisu");
  const foodStuffedCannelloni = await upsertFood(
    catItalian.id,
    "Stuffed Cannelloni"
  );
  const foodEggplantParmigiana = await upsertFood(
    catItalian.id,
    "Eggplant Parmigiana"
  );
  const foodMinestroneSoup = await upsertFood(catItalian.id, "Minestrone Soup");
  const foodFocacciaBread = await upsertFood(catItalian.id, "Focaccia Bread");
  const foodArancini = await upsertFood(catItalian.id, "Arancini");
  const foodPannaCotta = await upsertFood(catItalian.id, "Panna Cotta");
  const foodBologneseSauce = await upsertFood(catItalian.id, "Bolognese Sauce");

  const foodTacos = await upsertFood(catMexican.id, "Beef Tacos");
  const foodChickenEnchiladas = await upsertFood(
    catMexican.id,
    "Chicken Enchiladas"
  );
  const foodCarneAsada = await upsertFood(catMexican.id, "Carne Asada");
  const foodChilesRellenos = await upsertFood(catMexican.id, "Chiles Rellenos");
  const foodTamales = await upsertFood(catMexican.id, "Tamales");
  const foodHuevosRancheros = await upsertFood(
    catMexican.id,
    "Huevos Rancheros"
  );
  const foodFishTacos = await upsertFood(catMexican.id, "Fish Tacos");
  const foodQuesadillas = await upsertFood(catMexican.id, "Quesadillas");
  const foodPozole = await upsertFood(catMexican.id, "Pozole");
  const foodGuacamoleChips = await upsertFood(
    catMexican.id,
    "Guacamole & Chips"
  );
  const foodElote = await upsertFood(catMexican.id, "Elote (Street Corn)");
  const foodChurros = await upsertFood(catMexican.id, "Churros");
  const foodMolePoblano = await upsertFood(catMexican.id, "Mole Poblano");
  const foodSopaDeLima = await upsertFood(catMexican.id, "Sopa de Lima");
  const foodCeviche = await upsertFood(catMexican.id, "Ceviche");
  const foodCarnitas = await upsertFood(catMexican.id, "Carnitas");

  const foodAvoToast = await upsertFood(catBreakfast.id, "Avocado Toast");
  const foodPancakes = await upsertFood(catBreakfast.id, "Pancakes with Syrup");
  const foodScrambledEggs = await upsertFood(catBreakfast.id, "Scrambled Eggs");
  const foodFrenchToast = await upsertFood(catBreakfast.id, "French Toast");
  const foodBreakfastBurrito = await upsertFood(
    catBreakfast.id,
    "Breakfast Burrito"
  );
  const foodEggsBenedict = await upsertFood(catBreakfast.id, "Eggs Benedict");
  const foodGreekYogurtParfait = await upsertFood(
    catBreakfast.id,
    "Greek Yogurt Parfait"
  );
  const foodOatmeal = await upsertFood(catBreakfast.id, "Oatmeal with Berries");
  const foodBagel = await upsertFood(
    catBreakfast.id,
    "Bagel with Cream Cheese"
  );
  const foodSausageMuffin = await upsertFood(
    catBreakfast.id,
    "Sausage & Egg Muffin"
  );
  const foodBananaSmoothie = await upsertFood(
    catBreakfast.id,
    "Banana Smoothie Bowl"
  );
  const foodCinnamonRolls = await upsertFood(catBreakfast.id, "Cinnamon Rolls");
  const foodGranola = await upsertFood(catBreakfast.id, "Granola with Milk");
  const foodVeggieOmelette = await upsertFood(
    catBreakfast.id,
    "Veggie Omelette"
  );
  const foodFruitSalad = await upsertFood(catBreakfast.id, "Fruit Salad");
  const foodWaffles = await upsertFood(catBreakfast.id, "Waffles with Berries");

  // === IMAGES ===
  // Use any URLs that your app can display. If you serve from /uploads, seed those paths.
  // Using picsum placeholders here:
  const imgRamen = await createImage(
    "https://picsum.photos/seed/ramen/800/600"
  );
  const imgPizza = await createImage(
    "https://picsum.photos/seed/pizza/800/600"
  );
  const imgTacos = await createImage(
    "https://picsum.photos/seed/tacos/800/600"
  );
  const imgSushi = await createImage(
    "https://picsum.photos/seed/sushi/800/600"
  );
  const imgAvoToast = await createImage(
    "https://picsum.photos/seed/avotoast/800/600"
  );
  const imgPockySticks = await createImage(
    "https://picsum.photos/seed/pockysticks/800/600"
  );
  const imgDorayakiPancakes = await createImage(
    "https://picsum.photos/seed/dorayaki/800/600"
  );
  const imgTempuraUdon = await createImage(
    "https://picsum.photos/seed/tempuraudon/800/600"
  );
  const imgChickenKatsuCurry = await createImage(
    "https://picsum.photos/seed/chickenkatsucurry/800/600"
  );
  const imgSalmonNigiri = await createImage(
    "https://picsum.photos/seed/salmonnigiri/800/600"
  );
  const imgTonkotsuRamen = await createImage(
    "https://picsum.photos/seed/tonkotsuramen/800/600"
  );
  const imgTakoyaki = await createImage(
    "https://picsum.photos/seed/takoyaki/800/600"
  );
  const imgOkonomiyaki = await createImage(
    "https://picsum.photos/seed/okonomiyaki/800/600"
  );
  const imgMisoSoup = await createImage(
    "https://picsum.photos/seed/misosoup/800/600"
  );
  const imgUnagiDon = await createImage(
    "https://picsum.photos/seed/unagidon/800/600"
  );
  const imgBeefYakiniku = await createImage(
    "https://picsum.photos/seed/beefyakiniku/800/600"
  );
  const imgChashuRiceBowl = await createImage(
    "https://picsum.photos/seed/chashuricebowl/800/600"
  );
  const imgMatchaIceCream = await createImage(
    "https://picsum.photos/seed/matchaicecream/800/600"
  );
  const imgSpaghettiCarbonara = await createImage(
    "https://picsum.photos/seed/spaghetticarbonara/800/600"
  );
  const imgLasagna = await createImage(
    "https://picsum.photos/seed/lasagna/800/600"
  );
  const imgFettuccineAlfredo = await createImage(
    "https://picsum.photos/seed/fettuccinealfredo/800/600"
  );
  const imgCapreseSalad = await createImage(
    "https://picsum.photos/seed/capresesalad/800/600"
  );
  const imgRisotto = await createImage(
    "https://picsum.photos/seed/risotto/800/600"
  );
  const imgBruschetta = await createImage(
    "https://picsum.photos/seed/bruschetta/800/600"
  );
  const imgGnocchiWithPesto = await createImage(
    "https://picsum.photos/seed/gnocchiwithpesto/800/600"
  );
  const imgTiramisu = await createImage(
    "https://picsum.photos/seed/tiramisu/800/600"
  );
  const imgStuffedCannelloni = await createImage(
    "https://picsum.photos/seed/stuffedcannelloni/800/600"
  );
  const imgEggplantParmigiana = await createImage(
    "https://picsum.photos/seed/eggplantparmigiana/800/600"
  );
  const imgMinestroneSoup = await createImage(
    "https://picsum.photos/seed/minestronesoup/800/600"
  );
  const imgFocacciaBread = await createImage(
    "https://picsum.photos/seed/focacciabread/800/600"
  );
  const imgArancini = await createImage(
    "https://picsum.photos/seed/arancini/800/600"
  );
  const imgPannaCotta = await createImage(
    "https://picsum.photos/seed/pannacotta/800/600"
  );
  const imgBologneseSauce = await createImage(
    "https://picsum.photos/seed/bolognesesauce/800/600"
  );
  const imgChickenEnchiladas = await createImage(
    "https://picsum.photos/seed/chickenenchiladas/800/600"
  );
  const imgCarneAsada = await createImage(
    "https://picsum.photos/seed/carneasada/800/600"
  );
  const imgChilesRellenos = await createImage(
    "https://picsum.photos/seed/chilesrellenos/800/600"
  );
  const imgTamales = await createImage(
    "https://picsum.photos/seed/tamales/800/600"
  );
  const imgHuevosRancheros = await createImage(
    "https://picsum.photos/seed/huevosrancheros/800/600"
  );
  const imgFishTacos = await createImage(
    "https://picsum.photos/seed/fishtacos/800/600"
  );
  const imgQuesadillas = await createImage(
    "https://picsum.photos/seed/quesadillas/800/600"
  );
  const imgPozole = await createImage(
    "https://picsum.photos/seed/pozole/800/600"
  );
  const imgGuacamoleChips = await createImage(
    "https://picsum.photos/seed/guacamolechips/800/600"
  );
  const imgElote = await createImage(
    "https://picsum.photos/seed/elote/800/600"
  );
  const imgChurros = await createImage(
    "https://picsum.photos/seed/churros/800/600"
  );
  const imgMolePoblano = await createImage(
    "https://picsum.photos/seed/molepoblano/800/600"
  );
  const imgSopaDeLima = await createImage(
    "https://picsum.photos/seed/sopadelima/800/600"
  );
  const imgCeviche = await createImage(
    "https://picsum.photos/seed/ceviche/800/600"
  );
  const imgCarnitas = await createImage(
    "https://picsum.photos/seed/carnitas/800/600"
  );
  const imgPancakes = await createImage(
    "https://picsum.photos/seed/pancakes/800/600"
  );
  const imgScrambledEggs = await createImage(
    "https://picsum.photos/seed/scrambledeggs/800/600"
  );
  const imgFrenchToast = await createImage(
    "https://picsum.photos/seed/frenchtoast/800/600"
  );
  const imgBreakfastBurrito = await createImage(
    "https://picsum.photos/seed/breakfastburrito/800/600"
  );
  const imgEggsBenedict = await createImage(
    "https://picsum.photos/seed/eggsbenedict/800/600"
  );
  const imgGreekYogurtParfait = await createImage(
    "https://picsum.photos/seed/greekyogurtparfait/800/600"
  );
  const imgOatmeal = await createImage(
    "https://picsum.photos/seed/oatmeal/800/600"
  );
  const imgBagel = await createImage(
    "https://picsum.photos/seed/bagel/800/600"
  );
  const imgSausageMuffin = await createImage(
    "https://picsum.photos/seed/sausagemuffin/800/600"
  );
  const imgBananaSmoothie = await createImage(
    "https://picsum.photos/seed/bananasmoothie/800/600"
  );
  const imgCinnamonRolls = await createImage(
    "https://picsum.photos/seed/cinnamonrolls/800/600"
  );
  const imgGranola = await createImage(
    "https://picsum.photos/seed/granola/800/600"
  );
  const imgVeggieOmelette = await createImage(
    "https://picsum.photos/seed/veggieomelette/800/600"
  );
  const imgFruitSalad = await createImage(
    "https://picsum.photos/seed/fruitsalad/800/600"
  );
  const imgWaffles = await createImage(
    "https://picsum.photos/seed/waffles/800/600"
  );

  // === POSTS ===
  // Note: Post.imageId is unique — create one image per post (done above).
  await prisma.post.createMany({
    data: [
      {
        authorId: bob.id,
        title: "Homemade Ramen",
        description: "Shoyu base with soft-boiled egg",
        published: true,
        foodId: foodRamen.id,
        imageId: imgRamen.id,
      },
      {
        authorId: charlie.id,
        title: "Margherita Pizza",
        description: "Fresh basil and buffalo mozzarella",
        published: true,
        foodId: foodPizza.id,
        imageId: imgPizza.id,
      },
      {
        authorId: bob.id,
        title: "Beef Tacos",
        description: "Crispy shells, pico de gallo, lime",
        published: true,
        foodId: foodTacos.id,
        imageId: imgTacos.id,
      },
      {
        authorId: charlie.id,
        title: "Sushi Platter",
        description: "Salmon, tuna, and tamago",
        published: true,
        foodId: foodSushi.id,
        imageId: imgSushi.id,
      },
      {
        authorId: bob.id,
        title: "Avocado Toast",
        description: "Sourdough + chilli flakes",
        published: true,
        foodId: foodAvoToast.id,
        imageId: imgAvoToast.id,
      },
      {
        authorId: charlie.id,
        title: "Pocky Sticks",
        description: "Chocolate-covered biscuit sticks",
        published: true,
        foodId: foodPockySticks.id,
        imageId: imgPockySticks.id,
      },
      {
        authorId: bob.id,
        title: "Dorayaki Pancakes",
        description: "Fluffy pancakes filled with sweet red bean paste",
        published: true,
        foodId: foodDorayakiPancakes.id,
        imageId: imgDorayakiPancakes.id,
      },
      {
        authorId: charlie.id,
        title: "Tempura Udon",
        description: "Crispy shrimp tempura over thick udon noodles",
        published: true,
        foodId: foodTempuraUdon.id,
        imageId: imgTempuraUdon.id,
      },
      {
        authorId: bob.id,
        title: "Chicken Katsu Curry",
        description: "Crispy chicken cutlet with curry sauce",
        published: true,
        foodId: foodChickenKatsuCurry.id,
        imageId: imgChickenKatsuCurry.id,
      },
      {
        authorId: charlie.id,
        title: "Salmon Nigiri",
        description: "Fresh salmon over sushi rice",
        published: true,
        foodId: foodSalmonNigiri.id,
        imageId: imgSalmonNigiri.id,
      },
      {
        authorId: bob.id,
        title: "Tonkotsu Ramen",
        description: "Rich and creamy pork broth",
        published: true,
        foodId: foodTonkotsuRamen.id,
        imageId: imgTonkotsuRamen.id,
      },
      {
        authorId: charlie.id,
        title: "Takoyaki",
        description: "Octopus balls with takoyaki sauce",
        published: true,
        foodId: foodTakoyaki.id,
        imageId: imgTakoyaki.id,
      },
      {
        authorId: bob.id,
        title: "Okonomiyaki",
        description: "Savory pancake with cabbage and pork",
        published: true,
        foodId: foodOkonomiyaki.id,
        imageId: imgOkonomiyaki.id,
      },
      {
        authorId: charlie.id,
        title: "Miso Soup",
        description: "Savory soup with tofu and seaweed",
        published: true,
        foodId: foodMisoSoup.id,
        imageId: imgMisoSoup.id,
      },
      {
        authorId: bob.id,
        title: "Unagi Don",
        description: "Grilled eel over rice",
        published: true,
        foodId: foodUnagiDon.id,
        imageId: imgUnagiDon.id,
      },
      {
        authorId: charlie.id,
        title: "Beef Yakiniku",
        description: "Grilled beef with tare sauce",
        published: true,
        foodId: foodBeefYakiniku.id,
        imageId: imgBeefYakiniku.id,
      },
      {
        authorId: bob.id,
        title: "Chashu Rice Bowl",
        description: "Braised pork belly over rice",
        published: true,
        foodId: foodChashuRiceBowl.id,
        imageId: imgChashuRiceBowl.id,
      },
      {
        authorId: charlie.id,
        title: "Matcha Ice Cream",
        description: "Creamy ice cream with matcha flavor",
        published: true,
        foodId: foodMatchaIceCream.id,
        imageId: imgMatchaIceCream.id,
      },
      {
        authorId: bob.id,
        title: "Spaghetti Carbonara",
        description: "Classic Roman pasta",
        published: true,
        foodId: foodSpaghettiCarbonara.id,
        imageId: imgSpaghettiCarbonara.id,
      },
      {
        authorId: charlie.id,
        title: "Lasagna",
        description: "Layers of pasta, meat, and cheese",
        published: true,
        foodId: foodLasagna.id,
        imageId: imgLasagna.id,
      },
      {
        authorId: bob.id,
        title: "Fettuccine Alfredo",
        description: "Creamy Alfredo sauce with fettuccine",
        published: true,
        foodId: foodFettuccineAlfredo.id,
        imageId: imgFettuccineAlfredo.id,
      },
      {
        authorId: charlie.id,
        title: "Caprese Salad",
        description: "Tomato, mozzarella, and basil",
        published: true,
        foodId: foodCapreseSalad.id,
        imageId: imgCapreseSalad.id,
      },
      {
        authorId: bob.id,
        title: "Risotto alla Milanese",
        description: "Creamy risotto with saffron",
        published: true,
        foodId: foodRisotto.id,
        imageId: imgRisotto.id,
      },
      {
        authorId: charlie.id,
        title: "Bruschetta",
        description: "Grilled bread with tomato and basil",
        published: true,
        foodId: foodBruschetta.id,
        imageId: imgBruschetta.id,
      },
      {
        authorId: bob.id,
        title: "Gnocchi with Pesto",
        description: "Potato gnocchi with basil pesto",
        published: true,
        foodId: foodGnocchiWithPesto.id,
        imageId: imgGnocchiWithPesto.id,
      },
      {
        authorId: charlie.id,
        title: "Tiramisu",
        description: "Coffee-flavored Italian dessert",
        published: true,
        foodId: foodTiramisu.id,
        imageId: imgTiramisu.id,
      },
      {
        authorId: bob.id,
        title: "Stuffed Cannelloni",
        description: "Pasta tubes stuffed with ricotta and spinach",
        published: true,
        foodId: foodStuffedCannelloni.id,
        imageId: imgStuffedCannelloni.id,
      },
      {
        authorId: charlie.id,
        title: "Eggplant Parmigiana",
        description: "Breaded eggplant with marinara and cheese",
        published: true,
        foodId: foodEggplantParmigiana.id,
        imageId: imgEggplantParmigiana.id,
      },
      {
        authorId: bob.id,
        title: "Minestrone Soup",
        description: "Hearty vegetable soup",
        published: true,
        foodId: foodMinestroneSoup.id,
        imageId: imgMinestroneSoup.id,
      },
      {
        authorId: charlie.id,
        title: "Focaccia Bread",
        description: "Italian flatbread with rosemary",
        published: true,
        foodId: foodFocacciaBread.id,
        imageId: imgFocacciaBread.id,
      },
      {
        authorId: bob.id,
        title: "Arancini",
        description: "Fried rice balls with cheese",
        published: true,
        foodId: foodArancini.id,
        imageId: imgArancini.id,
      },
      {
        authorId: charlie.id,
        title: "Panna Cotta",
        description: "Creamy dessert with berry sauce",
        published: true,
        foodId: foodPannaCotta.id,
        imageId: imgPannaCotta.id,
      },
      {
        authorId: bob.id,
        title: "Bolognese Sauce",
        description: "Rich meat sauce for pasta",
        published: true,
        foodId: foodBologneseSauce.id,
        imageId: imgBologneseSauce.id,
      },
      {
        authorId: charlie.id,
        title: "Chicken Enchiladas",
        description: "Tortillas filled with chicken and cheese",
        published: true,
        foodId: foodChickenEnchiladas.id,
        imageId: imgChickenEnchiladas.id,
      },
      {
        authorId: bob.id,
        title: "Carne Asada",
        description: "Grilled marinated steak",
        published: true,
        foodId: foodCarneAsada.id,
        imageId: imgCarneAsada.id,
      },
      {
        authorId: charlie.id,
        title: "Chiles Rellenos",
        description: "Stuffed poblano peppers",
        published: true,
        foodId: foodChilesRellenos.id,
        imageId: imgChilesRellenos.id,
      },
      {
        authorId: bob.id,
        title: "Tamales",
        description: "Corn dough stuffed with meat and steamed in corn husks",
        published: true,
        foodId: foodTamales.id,
        imageId: imgTamales.id,
      },
      {
        authorId: charlie.id,
        title: "Huevos Rancheros",
        description: "Eggs served on tortillas with salsa",
        published: true,
        foodId: foodHuevosRancheros.id,
        imageId: imgHuevosRancheros.id,
      },
      {
        authorId: bob.id,
        title: "Fish Tacos",
        description: "Grilled fish with cabbage slaw",
        published: true,
        foodId: foodFishTacos.id,
        imageId: imgFishTacos.id,
      },
      {
        authorId: charlie.id,
        title: "Quesadillas",
        description: "Grilled tortillas with melted cheese",
        published: true,
        foodId: foodQuesadillas.id,
        imageId: imgQuesadillas.id,
      },
      {
        authorId: bob.id,
        title: "Pozole",
        description: "Traditional hominy soup",
        published: true,
        foodId: foodPozole.id,
        imageId: imgPozole.id,
      },
      {
        authorId: charlie.id,
        title: "Guacamole & Chips",
        description: "Fresh guacamole with tortilla chips",
        published: true,
        foodId: foodGuacamoleChips.id,
        imageId: imgGuacamoleChips.id,
      },
      {
        authorId: bob.id,
        title: "Elote (Street Corn)",
        description: "Grilled corn with mayo, cheese, and chili powder",
        published: true,
        foodId: foodElote.id,
        imageId: imgElote.id,
      },
      {
        authorId: charlie.id,
        title: "Churros",
        description: "Fried dough pastries with cinnamon sugar",
        published: true,
        foodId: foodChurros.id,
        imageId: imgChurros.id,
      },
      {
        authorId: bob.id,
        title: "Mole Poblano",
        description: "Chicken in rich mole sauce",
        published: true,
        foodId: foodMolePoblano.id,
        imageId: imgMolePoblano.id,
      },
      {
        authorId: charlie.id,
        title: "Sopa de Lima",
        description: "Yucatan-style lime soup",
        published: true,
        foodId: foodSopaDeLima.id,
        imageId: imgSopaDeLima.id,
      },
      {
        authorId: bob.id,
        title: "Ceviche",
        description: "Marinated raw fish with lime and cilantro",
        published: true,
        foodId: foodCeviche.id,
        imageId: imgCeviche.id,
      },
      {
        authorId: charlie.id,
        title: "Carnitas",
        description: "Slow-cooked shredded pork",
        published: true,
        foodId: foodCarnitas.id,
        imageId: imgCarnitas.id,
      },
      {
        authorId: bob.id,
        title: "Pancakes with Syrup",
        description: "Fluffy pancakes topped with maple syrup",
        published: true,
        foodId: foodPancakes.id,
        imageId: imgPancakes.id,
      },
      {
        authorId: charlie.id,
        title: "Scrambled Eggs",
        description: "Creamy scrambled eggs with chives",
        published: true,
        foodId: foodScrambledEggs.id,
        imageId: imgScrambledEggs.id,
      },
      {
        authorId: bob.id,
        title: "French Toast",
        description: "Golden-brown French toast with powdered sugar",
        published: true,
        foodId: foodFrenchToast.id,
        imageId: imgFrenchToast.id,
      },
      {
        authorId: charlie.id,
        title: "Breakfast Burrito",
        description: "Tortilla filled with eggs, cheese, and sausage",
        published: true,
        foodId: foodBreakfastBurrito.id,
        imageId: imgBreakfastBurrito.id,
      },
      {
        authorId: bob.id,
        title: "Eggs Benedict",
        description: "Poached eggs on English muffins with hollandaise sauce",
        published: true,
        foodId: foodEggsBenedict.id,
        imageId: imgEggsBenedict.id,
      },
      {
        authorId: charlie.id,
        title: "Greek Yogurt Parfait",
        description: "Layers of yogurt, granola, and fresh berries",
        published: true,
        foodId: foodGreekYogurtParfait.id,
        imageId: imgGreekYogurtParfait.id,
      },
      {
        authorId: bob.id,
        title: "Oatmeal with Berries",
        description: "Warm oatmeal topped with fresh berries and honey",
        published: true,
        foodId: foodOatmeal.id,
        imageId: imgOatmeal.id,
      },
      {
        authorId: charlie.id,
        title: "Bagel with Cream Cheese",
        description: "Toasted bagel spread with cream cheese",
        published: true,
        foodId: foodBagel.id,
        imageId: imgBagel.id,
      },
      {
        authorId: bob.id,
        title: "Sausage & Egg Muffin",
        description: "Breakfast sandwich with sausage patty and egg",
        published: true,
        foodId: foodSausageMuffin.id,
        imageId: imgSausageMuffin.id,
      },
      {
        authorId: charlie.id,
        title: "Banana Smoothie Bowl",
        description: "Blended banana smoothie topped with granola and fruit",
        published: true,
        foodId: foodBananaSmoothie.id,
        imageId: imgBananaSmoothie.id,
      },
      {
        authorId: bob.id,
        title: "Cinnamon Rolls",
        description: "Soft cinnamon rolls with icing",
        published: true,
        foodId: foodCinnamonRolls.id,
        imageId: imgCinnamonRolls.id,
      },
      {
        authorId: charlie.id,
        title: "Granola with Milk",
        description: "Crunchy granola served with cold milk",
        published: true,
        foodId: foodGranola.id,
        imageId: imgGranola.id,
      },
      {
        authorId: bob.id,
        title: "Veggie Omelette",
        description: "Omelette filled with fresh vegetables and cheese",
        published: true,
        foodId: foodVeggieOmelette.id,
        imageId: imgVeggieOmelette.id,
      },
      {
        authorId: charlie.id,
        title: "Fruit Salad",
        description: "Mix of fresh seasonal fruits",
        published: true,
        foodId: foodFruitSalad.id,
        imageId: imgFruitSalad.id,
      },
      {
        authorId: bob.id,
        title: "Waffles with Berries",
        description:
          "Crispy waffles topped with fresh berries and whipped cream",
        published: true,
        foodId: foodWaffles.id,
        imageId: imgWaffles.id,
      },
    ] as Prisma.PostCreateManyInput[],
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

  console.log("✅ Seed complete");
  console.table([{ users, posts, follows, categories, foods, images }]);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
