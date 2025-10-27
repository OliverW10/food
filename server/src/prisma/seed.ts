// This file was created by Oliver/Mukund on setup and was worked on by a few people
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";

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
    where: { name },
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
      email: "alice@example.com",
      name: "Alice",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: "charlie@example.com" },
    update: {},
    create: {
      email: "charlie@example.com",
      name: "Charlie",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const diana = await prisma.user.upsert({
    where: { email: "diana@example.com" },
    update: {},
    create: {
      email: "diana@example.com",
      name: "Diana",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const edward = await prisma.user.upsert({
    where: { email: "edward@example.com" },
    update: {},
    create: {
      email: "edward@example.com",
      name: "Edward",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const fiona = await prisma.user.upsert({
    where: { email: "fiona@example.com" },
    update: {},
    create: {
      email: "fiona@example.com",
      name: "Fiona",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const george = await prisma.user.upsert({
    where: { email: "george@example.com" },
    update: {},
    create: {
      email: "george@example.com",
      name: "George",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const helen = await prisma.user.upsert({
    where: { email: "helen@example.com" },
    update: {},
    create: {
      email: "helen@example.com",
      name: "Helen",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const ian = await prisma.user.upsert({
    where: { email: "ian@example.com" },
    update: {},
    create: {
      email: "ian@example.com",
      name: "Ian",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const jessica = await prisma.user.upsert({
    where: { email: "jessica@example.com" },
    update: {},
    create: {
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
      email: "laura@example.com",
      name: "Laura",
      passwordHash: await bcrypt.hash("password1", 10),
    },
  });

  const michael = await prisma.user.upsert({
    where: { email: "michael@example.com" },
    update: {},
    create: {
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
  const imgRamen = await createImage(
    "https://www.allrecipes.com/thmb/FL-xnyAllLyHcKdkjUZkotVlHR8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/46822-indian-chicken-curry-ii-DDMFS-4x3-39160aaa95674ee395b9d4609e3b0988.jpg"
  ); // Ramen
  const imgPizza = await createImage(
    "https://au.ooni.com/cdn/shop/articles/20220211142645-margherita-9920.jpg?v=1737368217"
  ); // Pizza
  const imgTacos = await createImage(
    "https://www.onceuponachef.com/images/2023/08/Beef-Tacos.jpg"
  ); // Tacos
  const imgSushi = await createImage(
    "https://int.japanesetaste.com/cdn/shop/articles/how-to-make-makizushi-sushi-rolls-japanese-taste.jpg?v=1707914944&width=5760"
  ); // Sushi
  const imgAvoToast = await createImage(
    "https://gratefulgrazer.com/wp-content/uploads/2025/01/avocado-toast-square.jpg"
  ); // Avocado Toast
  const imgPockySticks = await createImage(
    "https://premiumco.com.au/cdn/shop/products/IMG_7488.jpg?v=1613384779"
  ); // Pocky Sticks
  const imgDorayakiPancakes = await createImage(
    "https://www.thespruceeats.com/thmb/-xseebOwSzkn4MRb2h24jle_Se4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/japanese-dorayaki-recipe-2031077-hero-01-892a9d5eea884bc28858914ba9d80429.jpg"
  ); // Dorayaki Pancakes
  const imgTempuraUdon = await createImage(
    "https://www.chopstickchronicles.com/wp-content/uploads/2020/06/Tempura-Udon-update-18-e1738984922859.jpg"
  ); // Tempura Udon
  const imgChickenKatsuCurry = await createImage(
    "https://static01.nyt.com/images/2021/05/23/dining/kc-chicken-katsu/kc-chicken-katsu-mediumSquareAt3X-v2.jpg"
  ); // Chicken Katsu Curry
  const imgSalmonNigiri = await createImage(
    "https://aisforappleau.com/wp-content/uploads/2023/07/how-to-make-sushi-salmon-nigiri-6.jpg"
  ); // Salmon Nigiri
  const imgTonkotsuRamen = await createImage(
    "https://www.seriouseats.com/thmb/IBikLAGkkP2QVaF3vLIk_LeNqHM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/rich-and-creamy-tonkotsu-ramen-broth-from-scratch-recipe-Diana-Chistruga-hero-6d318fadcca64cc9ac3e1c40fc7682fb.JPG"
  );
  const imgTakoyaki = await createImage(
    "https://static01.nyt.com/images/2024/01/10/multimedia/ND-Takoyaki-wfhg/ND-Takoyaki-wfhg-mediumSquareAt3X.jpg"
  );
  const imgOkonomiyaki = await createImage(
    "https://int.japanesetaste.com/cdn/shop/articles/how-to-make-osaka-style-okonomiyaki-at-home-japanese-savory-pancake-japanese-taste_b2239bd7-ec67-4460-9294-197693e160f4.jpg?v=1741276847&width=5760"
  );
  const imgMisoSoup = await createImage(
    "https://assets.epicurious.com/photos/63ceb68b7d88c936746ada44/1:1/w_4546,h_4546,c_limit/MisoSoup_RECIPE_012023_46093.jpg"
  );
  const imgUnagiDon = await createImage(
    "https://sudachirecipes.com/wp-content/uploads/2022/07/unagi-don-sqr.jpg"
  );
  const imgBeefYakiniku = await createImage(
    "https://www.kitchensanctuary.com/wp-content/uploads/2024/08/Beef-Yakiniku-square-FS.jpg"
  );
  const imgChashuRiceBowl = await createImage(
    "https://www.cookeatworld.com/wp-content/uploads/2023/01/Chashu-Don-4.jpg"
  );
  const imgMatchaIceCream = await createImage(
    "https://www.allrecipes.com/thmb/totJUia-TjrmF6VnYGHOM5hVjqQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/241759-matcha-green-tea-ice-cream-VAT-003-4x3-01closeup-692d327cc2174abb84b440568f61e29a.jpg"
  );
  const imgSpaghettiCarbonara = await createImage(
    "https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg"
  );
  const imgLasagna = await createImage(
    "https://assets.bonappetit.com/photos/656f48d75b552734225041ba/4:3/w_4172,h_3129,c_limit/20231120-WEB-Lasanga-6422.jpg"
  );
  const imgFettuccineAlfredo = await createImage(
    "https://www.allrecipes.com/thmb/6iFrYmTh80DMqrMAOYTYKfBawvY=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/AR-23431-to-die-for-fettuccine-alfredo-DDMFS-beauty-3x4-b64d36c7ff314cb39774e261c5b18352.jpg"
  );
  const imgCapreseSalad = await createImage(
    "https://cdn.loveandlemons.com/wp-content/uploads/2019/08/caprese-salad-recipe-1.jpg"
  );
  const imgRisotto = await createImage(
    "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/8D2A0883-95BA-4C9F-A575-303577F532D4/Derivates/A87AD746-0DFD-49AE-B1B2-071227001579.jpg"
  );
  const imgBruschetta = await createImage(
    "https://www.allrecipes.com/thmb/QSsjryxShEx1L6o0HLer1Nn4jwA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/54165-balsamic-bruschetta-DDMFS-4x3-e2b55b5ca39b4c1783e524a2461634ea.jpg"
  );
  const imgGnocchiWithPesto = await createImage(
    "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/3A94F682-EF98-4805-AF10-607A8B69FC74/Derivates/F4247BBE-40EB-4264-A845-14BA911AD0C8.jpg"
  );
  const imgTiramisu = await createImage(
    "https://bakewithzoha.com/wp-content/uploads/2025/06/tiramisu-featured.jpg"
  );
  const imgStuffedCannelloni = await createImage(
    "https://www.recipetineats.com/tachyon/2017/09/Spinach-Ricotta-Cannelloni-1-copy-1.jpg"
  );
  const imgEggplantParmigiana = await createImage(
    "https://www.recipetineats.com/tachyon/2021/05/Eggplant-Parmigiana_1-SQ.jpg"
  );
  const imgMinestroneSoup = await createImage(
    "https://www.aberdeenskitchen.com/wp-content/uploads/2019/10/Easy-Classic-Minestrone-Soup-1-FI-Thumbnail-1200X1200.jpg"
  );
  const imgFocacciaBread = await createImage(
    "https://helloyummy.co/wp-content/uploads/2024/06/no-knead-foccacia-bread5.jpg"
  );
  const imgArancini = await createImage(
    "https://www.allrecipes.com/thmb/hxUMuQmebF0imzrV0-dLQRBGK08=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/RM-57844-Arancini-ddmfs-3x4-6021-19619bf1fd4d41279000e464618dd411.jpg"
  );
  const imgPannaCotta = await createImage(
    "https://www.recipetineats.com/tachyon/2025/09/Panna-cotta_8-close-up.jpg"
  );
  const imgBologneseSauce = await createImage(
    "https://assets.bonappetit.com/photos/5c2f8fe22efb8f2d33e396ca/1:1/w_2560%2Cc_limit/bolognese.jpg"
  );
  const imgChickenEnchiladas = await createImage(
    "https://www.allrecipes.com/thmb/tc829Re3dQr_49ETCLFBZnKYb7o=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8691-chicken-enchiladas-DDMFS-4x3-322-de64088bd2e248c7b6f86572e821e9f7.jpg"
  );
  const imgCarneAsada = await createImage(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Carne_asada_%284472586086%29.jpg/1200px-Carne_asada_%284472586086%29.jpg"
  );
  const imgChilesRellenos = await createImage(
    "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/4/5/0/RX-FNM_050111-TTAH-0082_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1371595357950.webp"
  );
  const imgTamales = await createImage(
    "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/68D64DAE-9605-42AC-BDCF-328A509EC776/Derivates/7AC0E9FD-F0DA-410B-9D78-19D3C3BEA1F3.jpg"
  );
  const imgHuevosRancheros = await createImage(
    "https://www.foodandwine.com/thmb/zdZ5CZRaAi1a8ahUM_hEmLl-ULs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-fish-tacos-FT-RECIPE0825-98c4bc48f8f44b4e88b9c8e6d69faad3.jpg"
  );
  const imgFishTacos = await createImage(
    "https://i0.wp.com/espressoandlime.com/wp-content/uploads/2021/06/Fried-Fish-Tacos-06-scaled.jpg?fit=1706%2C2560&ssl=1"
  );
  const imgQuesadillas = await createImage(
    "https://www.recipetineats.com/tachyon/2018/06/Quesadillas_4.jpg"
  );
  const imgPozole = await createImage(
    "https://hips.hearstapps.com/hmg-prod/images/pozole-index-655b86b9eeb3f.jpg?crop=0.502xw:1.00xh;0.0561xw,0&resize=1200:*"
  );
  const imgGuacamoleChips = await createImage(
    "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/04/Guacamole-3-2.jpg"
  );
  const imgElote = await createImage(
    "https://cdn.loveandlemons.com/wp-content/uploads/2023/06/elote.jpg"
  );
  const imgChurros = await createImage(
    "https://www.allrecipes.com/thmb/zfiXdLbitO4XtOuKobYCmnDoPg4=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/ALR-recipe-24700-churros-VAT-hero-03-4x3-a7f6af1860934b0385f84ab9f13f2613.jpg"
  );
  const imgMolePoblano = await createImage(
    "https://www.mexicoinmykitchen.com/wp-content/uploads/2009/02/Mole-Poblano-recipe-2-500x500.jpg"
  );
  const imgSopaDeLima = await createImage(
    "https://www.seriouseats.com/thmb/9lylUmOSkIlUH1_hNa6zTmenGl4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2016__05__20160505-sopa-de-lima-22-a78c408efb60416d8b6e36b45e3977fa.jpg"
  );
  const imgCeviche = await createImage(
    "https://www.feastingathome.com/wp-content/uploads/2015/04/Ceviche-Recipe.jpg"
  );
  const imgCarnitas = await createImage(
    "https://www.recipetineats.com/tachyon/2018/05/Pork-Carnitas-1000px.jpg?resize=500%2C375"
  );
  const imgPancakes = await createImage(
    "https://www.marthastewart.com/thmb/Vgb9cQSlegZz5fcoSbkkqyHPmHY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/338185-basic-pancakes-09-00b18f8418fd4e52bb2050173d083d04.jpg"
  );
  const imgScrambledEggs = await createImage(
    "https://hips.hearstapps.com/hmg-prod/images/scrambled-eggs-socialindex-web-0066-lp-del039925-67eb04f9a151b.jpg?crop=0.8887545953568011xw:1xh;center,top&resize=1200:*"
  );
  const imgFrenchToast = await createImage(
    "https://www.allrecipes.com/thmb/GHsW45mTpy_2EFSjCNEPdeo7Tek=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/ALR-recipe-16895-fluffy-french-toast-hero-01-ddmfs-4x3-7fd61e054f2c4f0f868b7ab0dd8767ae.jpg"
  );
  const imgBreakfastBurrito = await createImage(
    "https://hips.hearstapps.com/hmg-prod/images/breakfast-burrito-index-66a7e23ca6c89.jpg?crop=0.669xw:1.00xh;0.261xw,0&resize=1200:*"
  );
  const imgEggsBenedict = await createImage(
    "https://www.allrecipes.com/thmb/eJzkN3OxGGhkDHCU0puFRtyBmls=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/17205-eggs-benedict-DDMFS-4x3-a0042d5ae1da485fac3f468654187db0.jpg"
  );
  const imgGreekYogurtParfait = await createImage(
    "https://foolproofliving.com/wp-content/uploads/2017/12/Greek-Yogurt-Parfait-Recipe.jpg"
  );
  const imgOatmeal = await createImage(
    "https://www.veggiesdontbite.com/wp-content/uploads/2020/04/vegan-oatmeal-recipe-FI-500x500.jpg"
  );
  const imgBagel = await createImage(
    "https://www.layersofhappiness.com/wp-content/uploads/2023/07/Everything-Bagel-Breakfast-Sandwich-6-700x1050.jpg"
  );
  const imgSausageMuffin = await createImage(
    "https://www.recipetineats.com/tachyon/2016/05/Sausage-Egg-McMuffins_5.jpg"
  );
  const imgBananaSmoothie = await createImage(
    "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2023/06/Banana-Smoothie-5.jpg"
  );
  const imgCinnamonRolls = await createImage(
    "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2FPhoto%2FRecipes%2F2024-11-cinnamon-rolls%2Fcinnamon-rolls-211"
  );
  const imgGranola = await createImage(
    "https://cookieandkate.com/images/2015/10/best-granola-recipe-1.jpg"
  );
  const imgVeggieOmelette = await createImage(
    "https://www.healthyfood.com/wp-content/uploads/2018/02/Basic-omelette.jpg"
  );
  const imgFruitSalad = await createImage(
    "https://cdn.loveandlemons.com/wp-content/uploads/2025/06/fruit-salad.jpg"
  );
  const imgWaffles = await createImage(
    "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/c6ea15c4-52ab-4119-b886-a7fb1d052f45/Derivates/b18fcddc-3b31-4ae9-9cd1-5a81751d91b3.jpg"
  );

  // === POSTS ===
  // Note: Post.imageId is unique — create one image per post (done above).
  await prisma.post.createMany({
    data: [
      {
        authorId: bob.id,
        title: "Homemade Ramen",
        description:
          "Last night, I decided to try my hand at making ramen from scratch. The kitchen filled with the aroma of simmering shoyu broth, and I spent nearly an hour perfecting the soft-boiled eggs. As I slurped the noodles, I was transported back to a tiny Tokyo alleyway where I first fell in love with this dish. Cooking it at home made me appreciate the craft even more.",
        published: true,
        foodId: foodRamen.id,
        imageId: imgRamen.id,
      },
      {
        authorId: charlie.id,
        title: "Margherita Pizza",
        description:
          "There’s something magical about a classic Margherita pizza. I made this one on a rainy Sunday, kneading the dough while listening to old Italian records. The scent of basil and melting mozzarella filled my apartment, and each bite reminded me of a summer spent wandering the streets of Naples, searching for the perfect slice.",
        published: true,
        foodId: foodPizza.id,
        imageId: imgPizza.id,
      },
      {
        authorId: alice.id,
        title: "Beef Tacos",
        description:
          "Taco night is a tradition in my house, and these beef tacos are always the star. I love piling on fresh pico de gallo and a squeeze of lime, then gathering around the table with friends. The crunch of the shell and the burst of flavors always spark laughter and stories about our favorite street food adventures.",
        published: true,
        foodId: foodTacos.id,
        imageId: imgTacos.id,
      },
      {
        authorId: kevin.id,
        title: "Sushi Platter",
        description:
          "I spent the afternoon learning how to shape sushi rice and slice fish just right. My first attempt at a sushi platter was far from perfect, but the salmon, tuna, and tamago brought a taste of the sea to my kitchen. Sharing it with my roommate, we laughed at our clumsy rolls and dreamed of visiting Tsukiji Market someday.",
        published: true,
        foodId: foodSushi.id,
        imageId: imgSushi.id,
      },
      {
        authorId: helen.id,
        title: "Avocado Toast",
        description:
          "This morning’s breakfast was a simple pleasure: thick slices of sourdough, toasted until golden, topped with creamy avocado and a sprinkle of chili flakes. I ate it on the balcony, watching the city wake up, and felt grateful for the little rituals that make each day feel special.",
        published: true,
        foodId: foodAvoToast.id,
        imageId: imgAvoToast.id,
      },
      {
        authorId: george.id,
        title: "Pocky Sticks",
        description:
          "Whenever I need a pick-me-up, I reach for a box of Pocky. There’s something nostalgic about these chocolate-covered biscuit sticks—they remind me of after-school snacks and late-night study sessions. Today, I shared them with a friend over coffee, and we reminisced about our favorite childhood treats.",
        published: true,
        foodId: foodPockySticks.id,
        imageId: imgPockySticks.id,
      },
      {
        authorId: laura.id,
        title: "Dorayaki Pancakes",
        description:
          "Making dorayaki pancakes is a labor of love. The batter sizzles on the pan, and the sweet red bean paste oozes out with every bite. I made a batch for my neighbor, who grew up in Japan, and she said they tasted just like home. That’s the best compliment I could hope for.",
        published: true,
        foodId: foodDorayakiPancakes.id,
        imageId: imgDorayakiPancakes.id,
      },
      {
        authorId: charlie.id,
        title: "Tempura Udon",
        description:
          "After a long week, I treated myself to a bowl of tempura udon. The shrimp tempura was perfectly crisp, and the udon noodles were chewy and satisfying. I slurped the broth while watching the rain fall outside, feeling cozy and content in my little apartment.",
        published: true,
        foodId: foodTempuraUdon.id,
        imageId: imgTempuraUdon.id,
      },
      {
        authorId: bob.id,
        title: "Chicken Katsu Curry",
        description:
          "Chicken katsu curry is my ultimate comfort food. I love the crunch of the breaded cutlet and the rich, savory curry sauce. Tonight, I made it for my partner, and we ate it while watching our favorite show. It’s amazing how food can turn an ordinary evening into something memorable.",
        published: true,
        foodId: foodChickenKatsuCurry.id,
        imageId: imgChickenKatsuCurry.id,
      },
      {
        authorId: michael.id,
        title: "Salmon Nigiri",
        description:
          "There’s an art to making salmon nigiri. I spent the afternoon perfecting the rice and slicing the salmon just so. When I finally got it right, I felt a quiet sense of accomplishment. Sharing the nigiri with friends, we toasted to small victories and good company.",
        published: true,
        foodId: foodSalmonNigiri.id,
        imageId: imgSalmonNigiri.id,
      },
      {
        authorId: diana.id,
        title: "Tonkotsu Ramen",
        description:
          "I’ve always been intimidated by tonkotsu ramen, but today I finally gave it a try. The broth simmered for hours, filling my home with an irresistible aroma. When I took my first bite, I couldn’t believe I’d made something so rich and flavorful. It’s a recipe I’ll return to again and again.",
        published: true,
        foodId: foodTonkotsuRamen.id,
        imageId: imgTonkotsuRamen.id,
      },
      {
        authorId: fiona.id,
        title: "Takoyaki",
        description:
          "Making takoyaki is always a fun, messy adventure. The batter sizzles in the special pan, and I try to flip each ball just right. My friends and I compete to see whose takoyaki turns out the roundest, and we always end up laughing and covered in flour.",
        published: true,
        foodId: foodTakoyaki.id,
        imageId: imgTakoyaki.id,
      },
      {
        authorId: alice.id,
        title: "Okonomiyaki",
        description:
          "Okonomiyaki is my go-to dish when I want something hearty and satisfying. I love mixing the batter, adding cabbage and pork, and watching it all come together on the griddle. Topped with a swirl of mayo and a sprinkle of bonito flakes, it’s pure comfort on a plate.",
        published: true,
        foodId: foodOkonomiyaki.id,
        imageId: imgOkonomiyaki.id,
      },
      {
        authorId: alice.id,
        title: "Miso Soup",
        description:
          "Whenever I’m feeling under the weather, I make a pot of miso soup. The gentle flavors of tofu and seaweed are soothing, and the steam warms me from the inside out. It’s a simple recipe, but it always makes me feel cared for.",
        published: true,
        foodId: foodMisoSoup.id,
        imageId: imgMisoSoup.id,
      },
      {
        authorId: bob.id,
        title: "Unagi Don",
        description:
          "Unagi don is a special treat in my house. The sweet, smoky flavor of grilled eel over fluffy rice is pure bliss. I made it for a friend’s birthday, and we celebrated with sake and stories late into the night.",
        published: true,
        foodId: foodUnagiDon.id,
        imageId: imgUnagiDon.id,
      },
      {
        authorId: charlie.id,
        title: "Beef Yakiniku",
        description:
          "Tonight’s dinner was beef yakiniku, grilled right at the table. The sizzle of the meat and the aroma of tare sauce made my mouth water. Sharing the meal with friends, we took turns cooking and telling stories, savoring every bite.",
        published: true,
        foodId: foodBeefYakiniku.id,
        imageId: imgBeefYakiniku.id,
      },
      {
        authorId: bob.id,
        title: "Chashu Rice Bowl",
        description:
          "I spent the afternoon slow-cooking pork belly for this chashu rice bowl. The kitchen filled with the scent of ginger and soy, and I couldn’t wait to dig in. When I finally sat down to eat, each bite was melt-in-your-mouth tender—a reward for my patience.",
        published: true,
        foodId: foodChashuRiceBowl.id,
        imageId: imgChashuRiceBowl.id,
      },
      {
        authorId: kevin.id,
        title: "Matcha Ice Cream",
        description:
          "On a hot afternoon, I decided to make matcha ice cream from scratch. The earthy aroma of the matcha powder filled my kitchen as I whisked it into the creamy base. After hours of anticipation, the first spoonful was a revelation—smooth, slightly bitter, and perfectly sweet. I sat on the porch, letting the coolness melt on my tongue, and thought about the tea ceremonies I’d read about in old Japanese novels. It’s amazing how a simple dessert can transport you to another world, even if just for a moment. Sharing it with friends, we laughed about our failed attempts at other desserts and agreed that this one was a keeper.",
        published: true,
        foodId: foodMatchaIceCream.id,
        imageId: imgMatchaIceCream.id,
      },
      {
        authorId: bob.id,
        title: "Spaghetti Carbonara",
        description:
          "Spaghetti carbonara is my go-to dish when I want something quick but comforting. Tonight, I used pancetta and fresh eggs, whisking them together with a generous handful of parmesan. The sauce clung to each strand of pasta, and the first bite was pure bliss. I remembered the tiny trattoria in Rome where I first tasted real carbonara, and tried to recreate that magic at home. Cooking for myself is a small act of self-care, and this meal was a reminder that even the simplest recipes can bring the most joy.",
        published: true,
        foodId: foodSpaghettiCarbonara.id,
        imageId: imgSpaghettiCarbonara.id,
      },
      {
        authorId: laura.id,
        title: "Lasagna",
        description:
          "Lasagna is a labor of love. I spent the afternoon simmering the sauce, layering noodles, and grating cheese. The house filled with the scent of garlic and tomatoes, and I couldn’t wait to dig in. When I finally pulled the bubbling dish from the oven, it was golden and perfect. Each bite was a reminder of family dinners and laughter around the table. I shared leftovers with my neighbor, who said it tasted just like her grandmother’s. That’s the highest praise I could hope for.",
        published: true,
        foodId: foodLasagna.id,
        imageId: imgLasagna.id,
      },
      {
        authorId: alice.id,
        title: "Fettuccine Alfredo",
        description:
          "There’s something indulgent about fettuccine Alfredo. I made the sauce with real butter and cream, tossing it with fresh pasta until every strand was coated. The result was rich and satisfying, the kind of meal that makes you want to linger at the table. I paired it with a glass of white wine and a good book, savoring the quiet evening. Sometimes, the best meals are the ones you make just for yourself.",
        published: true,
        foodId: foodFettuccineAlfredo.id,
        imageId: imgFettuccineAlfredo.id,
      },
      {
        authorId: charlie.id,
        title: "Caprese Salad",
        description:
          "Caprese salad is my favorite way to celebrate summer. I picked tomatoes from the garden, sliced fresh mozzarella, and plucked basil leaves from the windowsill. Drizzled with olive oil and a sprinkle of sea salt, it was the taste of sunshine on a plate. I ate it outside, barefoot in the grass, and felt grateful for the simple pleasures of the season.",
        published: true,
        foodId: foodCapreseSalad.id,
        imageId: imgCapreseSalad.id,
      },
      {
        authorId: fiona.id,
        title: "Risotto alla Milanese",
        description:
          "Making risotto alla Milanese is a test of patience. I stirred the rice slowly, adding broth one ladle at a time, until it was creamy and tender. The saffron gave it a beautiful golden hue, and the flavor was delicate but rich. I served it with a sprinkle of parmesan and a glass of wine, feeling like I’d brought a little bit of Milan into my kitchen.",
        published: true,
        foodId: foodRisotto.id,
        imageId: imgRisotto.id,
      },
      {
        authorId: charlie.id,
        title: "Bruschetta",
        description:
          "Bruschetta is my go-to appetizer for summer gatherings. I grill slices of bread until they’re crisp, then top them with a mixture of ripe tomatoes, garlic, and basil. The first bite is always a burst of flavor, and it never fails to impress guests. I love how something so simple can be so delicious.",
        published: true,
        foodId: foodBruschetta.id,
        imageId: imgBruschetta.id,
      },
      {
        authorId: edward.id,
        title: "Gnocchi with Pesto",
        description:
          "I made gnocchi with pesto for dinner tonight, and it was a hit. The pillowy potato dumplings soaked up the bright, herby sauce, and every bite was a delight. Cooking from scratch takes time, but the results are always worth it. I shared the meal with friends, and we lingered at the table long after the plates were empty.",
        published: true,
        foodId: foodGnocchiWithPesto.id,
        imageId: imgGnocchiWithPesto.id,
      },
      {
        authorId: charlie.id,
        title: "Tiramisu",
        description:
          "Tiramisu is my favorite dessert to make for special occasions. I layer espresso-soaked ladyfingers with creamy mascarpone, then dust the top with cocoa powder. The flavors meld together overnight, and the result is pure decadence. I served it at a dinner party, and everyone asked for the recipe. It’s a classic for a reason.",
        published: true,
        foodId: foodTiramisu.id,
        imageId: imgTiramisu.id,
      },
      {
        authorId: ian.id,
        title: "Stuffed Cannelloni",
        description:
          "Stuffed cannelloni is a weekend project. I made the pasta from scratch, rolled it out thin, and filled each tube with a mixture of ricotta and spinach. Baked in a rich tomato sauce, it was the ultimate comfort food. I invited friends over to share, and we spent the evening eating, drinking, and catching up.",
        published: true,
        foodId: foodStuffedCannelloni.id,
        imageId: imgStuffedCannelloni.id,
      },
      {
        authorId: charlie.id,
        title: "Eggplant Parmigiana",
        description:
          "Eggplant parmigiana is a dish that takes me back to my childhood. My grandmother used to make it every Sunday, and the smell of frying eggplant always brings back memories. I tried to recreate her recipe, layering the slices with marinara and cheese. It wasn’t quite the same, but it was delicious in its own way.",
        published: true,
        foodId: foodEggplantParmigiana.id,
        imageId: imgEggplantParmigiana.id,
      },
      {
        authorId: jessica.id,
        title: "Minestrone Soup",
        description:
          "Minestrone soup is my answer to chilly days. I chop whatever vegetables I have on hand, simmer them with beans and pasta, and let the flavors meld together. The result is a hearty, nourishing soup that warms you from the inside out. I like to make a big pot and eat it throughout the week.",
        published: true,
        foodId: foodMinestroneSoup.id,
        imageId: imgMinestroneSoup.id,
      },
      {
        authorId: charlie.id,
        title: "Focaccia Bread",
        description:
          "Baking focaccia bread is a meditative process. I knead the dough, let it rise, and press my fingers into the surface before drizzling it with olive oil and rosemary. The smell as it bakes is intoxicating, and the first bite is always the best. I love sharing it with friends, still warm from the oven.",
        published: true,
        foodId: foodFocacciaBread.id,
        imageId: imgFocacciaBread.id,
      },
      {
        authorId: bob.id,
        title: "Arancini",
        description:
          "Arancini are a treat I discovered while traveling in Sicily. The crispy, golden rice balls are filled with gooey cheese and sometimes a bit of meat or peas. I tried making them at home, and while they weren’t quite as good as the ones from the street vendors, they brought back wonderful memories of my trip.",
        published: true,
        foodId: foodArancini.id,
        imageId: imgArancini.id,
      },
      {
        authorId: jessica.id,
        title: "Panna Cotta",
        description:
          "Panna cotta is my go-to dessert for dinner parties. It’s elegant but surprisingly easy to make. I infuse the cream with vanilla, let it set, and serve it with a homemade berry sauce. The contrast of creamy and tart is irresistible, and it always impresses guests.",
        published: true,
        foodId: foodPannaCotta.id,
        imageId: imgPannaCotta.id,
      },
      {
        authorId: bob.id,
        title: "Bolognese Sauce",
        description:
          "Bolognese sauce is a staple in my kitchen. I let it simmer for hours, filling the house with the smell of tomatoes and herbs. The result is a rich, meaty sauce that’s perfect over pasta or spooned onto crusty bread. It’s the kind of recipe that gets better with time.",
        published: true,
        foodId: foodBologneseSauce.id,
        imageId: imgBologneseSauce.id,
      },
      {
        authorId: michael.id,
        title: "Chicken Enchiladas",
        description:
          "Chicken enchiladas are my favorite way to use up leftover roast chicken. I roll the meat in tortillas, smother them in sauce and cheese, and bake until bubbly. The result is a comforting, satisfying meal that always disappears fast. I like to serve them with a side of rice and beans.",
        published: true,
        foodId: foodChickenEnchiladas.id,
        imageId: imgChickenEnchiladas.id,
      },
      {
        authorId: bob.id,
        title: "Carne Asada",
        description:
          "Carne asada is a dish I learned to make from a friend’s family. The steak is marinated in lime juice, garlic, and spices, then grilled over an open flame. The smoky, tangy flavor is unbeatable. I like to serve it with warm tortillas, salsa, and plenty of fresh cilantro.",
        published: true,
        foodId: foodCarneAsada.id,
        imageId: imgCarneAsada.id,
      },
      {
        authorId: ian.id,
        title: "Chiles Rellenos",
        description:
          "Chiles rellenos are a labor of love. I roast and peel the poblano peppers, stuff them with cheese, and dip them in a light batter before frying. The result is a dish that’s crispy on the outside, gooey on the inside, and full of flavor. It’s always worth the effort.",
        published: true,
        foodId: foodChilesRellenos.id,
        imageId: imgChilesRellenos.id,
      },
      {
        authorId: bob.id,
        title: "Tamales",
        description:
          "Making tamales is a family tradition. We gather in the kitchen, spreading masa on corn husks and filling them with meat or beans. The process is time-consuming, but it’s a chance to catch up and share stories. When the tamales are finally steamed, we eat them together, grateful for the time spent as much as the food itself.",
        published: true,
        foodId: foodTamales.id,
        imageId: imgTamales.id,
      },
      {
        authorId: diana.id,
        title: "Huevos Rancheros",
        description:
          "Huevos rancheros is my go-to breakfast on lazy weekends. I fry eggs, place them on warm tortillas, and top them with spicy salsa. The combination of flavors and textures is unbeatable. I like to eat it outside, with a cup of coffee and the morning sun on my face.",
        published: true,
        foodId: foodHuevosRancheros.id,
        imageId: imgHuevosRancheros.id,
      },
      {
        authorId: bob.id,
        title: "Fish Tacos",
        description:
          "Fish tacos are a taste of summer. I grill white fish, pile it onto corn tortillas, and top it with crunchy cabbage slaw and a squeeze of lime. The flavors are fresh and bright, perfect for a picnic or a casual dinner with friends.",
        published: true,
        foodId: foodFishTacos.id,
        imageId: imgFishTacos.id,
      },
      {
        authorId: fiona.id,
        title: "Quesadillas",
        description:
          "Quesadillas are my favorite midnight snack. I fill tortillas with cheese, grill them until golden, and cut them into wedges. Sometimes I add beans, chicken, or veggies, depending on what I have in the fridge. They’re quick, easy, and always satisfying.",
        published: true,
        foodId: foodQuesadillas.id,
        imageId: imgQuesadillas.id,
      },
      {
        authorId: bob.id,
        title: "Pozole",
        description:
          "Pozole is a dish I make for celebrations. The hominy soup is rich and flavorful, filled with tender pork and topped with radishes, cabbage, and lime. It’s a meal that brings people together, and I love serving it at parties and family gatherings.",
        published: true,
        foodId: foodPozole.id,
        imageId: imgPozole.id,
      },
      {
        authorId: alice.id,
        title: "Guacamole & Chips",
        description:
          "Guacamole and chips are a staple at every party I host. I mash ripe avocados with lime, cilantro, and a bit of jalapeño, then serve it with crunchy tortilla chips. It’s the perfect snack for sharing, and it always disappears fast.",
        published: true,
        foodId: foodGuacamoleChips.id,
        imageId: imgGuacamoleChips.id,
      },
      {
        authorId: bob.id,
        title: "Elote (Street Corn)",
        description:
          "Elote is my favorite street food. I grill corn on the cob, slather it with mayo, sprinkle on cheese and chili powder, and finish with a squeeze of lime. The combination of flavors is addictive, and it always reminds me of summer festivals.",
        published: true,
        foodId: foodElote.id,
        imageId: imgElote.id,
      },
      {
        authorId: charlie.id,
        title: "Churros",
        description:
          "Churros are my guilty pleasure. I fry strips of dough until golden, then roll them in cinnamon sugar. Dipped in chocolate sauce, they’re the ultimate treat. I like to make them for brunch with friends, and there are never any leftovers.",
        published: true,
        foodId: foodChurros.id,
        imageId: imgChurros.id,
      },
      {
        authorId: bob.id,
        title: "Mole Poblano",
        description:
          "Mole poblano is a dish I reserve for special occasions. The sauce is complex, made with chocolate, chiles, and spices, and it takes hours to prepare. The result is a rich, deeply flavored dish that’s worth every minute. I like to serve it with rice and warm tortillas.",
        published: true,
        foodId: foodMolePoblano.id,
        imageId: imgMolePoblano.id,
      },
      {
        authorId: charlie.id,
        title: "Sopa de Lima",
        description:
          "Sopa de lima is a bright, tangy soup from the Yucatan. I simmer chicken with lime juice, tomatoes, and spices, then top it with crispy tortilla strips. The flavors are refreshing and unique, and it’s a great way to wake up your taste buds.",
        published: true,
        foodId: foodSopaDeLima.id,
        imageId: imgSopaDeLima.id,
      },
      {
        authorId: ian.id,
        title: "Ceviche",
        description:
          "Ceviche is my favorite dish for hot days. I marinate fresh fish in lime juice, toss it with cilantro, onions, and tomatoes, and serve it cold. The flavors are bright and zesty, and it’s the perfect appetizer for a summer party.",
        published: true,
        foodId: foodCeviche.id,
        imageId: imgCeviche.id,
      },
      {
        authorId: fiona.id,
        title: "Carnitas",
        description:
          "Carnitas are a weekend project. I slow-cook pork until it’s tender, then crisp it up in a hot pan. The result is juicy, flavorful meat that’s perfect for tacos, burritos, or just eating straight from the pan. I like to serve it with pickled onions and fresh salsa.",
        published: true,
        foodId: foodCarnitas.id,
        imageId: imgCarnitas.id,
      },
      {
        authorId: alice.id,
        title: "Pancakes with Syrup",
        description:
          "Pancakes with syrup are my favorite way to start the weekend. I make a big stack, drizzle them with maple syrup, and eat them while still in my pajamas. It’s a simple pleasure that never gets old.",
        published: true,
        foodId: foodPancakes.id,
        imageId: imgPancakes.id,
      },
      {
        authorId: charlie.id,
        title: "Scrambled Eggs",
        description:
          "Scrambled eggs are my go-to breakfast when I’m in a hurry. I whisk the eggs with a splash of milk, cook them low and slow, and finish with a sprinkle of chives. The result is creamy, fluffy eggs that are always satisfying.",
        published: true,
        foodId: foodScrambledEggs.id,
        imageId: imgScrambledEggs.id,
      },
      {
        authorId: michael.id,
        title: "French Toast",
        description:
          "French toast is my favorite way to use up stale bread. I soak thick slices in a mixture of eggs, milk, and cinnamon, then fry them until golden. A dusting of powdered sugar and a drizzle of syrup make it extra special.",
        published: true,
        foodId: foodFrenchToast.id,
        imageId: imgFrenchToast.id,
      },
      {
        authorId: charlie.id,
        title: "Breakfast Burrito",
        description:
          "Breakfast burritos are my favorite grab-and-go meal. I fill tortillas with scrambled eggs, cheese, and sausage, then wrap them up and take them on the road. They’re perfect for busy mornings or lazy weekends alike.",
        published: true,
        foodId: foodBreakfastBurrito.id,
        imageId: imgBreakfastBurrito.id,
      },
      {
        authorId: edward.id,
        title: "Eggs Benedict",
        description:
          "Eggs Benedict is my go-to brunch dish. I poach eggs, place them on toasted English muffins, and top them with homemade hollandaise sauce. It’s a bit of a project, but the results are always worth it.",
        published: true,
        foodId: foodEggsBenedict.id,
        imageId: imgEggsBenedict.id,
      },
      {
        authorId: charlie.id,
        title: "Greek Yogurt Parfait",
        description:
          "Greek yogurt parfaits are my favorite healthy breakfast. I layer thick yogurt with crunchy granola and fresh berries, then drizzle with honey. It’s a beautiful, satisfying way to start the day.",
        published: true,
        foodId: foodGreekYogurtParfait.id,
        imageId: imgGreekYogurtParfait.id,
      },
      {
        authorId: fiona.id,
        title: "Oatmeal with Berries",
        description:
          "Oatmeal with berries is my go-to breakfast in the winter. I cook the oats until creamy, then top them with a handful of fresh berries and a drizzle of honey. It’s warm, comforting, and keeps me full all morning.",
        published: true,
        foodId: foodOatmeal.id,
        imageId: imgOatmeal.id,
      },
      {
        authorId: charlie.id,
        title: "Bagel with Cream Cheese",
        description:
          "Bagels with cream cheese are my favorite weekend treat. I toast the bagel until crisp, then spread it with a thick layer of cream cheese. Sometimes I add smoked salmon or sliced tomatoes for an extra-special breakfast.",
        published: true,
        foodId: foodBagel.id,
        imageId: imgBagel.id,
      },
      {
        authorId: alice.id,
        title: "Sausage & Egg Muffin",
        description:
          "Sausage and egg muffins are my favorite breakfast on the go. I cook sausage patties, fry an egg, and sandwich them between toasted English muffins. They’re quick, portable, and always hit the spot.",
        published: true,
        foodId: foodSausageMuffin.id,
        imageId: imgSausageMuffin.id,
      },
      {
        authorId: charlie.id,
        title: "Banana Smoothie Bowl",
        description:
          "Banana smoothie bowls are my favorite way to use up overripe bananas. I blend them with a splash of milk, then top with granola, fruit, and a drizzle of nut butter. It’s a healthy, delicious breakfast that feels like a treat.",
        published: true,
        foodId: foodBananaSmoothie.id,
        imageId: imgBananaSmoothie.id,
      },
      {
        authorId: george.id,
        title: "Cinnamon Rolls",
        description:
          "Cinnamon rolls are my favorite weekend baking project. I make the dough from scratch, roll it up with cinnamon sugar, and bake until golden. A drizzle of icing makes them extra special. They’re best enjoyed warm, with a cup of coffee and good company.",
        published: true,
        foodId: foodCinnamonRolls.id,
        imageId: imgCinnamonRolls.id,
      },
      {
        authorId: charlie.id,
        title: "Granola with Milk",
        description:
          "Granola with milk is my go-to snack. I make big batches of granola with oats, nuts, and honey, then serve it with cold milk for a quick, satisfying bite. It’s perfect for busy mornings or late-night cravings.",
        published: true,
        foodId: foodGranola.id,
        imageId: imgGranola.id,
      },
      {
        authorId: george.id,
        title: "Veggie Omelette",
        description:
          "Veggie omelettes are my favorite way to start the day. I sauté whatever vegetables I have on hand, then fold them into fluffy eggs with a bit of cheese. It’s a healthy, filling breakfast that keeps me going all morning.",
        published: true,
        foodId: foodVeggieOmelette.id,
        imageId: imgVeggieOmelette.id,
      },
      {
        authorId: charlie.id,
        title: "Fruit Salad",
        description:
          "Fruit salad is my favorite way to enjoy the bounty of summer. I mix whatever fruits are in season—berries, melon, peaches—and toss them with a squeeze of lime. It’s a refreshing, healthy treat that’s perfect for breakfast or dessert.",
        published: true,
        foodId: foodFruitSalad.id,
        imageId: imgFruitSalad.id,
      },
      {
        authorId: bob.id,
        title: "Waffles with Berries",
        description:
          "Waffles with berries are my favorite weekend breakfast. I make the batter from scratch, cook the waffles until crisp, and top them with a mountain of fresh berries and a dollop of whipped cream. It’s a decadent way to start the day.",
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

  console.log("Seed complete");
  console.table([{ users, posts, follows, categories, foods, images }]);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
