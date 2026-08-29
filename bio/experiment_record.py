"""
Bio experiment record model.

This module defines a structured record object for BioDockLab.
"""


from dataclasses import dataclass
from typing import Optional


@dataclass
class BioExperimentRecord:
    id: str
    domain: str
    sample: str
    condition: str
    success_rate: int
    risk_level: str
    note: str
    temperature: Optional[float] = None
    duration_hours: Optional[float] = None

    def to_summary(self) -> dict:
        return {
            "id": self.id,
            "domain": self.domain,
            "sample": self.sample,
            "success_rate": self.success_rate,
            "risk_level": self.risk_level,
        }

    def is_high_value(self) -> bool:
        return self.success_rate >= 80 and self.risk_level == "Low"