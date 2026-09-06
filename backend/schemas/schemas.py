"""
GramDisha AI — Pydantic Request/Response Schemas

Validates all API input/output with strict typing.
"""

from pydantic import BaseModel, Field, model_validator
from typing import Literal, Optional


# ─── Request Schemas ─────────────────────────────────────────────

class AnalysisRequest(BaseModel):
    state: str = Field(..., min_length=1, description="State name")
    district: str = Field(..., min_length=1, description="District name")
    block: str = Field(..., min_length=1, description="Block name")
    village: str = Field(..., min_length=1, description="Village name")
    capital: float = Field(..., gt=0, description="Available capital in INR")
    business: Optional[str] = Field(default=None, description="Business category")
    business_category: Optional[str] = Field(default=None, description="Business category alias")
    language: Literal["en", "hi"] = Field(default="en", description="Language code")

    @model_validator(mode="before")
    @classmethod
    def resolve_business_field(cls, data):
        if isinstance(data, dict):
            biz = data.get("business") or data.get("business_category")
            if not biz:
                raise ValueError("Business field is required (either 'business' or 'business_category').")
            data["business"] = biz
        return data


class FinancialRequest(BaseModel):
    capital: float = Field(..., gt=0, description="Available capital in INR")
    business: str = Field(default="", description="Business category (optional)")


class BusinessRequest(BaseModel):
    business: str = Field(..., min_length=1, description="Business category")
    state: str = Field(default="", description="State name")
    district: str = Field(default="", description="District name")
    block: str = Field(default="", description="Block name")
    village: str = Field(default="", description="Village name")
    language: Literal["en", "hi"] = Field(default="en", description="Language code")


class ComparisonRequest(BaseModel):
    state: str = Field(..., min_length=1)
    district: str = Field(..., min_length=1)
    block: str = Field(..., min_length=1)
    village: str = Field(..., min_length=1)
    capital: float = Field(..., gt=0)
    language: Literal["en", "hi"] = Field(default="en")
    businesses: list[str] = Field(
        default=["Dairy", "Retail", "Tailoring", "Food Processing"],
        description="Business categories to compare"
    )


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    analysis_id: Optional[str] = Field(default=None, description="Analysis ID for context")
    language: Literal["en", "hi"] = Field(default="en", description="Language code")
    context: Optional[dict] = Field(default=None, description="Analysis context data")


# ─── Response Schemas ─────────────────────────────────────────────

class ErrorResponse(BaseModel):
    success: bool = False
    error_code: str
    message: str


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    llm_available: bool = False
