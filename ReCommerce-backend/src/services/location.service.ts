import prisma from '../client';
import { LocationInput } from '../types/location.types';
import axios from 'axios';
import { State, City } from 'country-state-city';

const bulkCreateLocations = async (locations: LocationInput[]) => {
  return prisma.location.createMany({
    data: locations,
    skipDuplicates: true
  });
};

const autoSeedIndianLocations = async (): Promise<{ count: number }> => {
  const indianLocations: LocationInput[] = [];

  // 1. Fetch all states in India natively from the local package
  const states = State.getStatesOfCountry('IN');

  for (const state of states) {
    // 2. Fetch all cities belonging to this state
    const cities = City.getCitiesOfState('IN', state.isoCode);

    for (const city of cities) {
      // 3. Ensure coordinates exist and parse safely
      const lat = parseFloat(city.latitude || '0');
      const lng = parseFloat(city.longitude || '0');

      indianLocations.push({
        country: 'India',
        state: state.name,
        city: city.name,
        pincode: '',
        latitude: lat,
        longitude: lng
      });
    }
  }

  if (indianLocations.length === 0) {
    throw new Error('No local location records mapped.');
  }

  // 4. Batch write all records to your database
  return prisma.location.createMany({
    data: indianLocations,
    skipDuplicates: true
  });
};

const getAllLocations = async () => {
  return prisma.location.findMany({
    orderBy: {
      city: 'asc'
    }
  });
};

export default {
  bulkCreateLocations,
  autoSeedIndianLocations,
  getAllLocations
};