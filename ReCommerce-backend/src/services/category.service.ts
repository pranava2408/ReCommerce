import prisma from '../client';
import { Category } from '@prisma/client';

interface CreateCategoryInput {
  name: string;
  parentId?: string | null;
}

const createCategory = async (categoryBody: CreateCategoryInput): Promise<Category> => {
  return prisma.category.create({
    data: {
      name: categoryBody.name,
      parentId: categoryBody.parentId || null
    },
    include: {
      parent: true
    }
  });
};

const bulkCreateParentCategories = async (categories: { name: string }[]) => {
  return prisma.category.createMany({
    data: categories.map(cat => ({
      name: cat.name,
      parentId: null
    })),
    skipDuplicates: true
  });
};

const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany({
    include: {
      children: true
    }
  });
};

export default {
  createCategory,
  bulkCreateParentCategories,
  getAllCategories
};