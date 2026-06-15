import prisma from '../client';

import {
  DefectType,
  Severity
} from '@prisma/client';

const mapDefectType = (
  type: string
): DefectType => {

  switch (type.toLowerCase()) {

    case 'crack':
      return DefectType.CRACK;

    case 'scratch':
      return DefectType.SCRATCH;

    case 'dent':
      return DefectType.DENT;

    default:
      return DefectType.CRACK;
  }
};

const mapSeverity = (
  damagePercentage: number
): Severity => {

  if (damagePercentage < 5) {
    return Severity.LOW;
  }

  if (damagePercentage < 15) {
    return Severity.MEDIUM;
  }

  if (damagePercentage < 30) {
    return Severity.HIGH;
  }

  return Severity.CRITICAL;
};

const createDefects = async (
  inspectionId: string,
  damages: any[]
) => {

  return prisma.itemDefect.createMany({
    data: damages.map(
      damage => ({
        inspectionId,

        defectType: mapDefectType(
          damage.type
        ),

        confidence: damage.confidence,

        severity: mapSeverity(
          damage.damagePercentage
        )
      })
    )
  });
};

export default {
  createDefects
};