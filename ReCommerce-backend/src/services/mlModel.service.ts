import prisma from '../client';

const createMlModel = async (
  name: string,
  version: string,
  description?: string
) => {
  return prisma.mlModel.create({
    data: {
      name,
      version,
      description,
    },
  });
};

const getMlModels = async () => {
  return prisma.mlModel.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getMlModelById = async (id: string) => {
  return prisma.mlModel.findUnique({
    where: {
      id,
    },
  });
};

export default {
  createMlModel,
  getMlModels,
  getMlModelById,
};