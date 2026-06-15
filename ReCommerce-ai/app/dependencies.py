from app.services.damage.damage_detector import DamageDetector
from app.services.damage.damage_grading_service import DamageGradingService

damage_detector = DamageDetector(
    "app/services/damage/damage-detector-model.pt"
)

damage_grading_service = DamageGradingService()