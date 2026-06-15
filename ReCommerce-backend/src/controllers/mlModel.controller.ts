import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import mlModelService from '../services/mlModel.service';

const createMlModel = catchAsync(async (req, res) => {
  const { name, version, description } = req.body;

  const mlModel = await mlModelService.createMlModel(
    name,
    version,
    description
  );

  res.status(httpStatus.CREATED).send(mlModel);
});

const getMlModels = catchAsync(async (req, res) => {
  const mlModels = await mlModelService.getMlModels();

  res.send(mlModels);
});

const getMlModel = catchAsync(async (req, res) => {
  const mlModel = await mlModelService.getMlModelById(
    req.params.mlModelId
  );

  res.send(mlModel);
});

export default {
  createMlModel,
  getMlModels,
  getMlModel,
};