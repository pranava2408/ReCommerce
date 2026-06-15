import { Item, Prisma } from '@prisma/client';
import prisma from '../client';
import { CreateItemInput } from '../types/item.types';


const createItem = async (itemBody: CreateItemInput): Promise<Item> => {
  const { images, ...coreItemData } = itemBody;

  return prisma.item.create({
    data: {
      ...coreItemData,
      images: images && images.length > 0 ? {
        createMany: {
          data: images
        }
      } : undefined
    },
    include: {
      images: true,
      category: true
    }
  });
};

const getAllItemsWithImages = async () => {
  return prisma.item.findMany({
    include: {
      images: true,             // Fetches all matching ItemImage rows using the foreign key relationship
      category: true,           // Optional: include if you want category names
      location: true,           // Optional: include if you want city/state data
      currentInspection: true   // Optional: include if you want to display the grading score
    },
    orderBy: {
      createdAt: 'desc'         // Show most recently added items first
    }
  });
};

export default {
  createItem,
  getAllItemsWithImages
};