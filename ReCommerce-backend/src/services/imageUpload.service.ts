import fs from 'fs';

import { ImageType } from '@prisma/client';
import cloudinaryService from './cloudinary.service';
import itemImageService from './itemImage.service';
import aiInspectionService from './aiInspection.service';
import itemInspectionService from './itemInspection.service';
import itemDefectService from './itemDefect.service';

const uploadAndInspectItem = async (itemId: string, modelId: string, filePath: string) => {
  try {
    const uploadedImage = await cloudinaryService.uploadImage(filePath);

    const itemImage = await itemImageService.createItemImage(
      itemId,
      uploadedImage.imageUrl,
      ImageType.FRONT
    );

    const aiResult = await aiInspectionService.detectDamage(filePath);

    const inspection = await itemInspectionService.createInspection(itemId, modelId, aiResult);

    await itemDefectService.createDefects(inspection.id, aiResult.damages);

    return {
      itemImage,
      inspection,
      totalDamagePercentage: aiResult.totalCrackPercentage,
      damages: aiResult.damages
    };
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export default {
  uploadAndInspectItem
};
