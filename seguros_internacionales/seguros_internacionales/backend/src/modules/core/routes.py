from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.config.database import get_db
from .models import Clinica
from .schemas import ClinicaCreate, ClinicaResponse

router = APIRouter(prefix="/api/seguros", tags=["Seguros Core"])

@router.get("/clinicas", response_model=List[ClinicaResponse])
def obtener_clinicas(db: Session = Depends(get_db)):
    """Obtiene el listado de todas las clínicas aliadas."""
    return db.query(Clinica).all()

@router.post("/clinicas", response_model=ClinicaResponse)
def crear_clinica(clinica: ClinicaCreate, db: Session = Depends(get_db)):
    """Registra una nueva clínica aliada."""
    nueva_clinica = Clinica(**clinica.model_dump())
    db.add(nueva_clinica)
    db.commit()
    db.refresh(nueva_clinica)
    return nueva_clinica
