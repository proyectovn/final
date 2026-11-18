from sqlalchemy import Column, String, Integer, Text, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from src.config.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    numero_pasaporte = Column(String(50), unique=True, nullable=False)
    nombre_completo = Column(String(150), nullable=False)
    estado = Column(String(50), default="Activo")

class Clinica(Base):
    __tablename__ = "clinicas"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre = Column(String(150), nullable=False)
    ciudad = Column(String(100), nullable=False)
    pais = Column(String(100), nullable=False)
    telefono = Column(String(50), nullable=False)

class SolicitudAtencion(Base):
    __tablename__ = "solicitudes_atencion"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True)
    pais_ubicacion = Column(String(100), nullable=False)
    sintomas = Column(Text, nullable=False)
    hospital_asignado = Column(String(150))
    telefono_hospital = Column(String(50))
    fecha_solicitud = Column(TIMESTAMP, server_default=func.now())

class Reembolso(Base):
    __tablename__ = "reembolsos"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True)
    monto_gastado = Column(Numeric(10, 2), nullable=False)
    numero_cuenta_bancaria = Column(String(50), nullable=False)
    estado_reembolso = Column(String(50), default="Pendiente")
    fecha_registro = Column(TIMESTAMP, server_default=func.now())

class AlertaViaje(Base):
    __tablename__ = "alertas_viaje"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    pais = Column(String(100), unique=True, nullable=False)
    nivel_alerta = Column(String(50), default="Moderado")
    mensaje_alerta = Column(Text, nullable=False)
