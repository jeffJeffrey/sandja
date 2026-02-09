// prisma/seed.ts
// Données de démonstration pour SANDJA

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // REGIONS
  // ============================================
  console.log("📍 Creating regions...");
  
  const regions = await Promise.all([
    prisma.region.upsert({
      where: { slug: "cameroon-west" },
      update: {},
      create: {
        slug: "cameroon-west",
        nameKey: "regions.cameroon-west.name",
        descriptionKey: "regions.cameroon-west.description",
        country: "Cameroun",
        area: "Ouest",
        coordinates: { lat: 5.4527, lng: 10.4223 },
        imageUrl: "/images/regions/cameroon-west.svg",
        isPublished: true,
      },
    }),
    prisma.region.upsert({
      where: { slug: "cameroon-northwest" },
      update: {},
      create: {
        slug: "cameroon-northwest",
        nameKey: "regions.cameroon-northwest.name",
        descriptionKey: "regions.cameroon-northwest.description",
        country: "Cameroun",
        area: "Nord-Ouest",
        coordinates: { lat: 6.0333, lng: 10.15 },
        imageUrl: "/images/regions/cameroon-northwest.svg",
        isPublished: true,
      },
    }),
    prisma.region.upsert({
      where: { slug: "ghana-ashanti" },
      update: {},
      create: {
        slug: "ghana-ashanti",
        nameKey: "regions.ghana-ashanti.name",
        descriptionKey: "regions.ghana-ashanti.description",
        country: "Ghana",
        area: "Ashanti",
        coordinates: { lat: 6.6885, lng: -1.6244 },
        imageUrl: "/images/regions/ghana-ashanti.svg",
        isPublished: true,
      },
    }),
    prisma.region.upsert({
      where: { slug: "mali-dogon" },
      update: {},
      create: {
        slug: "mali-dogon",
        nameKey: "regions.mali-dogon.name",
        descriptionKey: "regions.mali-dogon.description",
        country: "Mali",
        area: "Pays Dogon",
        coordinates: { lat: 14.35, lng: -3.5667 },
        imageUrl: "/images/regions/mali-dogon.svg",
        isPublished: true,
      },
    }),
  ]);

  const [cameroonWest, cameroonNorthwest, ghanaAshanti, maliDogon] = regions;

  // ============================================
  // SYMBOLS
  // ============================================
  console.log("✨ Creating symbols...");

  const symbols = await Promise.all([
    // Symboles Bamiléké (Cameroun Ouest)
    prisma.symbol.upsert({
      where: { slug: "ndop-spider" },
      update: {},
      create: {
        slug: "ndop-spider",
        nameKey: "symbols.ndop-spider.name",
        descriptionKey: "symbols.ndop-spider.description",
        meaningKey: "symbols.ndop-spider.meaning",
        historyKey: "symbols.ndop-spider.history",
        images: ["/images/symbols/ndop-spider-1.svg", "/images/symbols/ndop-spider-2.svg"],
        category: "ANIMAL",
        themes: ["WISDOM", "ROYALTY", "POWER"],
        regionId: cameroonWest.id,
        isPublished: true,
        isFeatured: true,
      },
    }),
    prisma.symbol.upsert({
      where: { slug: "ndop-double-gong" },
      update: {},
      create: {
        slug: "ndop-double-gong",
        nameKey: "symbols.ndop-double-gong.name",
        descriptionKey: "symbols.ndop-double-gong.description",
        meaningKey: "symbols.ndop-double-gong.meaning",
        images: ["/images/symbols/ndop-double-gong.svg"],
        category: "OBJECT",
        themes: ["ROYALTY", "POWER", "FESTIVAL"],
        regionId: cameroonWest.id,
        isPublished: true,
      },
    }),
    prisma.symbol.upsert({
      where: { slug: "ndop-lizard" },
      update: {},
      create: {
        slug: "ndop-lizard",
        nameKey: "symbols.ndop-lizard.name",
        descriptionKey: "symbols.ndop-lizard.description",
        meaningKey: "symbols.ndop-lizard.meaning",
        images: ["/images/symbols/ndop-lizard.svg"],
        category: "ANIMAL",
        themes: ["WISDOM", "PROTECTION", "FERTILITY"],
        regionId: cameroonWest.id,
        isPublished: true,
      },
    }),
    prisma.symbol.upsert({
      where: { slug: "ndop-zigzag" },
      update: {},
      create: {
        slug: "ndop-zigzag",
        nameKey: "symbols.ndop-zigzag.name",
        descriptionKey: "symbols.ndop-zigzag.description",
        meaningKey: "symbols.ndop-zigzag.meaning",
        images: ["/images/symbols/ndop-zigzag.svg"],
        category: "GEOMETRIC",
        themes: ["UNITY", "FRIENDSHIP", "PROSPERITY"],
        regionId: cameroonWest.id,
        isPublished: true,
      },
    }),
    
    // Symboles Ashanti (Ghana)
    prisma.symbol.upsert({
      where: { slug: "adinkra-sankofa" },
      update: {},
      create: {
        slug: "adinkra-sankofa",
        nameKey: "symbols.adinkra-sankofa.name",
        descriptionKey: "symbols.adinkra-sankofa.description",
        meaningKey: "symbols.adinkra-sankofa.meaning",
        historyKey: "symbols.adinkra-sankofa.history",
        images: ["/images/symbols/adinkra-sankofa.svg"],
        category: "ANIMAL",
        themes: ["WISDOM", "PROTECTION"],
        regionId: ghanaAshanti.id,
        isPublished: true,
        isFeatured: true,
      },
    }),
    prisma.symbol.upsert({
      where: { slug: "adinkra-gye-nyame" },
      update: {},
      create: {
        slug: "adinkra-gye-nyame",
        nameKey: "symbols.adinkra-gye-nyame.name",
        descriptionKey: "symbols.adinkra-gye-nyame.description",
        meaningKey: "symbols.adinkra-gye-nyame.meaning",
        images: ["/images/symbols/adinkra-gye-nyame.svg"],
        category: "ABSTRACT",
        themes: ["POWER", "PROTECTION"],
        regionId: ghanaAshanti.id,
        isPublished: true,
      },
    }),
    
    // Symboles Mali
    prisma.symbol.upsert({
      where: { slug: "bogolan-crocodile" },
      update: {},
      create: {
        slug: "bogolan-crocodile",
        nameKey: "symbols.bogolan-crocodile.name",
        descriptionKey: "symbols.bogolan-crocodile.description",
        meaningKey: "symbols.bogolan-crocodile.meaning",
        images: ["/images/symbols/bogolan-crocodile.svg"],
        category: "ANIMAL",
        themes: ["POWER", "PROTECTION", "INITIATION"],
        regionId: maliDogon.id,
        isPublished: true,
      },
    }),
  ]);

  // ============================================
  // PAGNES
  // ============================================
  console.log("👘 Creating pagnes...");

  const pagnes = await Promise.all([
    prisma.pagne.upsert({
      where: { slug: "ndop-royal-bleu" },
      update: {},
      create: {
        slug: "ndop-royal-bleu",
        nameKey: "pagnes.ndop-royal-bleu.name",
        descriptionKey: "pagnes.ndop-royal-bleu.description",
        storyKey: "pagnes.ndop-royal-bleu.story",
        images: ["/images/pagnes/ndop-royal-bleu-1.svg", "/images/pagnes/ndop-royal-bleu-2.svg"],
        ceremonies: ["ROYALTY", "FUNERAL", "FESTIVAL"],
        regionId: cameroonWest.id,
        isPublished: true,
        isFeatured: true,
      },
    }),
    prisma.pagne.upsert({
      where: { slug: "ndop-mariage-traditionnel" },
      update: {},
      create: {
        slug: "ndop-mariage-traditionnel",
        nameKey: "pagnes.ndop-mariage-traditionnel.name",
        descriptionKey: "pagnes.ndop-mariage-traditionnel.description",
        images: ["/images/pagnes/ndop-mariage.svg"],
        ceremonies: ["MARRIAGE", "FESTIVAL"],
        regionId: cameroonWest.id,
        isPublished: true,
      },
    }),
    prisma.pagne.upsert({
      where: { slug: "kente-adweneasa" },
      update: {},
      create: {
        slug: "kente-adweneasa",
        nameKey: "pagnes.kente-adweneasa.name",
        descriptionKey: "pagnes.kente-adweneasa.description",
        storyKey: "pagnes.kente-adweneasa.story",
        images: ["/images/pagnes/kente-adweneasa.svg"],
        ceremonies: ["ROYALTY", "MARRIAGE", "FESTIVAL"],
        regionId: ghanaAshanti.id,
        isPublished: true,
        isFeatured: true,
      },
    }),
    prisma.pagne.upsert({
      where: { slug: "bogolan-chasseur" },
      update: {},
      create: {
        slug: "bogolan-chasseur",
        nameKey: "pagnes.bogolan-chasseur.name",
        descriptionKey: "pagnes.bogolan-chasseur.description",
        images: ["/images/pagnes/bogolan-chasseur.svg"],
        ceremonies: ["INITIATION", "FESTIVAL"],
        regionId: maliDogon.id,
        isPublished: true,
      },
    }),
  ]);

  // ============================================
  // PRODUCTS
  // ============================================
  console.log("🛒 Creating products...");

  await Promise.all([
    prisma.product.upsert({
      where: { slug: "ndop-royal-bleu-physique" },
      update: {},
      create: {
        slug: "ndop-royal-bleu-physique",
        nameKey: "products.ndop-royal-bleu-physique.name",
        descriptionKey: "products.ndop-royal-bleu-physique.description",
        price: 150,
        currency: "ADA",
        type: "PHYSICAL_PAGNE",
        images: ["/images/pagnes/ndop-royal-bleu-1.svg"],
        pagneId: pagnes[0].id,
        stock: 10,
        isAvailable: true,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "ndop-royal-bleu-nft" },
      update: {},
      create: {
        slug: "ndop-royal-bleu-nft",
        nameKey: "products.ndop-royal-bleu-nft.name",
        descriptionKey: "products.ndop-royal-bleu-nft.description",
        price: 50,
        currency: "ADA",
        type: "NFT",
        images: ["/images/pagnes/ndop-royal-bleu-1.svg"],
        pagneId: pagnes[0].id,
        isAvailable: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "kente-adweneasa-physique" },
      update: {},
      create: {
        slug: "kente-adweneasa-physique",
        nameKey: "products.kente-adweneasa-physique.name",
        descriptionKey: "products.kente-adweneasa-physique.description",
        price: 200,
        currency: "ADA",
        type: "PHYSICAL_PAGNE",
        images: ["/images/pagnes/kente-adweneasa.svg"],
        pagneId: pagnes[2].id,
        stock: 5,
        isAvailable: true,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "bogolan-design-digital" },
      update: {},
      create: {
        slug: "bogolan-design-digital",
        nameKey: "products.bogolan-design-digital.name",
        descriptionKey: "products.bogolan-design-digital.description",
        price: 25,
        currency: "ADA",
        type: "DIGITAL_DESIGN",
        images: ["/images/pagnes/bogolan-chasseur.svg"],
        pagneId: pagnes[3].id,
        isAvailable: true,
      },
    }),
  ]);

  // ============================================
  // QUIZ
  // ============================================
  console.log("🎮 Creating quizzes...");

  const quiz = await prisma.quiz.upsert({
    where: { slug: "introduction-ndop" },
    update: {},
    create: {
      slug: "introduction-ndop",
      nameKey: "quizzes.introduction-ndop.name",
      descriptionKey: "quizzes.introduction-ndop.description",
      difficulty: "BEGINNER",
      xpReward: 50,
      coinReward: 5,
      isPublished: true,
    },
  });

  await Promise.all([
    prisma.quizQuestion.create({
      data: {
        questionKey: "quizzes.introduction-ndop.q1.question",
        options: [
          "quizzes.introduction-ndop.q1.option1",
          "quizzes.introduction-ndop.q1.option2",
          "quizzes.introduction-ndop.q1.option3",
          "quizzes.introduction-ndop.q1.option4",
        ],
        correctAnswer: 0,
        explanationKey: "quizzes.introduction-ndop.q1.explanation",
        quizId: quiz.id,
      },
    }),
    prisma.quizQuestion.create({
      data: {
        questionKey: "quizzes.introduction-ndop.q2.question",
        options: [
          "quizzes.introduction-ndop.q2.option1",
          "quizzes.introduction-ndop.q2.option2",
          "quizzes.introduction-ndop.q2.option3",
          "quizzes.introduction-ndop.q2.option4",
        ],
        correctAnswer: 2,
        explanationKey: "quizzes.introduction-ndop.q2.explanation",
        quizId: quiz.id,
      },
    }),
    prisma.quizQuestion.create({
      data: {
        questionKey: "quizzes.introduction-ndop.q3.question",
        options: [
          "quizzes.introduction-ndop.q3.option1",
          "quizzes.introduction-ndop.q3.option2",
          "quizzes.introduction-ndop.q3.option3",
          "quizzes.introduction-ndop.q3.option4",
        ],
        correctAnswer: 1,
        explanationKey: "quizzes.introduction-ndop.q3.explanation",
        quizId: quiz.id,
      },
    }),
  ]);

  // ============================================
  // ACHIEVEMENTS
  // ============================================
  console.log("🏆 Creating achievements...");

  await Promise.all([
    prisma.achievement.create({
      data: {
        nameKey: "achievements.first_quiz.name",
        descriptionKey: "achievements.first_quiz.description",
        iconUrl: "/images/badges/first-quiz.png",
        type: "QUIZ_COMPLETED",
        requirement: 1,
        xpReward: 25,
        coinReward: 5,
        rarity: "COMMON",
      },
    }),
    prisma.achievement.create({
      data: {
        nameKey: "achievements.symbol_explorer.name",
        descriptionKey: "achievements.symbol_explorer.description",
        iconUrl: "/images/badges/symbol-explorer.png",
        type: "SYMBOLS_LEARNED",
        requirement: 10,
        xpReward: 50,
        coinReward: 10,
        rarity: "COMMON",
      },
    }),
    prisma.achievement.create({
      data: {
        nameKey: "achievements.first_scan.name",
        descriptionKey: "achievements.first_scan.description",
        iconUrl: "/images/badges/first-scan.png",
        type: "PAGNES_SCANNED",
        requirement: 1,
        xpReward: 30,
        coinReward: 5,
        rarity: "COMMON",
      },
    }),
    prisma.achievement.create({
      data: {
        nameKey: "achievements.week_streak.name",
        descriptionKey: "achievements.week_streak.description",
        iconUrl: "/images/badges/week-streak.png",
        type: "STREAK_DAYS",
        requirement: 7,
        xpReward: 100,
        coinReward: 20,
        rarity: "RARE",
      },
    }),
  ]);

  // ============================================
  // EVENTS
  // ============================================
  console.log("📅 Creating events...");

  await Promise.all([
    prisma.event.create({
      data: {
        slug: "festival-ndop-2025",
        nameKey: "events.festival-ndop-2025.name",
        descriptionKey: "events.festival-ndop-2025.description",
        imageUrl: "/images/events/festival-ndop.svg",
        location: "Dschang, Cameroun",
        coordinates: { lat: 5.4527, lng: 10.0537 },
        startDate: new Date("2025-03-15"),
        endDate: new Date("2025-03-17"),
        ticketPrice: 10,
        maxTickets: 500,
        isPublished: true,
        isFeatured: true,
      },
    }),
    prisma.event.create({
      data: {
        slug: "atelier-kente-online",
        nameKey: "events.atelier-kente-online.name",
        descriptionKey: "events.atelier-kente-online.description",
        imageUrl: "/images/events/atelier-kente.svg",
        location: "En ligne",
        startDate: new Date("2025-02-20"),
        ticketPrice: 5,
        maxTickets: 100,
        isPublished: true,
      },
    }),
  ]);

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
