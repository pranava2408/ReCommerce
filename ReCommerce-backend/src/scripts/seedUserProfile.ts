import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedSilcharUserProfile() {
  try {
    const updatedProfile = await prisma.userProfile.upsert({
      where: {
        userId: 2, // Unique target identification link
      },
      update: {
        latitude: 24.8333,   // Silchar latitude coordinates
        longitude: 92.7789,  // Silchar longitude coordinates
        greenCredits: 100,
      },
      create: {
        userId: 2,
        latitude: 24.8333,
        longitude: 92.7789,
        greenCredits: 100,
      },
    });

    console.log("✅ UserProfile for user 2 updated successfully with Silchar location context:", updatedProfile);
  } catch (error) {
    console.error("❌ Prisma UserProfile modification crashed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSilcharUserProfile();