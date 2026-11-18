from pydantic import BaseModel, Field
from typing import Optional

class ClinicaBase(BaseModel):
    nombre: str = Field(..., max_length=150)
    ciudad: str = Field(..., max_length=100)
    pais: str = Field(..., max_length=100)
    telefono: str = Field(..., max_length=50)

class ClinicaCreate(ClinicaBase):
    pass

class ClinicaResponse(ClinicaBase):
    id: int
    class Config:
        from_attributes = True
