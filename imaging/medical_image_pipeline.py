"""
BioDockLab medical imaging scaffold.

Planned stack:
- OpenCV
- DICOM / pydicom
- SimpleITK
- MONAI
"""

try:
    import cv2
except ImportError:
    cv2 = None

try:
    import pydicom
except ImportError:
    pydicom = None


def describe_image_pipeline():
    return {
        "input": "DICOM or medical image",
        "steps": [
            "load image",
            "normalize intensity",
            "extract region of interest",
            "estimate risk",
            "generate decision-support report"
        ],
        "opencv_available": cv2 is not None,
        "dicom_available": pydicom is not None
    }