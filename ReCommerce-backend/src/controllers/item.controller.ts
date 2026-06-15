import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import itemService from '../services/item.service';
import itemUploadService from '../services/imageUpload.service';
import { User } from '@prisma/client';
import { Request } from 'express';
import { cloudinaryService } from '../services';

const createItem = catchAsync(async (req, res) => {
  const ownerId = (req.user as User).id;
  const itemData = { ...req.body, ownerId };
  const item = await itemService.createItem(itemData);
  res.status(httpStatus.CREATED).send(item);
});

const uploadItemImage = catchAsync(async (req, res) => {
  console.log(req.file);
  const { itemId } = req.params;
  const { modelId } = req.body;

  const file = (
    req as Request & {
      file: Express.Multer.File;
    }
  ).file;
  const result = await itemUploadService.uploadAndInspectItem(itemId, modelId, file.path);
  res.status(httpStatus.CREATED).send(result);
});

const getItems = catchAsync(async (req, res) => {
  const items = await itemService.getAllItemsWithImages();
  res.status(httpStatus.OK).send(items);
});

const testCloudinaryUpload = catchAsync(
  async (req, res) => {

    const file = req.file as any;

    const result =
      await cloudinaryService.uploadImage(
        file.path
      );

    res.send(result);
  }
);

export default {
  createItem,
  uploadItemImage,
  testCloudinaryUpload,
  getItems
};
