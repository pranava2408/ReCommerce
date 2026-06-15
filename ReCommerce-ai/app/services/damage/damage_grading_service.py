class DamageGradingService:

    def calculate_damage_percentage(
        self,
        bbox: list[float],
        image_width: int,
        image_height: int
    ) -> float:

        x1, y1, x2, y2 = bbox

        damage_width = max(0, x2 - x1)
        damage_height = max(0, y2 - y1)

        damage_area = damage_width * damage_height
        image_area = image_width * image_height

        if image_area == 0:
            return 0

        return round(
            (damage_area / image_area) * 100,
            2
        )

    def calculate_grade(
        self,
        damage_percentage: float
    ) -> str:

        if damage_percentage <= 5:
            return "A"

        if damage_percentage <= 15:
            return "B"

        if damage_percentage <= 30:
            return "C"

        return "D"

    def grade_crack(
        self,
        damage: dict,
        image_width: int,
        image_height: int
    ) -> dict:

        damage_percentage = (
            self.calculate_damage_percentage(
                damage["bbox"],
                image_width,
                image_height
            )
        )

        return {
            **damage,
            "damagePercentage": damage_percentage,
            "grade": self.calculate_grade(
                damage_percentage
            )
        }