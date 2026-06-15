import prisma from '../client';
import {
  ItemGrade,
  RecommendedAction,
  SafetyStatus
} from '@prisma/client';

const createInspection = async (
  itemId: string,
  modelId: string,
  aiResult: any
) => {

  const totalDamage =
    aiResult.totalCrackPercentage ?? 0;

  const conditionScore =
    Math.max(
      0,
      100 - totalDamage
    );

  const avgConfidence =
    aiResult.damages.length > 0
      ? aiResult.damages.reduce(
          (
            sum: number,
            damage: any
          ) =>
            sum + damage.confidence,
          0
        ) /
        aiResult.damages.length
      : 0;

  let grade: ItemGrade =
  ItemGrade.A;

  if (totalDamage > 30) {
    grade = 'D';
  } else if (totalDamage > 15) {
    grade = 'C';
  } else if (totalDamage > 5) {
    grade = 'A';
  }

  let recommendedAction: RecommendedAction = 'RESELL';

  if (totalDamage > 30) {
    recommendedAction = 'RECYCLE';
  } else if (totalDamage > 15) {
    recommendedAction = 'REFURBISH';
  } else if (totalDamage > 5) {
    recommendedAction = 'RESELL';
  }

  let safetyStatus: SafetyStatus = 'SAFE';

  if (totalDamage > 30) {
    safetyStatus = 'UNSAFE';
  } else if (totalDamage > 15) {
    safetyStatus = 'NEEDS_REVIEW';
  }

  return prisma.itemInspection.create({
    data: {
      itemId,

      modelId,

      conditionScore,

      confidenceScore:
        avgConfidence,

      grade,

      recommendedAction,

      safetyStatus,

      notes:
        `Detected ${aiResult.damageCount} defects. Total damage percentage: ${totalDamage}%`
    }
  });
};

export default {
  createInspection
};