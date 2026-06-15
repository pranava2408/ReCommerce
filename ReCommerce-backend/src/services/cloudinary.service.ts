import httpStatus from 'http-status';
import cloudinary from '../config/cloudinary';

import ApiError from '../utils/ApiError';

const uploadImage = async (
  filePath: string,
  folder = 'amazon-hackon/items'
) => {
  try {

    console.log('Uploading file:', filePath);

    const result =
      await cloudinary.uploader.upload(
        filePath,
        {
          folder
        }
      );

    console.log(
      'Cloudinary Upload Success:',
      result.secure_url
    );

    return {
      imageUrl: result.secure_url,
      publicId: result.public_id
    };

  } catch (error: any) {

    console.error(
      'Cloudinary Upload Error:',
      error
    );

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error?.message || 'Cloudinary upload failed'
    );
  }
};

export default {
  uploadImage
};