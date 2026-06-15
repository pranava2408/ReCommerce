import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const detectDamage = async (
  filePath: string
) => {
  const formData = new FormData();

  formData.append(
    'file',
    fs.createReadStream(filePath)
  );

  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/ai/damage-detection`,
    formData,
    {
      headers: formData.getHeaders()
    }
  );

  return response.data;
};

export default {
  detectDamage
};