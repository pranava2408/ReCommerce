import prisma from '../client';
import { OrderStatus } from '@prisma/client';

interface QueryFilters {
  buyerId?: number;
  status?: OrderStatus;
}

interface QueryOptions {
  limit?: number;
}

const createOrder = async ({ listingId, buyerId }: { listingId: string; buyerId: number }) => {
  const listing = await prisma.marketplaceListing.findUnique({
    where: {
      id: listingId
    }
  });

  if (!listing) {
    throw new Error('Marketplace listing not found');
  }

  const order = await prisma.order.create({
    data: {
      listingId: listing.id,
      itemId: listing.itemId,
      buyerId,
      finalPrice: listing.listingPrice,
      status: 'CONFIRMED'
    },

    include: {
      listing: true,

      item: {
        include: {
          images: true,
          category: true,
          location: true
        }
      },

      buyer: true
    }
  });

  await prisma.marketplaceListing.update({
    where: {
      id: listing.id
    },
    data: {
      status: 'SOLD'
    }
  });

  await prisma.item.update({
    where: {
      id: listing.itemId
    },
    data: {
      status: 'SOLD'
    }
  });

  return order;
};

const queryOrders = async (filter: QueryFilters, options: QueryOptions) => {
  return prisma.order.findMany({
    where: {
      ...(filter.buyerId && {
        buyerId: filter.buyerId
      }),

      ...(filter.status && {
        status: filter.status
      })
    },

    ...(options.limit && {
      take: options.limit
    }),

    include: {
      listing: true,

      item: {
        include: {
          images: true,
          category: true,
          location: true
        }
      },

      buyer: true
    }
  });
};

const getOrderById = async (orderId: string) => {
  return prisma.order.findUnique({
    where: {
      id: orderId
    },

    include: {
      listing: true,

      item: {
        include: {
          images: true,
          category: true,
          location: true
        }
      },

      buyer: true
    }
  });
};

export default {
  createOrder,
  queryOrders,
  getOrderById
};
