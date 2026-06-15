import prisma from '../client';
import { ImageType } from '@prisma/client';

const createItemImage = async (
  itemId: string,
  imageUrl: string,
  imageType: ImageType
) => {
  return prisma.itemImage.create({
    data: {
      itemId,
      imageUrl,
      imageType
    }
  });
};

export default {
  createItemImage
};