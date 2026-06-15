import fs from 'fs';
import path from 'path';
import prisma from '../client';

const JSON_FILE_PATH = path.join(__dirname, '../data/items_seed.json');

interface LocationRecord {
  id: string;
  country: string;
  state: string;
  city: string;
}

async function automatedJsonBulkProcessor() {
  console.log('🚀 Starting state-by-state round-robin bulk processing pipeline...');

  // 1. Verify JSON file existence
  if (!fs.existsSync(JSON_FILE_PATH)) {
    console.error(`❌ Data dataset file missing at: ${JSON_FILE_PATH}`);
    return;
  }

  // 2. Read and parse the JSON entries
  const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
  const itemsToInsert = JSON.parse(rawData);
  console.log(`📦 Loaded ${itemsToInsert.length} data entries from JSON file.`);

  // 3. Fetch ALL Indian locations from the database
  const allLocations = await prisma.location.findMany({
    where: { country: 'India' }
  });

  if (allLocations.length === 0) {
    console.error('❌ Automation pre-requisite failed: Ensure your Location list is seeded first.');
    return;
  }

  // 4. Group cities by their state name dynamically
  const locationsByState: Record<string, LocationRecord[]> = {};
  allLocations.forEach((loc) => {
    if (!locationsByState[loc.state]) {
      locationsByState[loc.state] = [];
    }
    locationsByState[loc.state].push(loc);
  });

  // Get a unique list of state names and create an array of city arrays
  const stateNames = Object.keys(locationsByState);
  const stateTracks = stateNames.map((state) => locationsByState[state]);
  const totalStates = stateTracks.length;

  console.log(`📍 Found ${totalStates} states across India to distribute items into.`);

  // Index trackers for the cross-state round-robin loop
  let statePointer = 0;
  // Keep track of which city index we are on for EACH state individually
  const cityPointersForState: Record<string, number> = {};
  stateNames.forEach((state) => {
    cityPointersForState[state] = 0;
  });

  let successCount = 0;

  // 5. Loop over the parsed dataset records
  for (const itemData of itemsToInsert) {
    // Find a state that still has cities available to prevent dead loops
    let attempts = 0;
    let assignedLocation: LocationRecord | null = null;

    while (attempts < totalStates) {
      const currentStateName = stateNames[statePointer];
      const currentCityArray = locationsByState[currentStateName];
      const currentCityIndex = cityPointersForState[currentStateName];

      // Check if this state still has unvisited cities
      if (currentCityIndex < currentCityArray.length) {
        assignedLocation = currentCityArray[currentCityIndex];
        
        // Move the city index forward for this specific state for its next turn
        cityPointersForState[currentStateName]++;
        
        // Advance the state pointer to the next state for the next item loop
        statePointer = (statePointer + 1) % totalStates;
        break;
      }

      // If a state runs out of cities entirely, move to the next state and try again
      statePointer = (statePointer + 1) % totalStates;
      attempts++;
    }

    // Ultimate fallback if all cities across all states are exhausted
    if (!assignedLocation) {
      console.log('🔄 All available cities in the database have been allocated once. Resetting pointers...');
      stateNames.forEach((state) => {
        cityPointersForState[state] = 0;
      });
      statePointer = 0;
      assignedLocation = locationsByState[stateNames[statePointer]][0];
      cityPointersForState[stateNames[statePointer]]++;
      statePointer = (statePointer + 1) % totalStates;
    }

    console.log(`🔄 Processing SKU: ${itemData.sku} ──> 📍 State Round-Robin: ${assignedLocation.city}, ${assignedLocation.state}`);

    try {
      // 6. Execute transactional insertion
      await prisma.item.create({
        data: {
          sku: itemData.sku,
          name: itemData.name,
          brand: itemData.brand || 'Generic',
          originalPrice: parseFloat(itemData.originalPrice),
          status: itemData.status || 'RECEIVED',
          ownerId: 1, 
          
          categoryId: itemData.categoryId,
          locationId: assignedLocation.id, // Dynamically assigned unique geographic target id

          images: itemData.images && itemData.images.length > 0 ? {
            createMany: {
              data: itemData.images.map((img: any) => ({
                imageUrl: img.imageUrl,
                imageType: img.imageType || 'FRONT'
              }))
            }
          } : undefined
        }
      });

      successCount++;

    } catch (dbError: any) {
      console.error(`❌ Database insert transaction aborted for SKU ${itemData.sku}:`, dbError.message);
    }
  }

  console.log(`\n🏁 Finished! Successfully injected ${successCount}/${itemsToInsert.length} records evenly across states.`);
}

// Execute the automation routine
automatedJsonBulkProcessor();