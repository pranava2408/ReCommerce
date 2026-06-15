import dotenv from 'dotenv';
import path from 'path';
import prisma from '../client';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function automatedMarketplaceLister() {
  console.log('🚀 Processing active inventory listings for admin operator (ID: 2)...');

  // 1. Explicitly verify that our admin profile at ID 2 exists
  const adminUser = await prisma.user.findUnique({
    where: { id: 2 }
  });

  if (!adminUser) {
    console.error('❌ Migration Blocked: Please run "seedAdminUser.ts" first to establish user ID 2.');
    return;
  }

  // 2. Query items that don't have an active marketplace listing record yet
  const items = await prisma.item.findMany({
    include: { listings: true }
  });

  const unlistedItems = items.filter(item => item.listings.length === 0);

  if (unlistedItems.length === 0) {
    console.log('✨ System Status: All inventory records are currently synchronized with the marketplace.');
    return;
  }

  console.log(`📦 Found ${unlistedItems.length} items awaiting marketplace activation.`);

  // 3. Map database items into Marketplace Listing schemas bound to sellerId 2
  const listingsPayload = unlistedItems.map((item) => {
    const retailPrice = parseFloat(item.originalPrice.toString());
    const optimizedListingPrice = parseFloat((retailPrice * 0.80).toFixed(2));

    return {
      itemId: item.id,
      sellerId: 2,                      // Direct link to your target admin ID
      locationId: item.locationId,      // Maintains item's round-robin Indian city location
      title: `Premium Refurbished ${item.name}`,
      description: `Verified authentic asset by ${item.brand || 'Eco-Partner'}. Restored to operational grade parameters. Sourced from native regional distribution centers.`,
      listingPrice: optimizedListingPrice,
      status: 'ACTIVE' as const         // Matches ListingStatus enum mapping
    };
  });

  try {
    // 4. Batch insert all active listings into the database
    console.log(`💾 Injecting ${listingsPayload.length} records into the MarketplaceListing table...`);
    const transactionResult = await prisma.marketplaceListing.createMany({
      data: listingsPayload,
      skipDuplicates: true
    });

    // 5. Update the primary items status field to 'LISTED' 
    const itemIdsToUpdate = unlistedItems.map(item => item.id);
    await prisma.item.updateMany({
      where: { id: { in: itemIdsToUpdate } },
      data: { status: 'LISTED' }
    });

    console.log(`\n🏁 Automation Finished: Successfully generated ${transactionResult.count} active listings under sellerId: 2.`);
  } catch (error: any) {
    console.error('❌ Transaction Engine Abortion:', error.message);
  }
}

automatedMarketplaceLister();