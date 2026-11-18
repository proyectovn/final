import os
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.middlewares.error_handler import global_exception_handler
from src.modules.core.routes import router as seguros_router

app = FastAPI(
    title="Sistema Internacional de Seguros API",
    description="Backend del Sistema Internacional de Seguros con FastAPI y MySQL",
    version="1.0.0",
)

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, global_exception_handler)
app.include_router(seguros_router)


# ---------- Health check ----------
@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Sistema Internacional de Seguros operativo y conectado.",
    }


# ---------- HU-1: Solicitud de orden de atención médica en el extranjero ----------
class SolicitudAtencionCreate(BaseModel):
    pais_ubicacion: str
    sintomas: str
    numero_pasaporte: Optional[str] = None


@app.get("/api/seguros/solicitudes")
def listar_solicitudes(db: Session = Depends(get_db)):
    filas = db.execute(
        text(
            """SELECT id, cliente_id, pais_ubicacion, sintomas, hospital_asignado, telefono_hospital, fecha_solicitud
               FROM solicitudes_atencion ORDER BY id DESC"""
        )
    ).fetchall()
    return [
        {
            "id": r[0],
            "cliente_id": r[1],
            "pais_ubicacion": r[2],
            "sintomas": r[3],
            "hospital_asignado": r[4],
            "telefono_hospital": r[5],
            "fecha_solicitud": str(r[6]),
        }
        for r in filas
    ]


@app.post("/api/seguros/solicitudes")
def crear_solicitud(solicitud: SolicitudAtencionCreate, db: Session = Depends(get_db)):
    pais = solicitud.pais_ubicacion.strip()
    if not pais:
        raise HTTPException(status_code=400, detail="Error: Debe ingresar un país")

    try:
        # Buscar clínica aliada en el país ingresado
        clinica = db.execute(
            text("SELECT nombre, telefono FROM clinicas WHERE LOWER(pais) = LOWER(:p) LIMIT 1"),
            {"p": pais},
        ).fetchone()

        if clinica:
            hospital = clinica[0]
            telefono = clinica[1]
        else:
            hospital = f"Centro Médico Internacional Aliado ({pais})"
            telefono = "+00 800-SEGUROS-24H"

        cliente_id = None
        if solicitud.numero_pasaporte:
            cli = db.execute(
                text("SELECT id FROM clientes WHERE LOWER(numero_pasaporte) = LOWER(:np)"),
                {"np": solicitud.numero_pasaporte.strip()},
            ).fetchone()
            if cli:
                cliente_id = cli[0]

        db.execute(
            text(
                """INSERT INTO solicitudes_atencion (cliente_id, pais_ubicacion, sintomas, hospital_asignado, telefono_hospital)
                   VALUES (:cid, :p, :s, :h, :t)"""
            ),
            {
                "cid": cliente_id,
                "p": pais,
                "s": solicitud.sintomas,
                "h": hospital,
                "t": telefono,
            },
        )
        db.commit()
        return {
            "message": "Orden de atención médica generada",
            "hospital_asignado": hospital,
            "telefono_hospital": telefono,
            "pais": pais,
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ---------- HU-2: Registro de gastos médicos para reembolso ----------
class ReembolsoCreate(BaseModel):
    monto_gastado: float
    numero_cuenta_bancaria: str
    numero_pasaporte: Optional[str] = None


@app.get("/api/seguros/reembolsos")
def listar_reembolsos(db: Session = Depends(get_db)):
    filas = db.execute(
        text(
            """SELECT id, cliente_id, monto_gastado, numero_cuenta_bancaria, estado_reembolso, fecha_registro
               FROM reembolsos ORDER BY id DESC"""
        )
    ).fetchall()
    return [
        {
            "id": r[0],
            "cliente_id": r[1],
            "monto_gastado": float(r[2]),
            "numero_cuenta_bancaria": r[3],
            "estado_reembolso": r[4],
            "fecha_registro": str(r[5]),
        }
        for r in filas
    ]


@app.post("/api/seguros/reembolsos")
def crear_reembolso(reembolso: ReembolsoCreate, db: Session = Depends(get_db)):
    if reembolso.monto_gastado <= 0:
        raise HTTPException(status_code=400, detail="Monto no válido")

    try:
        cliente_id = None
        if reembolso.numero_pasaporte:
            cli = db.execute(
                text("SELECT id FROM clientes WHERE LOWER(numero_pasaporte) = LOWER(:np)"),
                {"np": reembolso.numero_pasaporte.strip()},
            ).fetchone()
            if cli:
                cliente_id = cli[0]

        db.execute(
            text(
                """INSERT INTO reembolsos (cliente_id, monto_gastado, numero_cuenta_bancaria, estado_reembolso)
                   VALUES (:cid, :m, :nc, 'Pendiente')"""
            ),
            {
                "cid": cliente_id,
                "m": reembolso.monto_gastado,
                "nc": reembolso.numero_cuenta_bancaria.strip(),
            },
        )
        db.commit()
        return {"message": "Solicitud de reembolso guardada con éxito"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ---------- HU-4: Validación de identidad por pasaporte ----------
class ClienteCreate(BaseModel):
    numero_pasaporte: str
    nombre_completo: str
    estado: Optional[str] = "Activo"


@app.get("/api/seguros/clientes")
def listar_clientes(db: Session = Depends(get_db)):
    filas = db.execute(
        text("SELECT id, numero_pasaporte, nombre_completo, estado FROM clientes ORDER BY id DESC")
    ).fetchall()
    return [
        {
            "id": r[0],
            "numero_pasaporte": r[1],
            "nombre_completo": r[2],
            "estado": r[3],
        }
        for r in filas
    ]


@app.get("/api/seguros/clientes/validar/{numero_pasaporte}")
def validar_pasaporte(numero_pasaporte: str, db: Session = Depends(get_db)):
    fila = db.execute(
        text("SELECT id, numero_pasaporte, nombre_completo, estado FROM clientes WHERE LOWER(numero_pasaporte) = LOWER(:np)"),
        {"np": numero_pasaporte.strip()},
    ).fetchone()
    if fila:
        return {
            "encontrado": True,
            "mensaje": "Cliente Activo" if fila[3] == "Activo" else f"Cliente {fila[3]}",
            "cliente": {
                "id": fila[0],
                "numero_pasaporte": fila[1],
                "nombre_completo": fila[2],
                "estado": fila[3],
            },
        }
    return {
        "encontrado": False,
        "mensaje": "Cliente No Encontrado",
    }


@app.post("/api/seguros/clientes")
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    try:
        db.execute(
            text("INSERT INTO clientes (numero_pasaporte, nombre_completo, estado) VALUES (:np, :nc, :e)"),
            {
                "np": cliente.numero_pasaporte.strip().upper(),
                "nc": cliente.nombre_completo.strip(),
                "e": cliente.estado or "Activo",
            },
        )
        db.commit()
        return {"message": "Cliente asegurado registrado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ---------- HU-5: Visualización de alertas de viaje por país ----------
class AlertaViajeCreate(BaseModel):
    pais: str
    nivel_alerta: Optional[str] = "Moderado"
    mensaje_alerta: str


@app.get("/api/seguros/alertas")
def listar_alertas(db: Session = Depends(get_db)):
    filas = db.execute(
        text("SELECT id, pais, nivel_alerta, mensaje_alerta FROM alertas_viaje ORDER BY id DESC")
    ).fetchall()
    return [
        {"id": r[0], "pais": r[1], "nivel_alerta": r[2], "mensaje_alerta": r[3]}
        for r in filas
    ]


@app.get("/api/seguros/alertas/consultar/{pais}")
def consultar_alerta_pais(pais: str, db: Session = Depends(get_db)):
    fila = db.execute(
        text("SELECT id, pais, nivel_alerta, mensaje_alerta FROM alertas_viaje WHERE LOWER(pais) = LOWER(:p)"),
        {"p": pais.strip()},
    ).fetchone()
    if fila:
        return {
            "tiene_alerta": True,
            "pais": fila[1],
            "nivel_alerta": fila[2],
            "mensaje": fila[3],
        }
    return {
        "tiene_alerta": False,
        "pais": pais.strip(),
        "mensaje": "Sin alertas registradas",
    }


@app.post("/api/seguros/alertas")
def crear_alerta(alerta: AlertaViajeCreate, db: Session = Depends(get_db)):
    try:
        db.execute(
            text("INSERT INTO alertas_viaje (pais, nivel_alerta, mensaje_alerta) VALUES (:p, :na, :ma)"),
            {
                "p": alerta.pais.strip(),
                "na": alerta.nivel_alerta or "Moderado",
                "ma": alerta.mensaje_alerta.strip(),
            },
        )
        db.commit()
        return {"message": "Alerta de viaje registrada exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
