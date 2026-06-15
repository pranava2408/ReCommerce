from pydantic import BaseModel


class DamagePrediction(BaseModel):
    type: str
    confidence: float
    bbox: list[float]


class DamageResponse(BaseModel):
    isDamaged: bool
    damageCount: int
    damages: list[DamagePrediction]