import { Prisma } from "@prisma/client";

export interface CreateItemInput {
  sku: string;
  name: string;
  brand?: string;
  categoryId: string;
  originalPrice: number;
  status: any;
  ownerId: number;
  locationId?: string;
  metadata?: Prisma.InputJsonValue;
  images?: Array<{ imageUrl: string; imageType: any }>;
}