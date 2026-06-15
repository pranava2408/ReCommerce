from ultralytics import YOLO

class DamageDetector:

    def __init__(
        self,
        model_path: str
    ):
        self.model = YOLO(model_path)

    def predict(
        self,
        image_path: str
    ):

        results = self.model.predict(
            source=image_path,
            conf=0.25,
            verbose=False
        )

        damages = []

        for box in results[0].boxes:

            cls_id = int(box.cls[0])

            damages.append({
                "type": self.model.names[cls_id],
                "confidence": round(
                    float(box.conf[0]),
                    4
                ),
                "bbox": box.xyxy[0].tolist()
            })

        return {
            "isDamaged": len(damages) > 0,
            "damageCount": len(damages),
            "damages": damages
        }