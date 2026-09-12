from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, example="Apex Global Tech")
    description: Optional[str] = Field(None, example="Leading enterprise AI software solution provider")
    website: Optional[str] = Field(None, max_length=255, example="https://apexglobal.tech")
    location: Optional[str] = Field(None, max_length=150, example="Austin, TX")
    industry: Optional[str] = Field(None, max_length=100, example="Information Technology")
    company_size: Optional[str] = Field(None, max_length=50, example="50-200 employees")

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = None
    website: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=150)
    industry: Optional[str] = Field(None, max_length=100)
    company_size: Optional[str] = Field(None, max_length=50)

class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
