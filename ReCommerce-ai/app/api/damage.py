import os

from PIL import Image

from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from app.dependencies import (
    damage_detector,
    damage_grading_service
)

router = APIRouter()


@router.post("/damage-detection")
async def damage_detection(
    file: UploadFile = File(...)
):
    upload_path = (
        f"app/uploads/{file.filename}"
    )

    with open(
        upload_path,
        "wb"
    ) as buffer:
        buffer.write(
            await file.read()
        )

    try:

        with Image.open(upload_path) as image:
            image_width = image.width
            image_height = image.height

        result = damage_detector.predict(
            upload_path
        )

        if (
            result.get("isDamaged")
            and result.get("damages")
        ):

            graded_damages = []

            for damage in result["damages"]:

                if damage.get("type") == "crack":

                    graded_damage = (
                        damage_grading_service.grade_crack(
                            damage=damage,
                            image_width=image_width,
                            image_height=image_height
                        )
                    )

                    graded_damages.append(
                        graded_damage
                    )

                else:

                    graded_damages.append(
                        damage
                    )

            result["damages"] = (
                graded_damages
            )

            # Calculate centralized crack percentage
            crack_percentages = [
                damage["damagePercentage"]
                for damage in graded_damages
                if (
                    damage.get("type") == "crack"
                    and "damagePercentage" in damage
                )
            ]

            total_crack_percentage = sum(
                crack_percentages
            )

            # If percentage exceeds 100,
            # consider only the largest 3 cracks
            if total_crack_percentage > 100:

                crack_percentages.sort(
                    reverse=True
                )

                total_crack_percentage = sum(
                    crack_percentages[:3]
                )

            total_crack_percentage = min(
                100,
                total_crack_percentage
            )

            result[
                "totalCrackPercentage"
            ] = round(
                total_crack_percentage,
                2
            )

            # Overall grading
            if total_crack_percentage <= 5:

                result[
                    "overallGrade"
                ] = "A"

            elif total_crack_percentage <= 15:

                result[
                    "overallGrade"
                ] = "B"

            elif total_crack_percentage <= 30:

                result[
                    "overallGrade"
                ] = "C"

            else:

                result[
                    "overallGrade"
                ] = "D"

        return result

    finally:

        try:

            if os.path.exists(
                upload_path
            ):
                os.remove(
                    upload_path
                )

        except PermissionError:
            pass