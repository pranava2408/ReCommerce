import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import orderService from "../services/order.service";
import { User } from "@prisma/client";

const createOrder = catchAsync(async (req, res) => {
  const buyerId = (req.user as User).id;

  const { listingId } = req.body;

  if (!listingId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "listingId is required",
    });
  }

  const order = await orderService.createOrder({
    listingId,
    buyerId,
  });

  res.status(httpStatus.CREATED).send(order);
});

const getMyOrders = catchAsync(async (req, res) => {
  const buyerId = (req.user as User).id;

  const orders = await orderService.queryOrders(
    {
      buyerId,
    },
    {}
  );

  res.status(httpStatus.OK).send(orders);
});

const getOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await orderService.getOrderById(orderId);

  if (!order) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "Order not found",
    });
  }

  res.status(httpStatus.OK).send(order);
});

export default {
  createOrder,
  getMyOrders,
  getOrder,
};