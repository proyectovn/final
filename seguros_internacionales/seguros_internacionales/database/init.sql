-- En OpenShift la base ya existe (la crea la plantilla MySQL). Si lo usas en local, descomenta:
-- CREATE DATABASE seguros_internacionales CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE seguros_internacionales;

-- Tabla de Clientes (HU-4: Validacion de identidad por pasaporte)
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_pasaporte VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Activo'
) ENGINE=InnoDB;

-- Tabla de Clinicas Aliadas (HU-1 y HU-3: Orden de atencion y lista de clinicas)
CREATE TABLE clinicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    telefono VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- Tabla de Solicitudes de Atencion Medica (HU-1: Solicitud de orden en el extranjero)
CREATE TABLE solicitudes_atencion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    pais_ubicacion VARCHAR(100) NOT NULL,
    sintomas TEXT NOT NULL,
    hospital_asignado VARCHAR(150),
    telefono_hospital VARCHAR(50),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
) ENGINE=InnoDB;

-- Tabla de Reembolsos (HU-2: Registro de gastos medicos para reembolso)
CREATE TABLE reembolsos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    monto_gastado DECIMAL(10, 2) NOT NULL CHECK (monto_gastado > 0),
    numero_cuenta_bancaria VARCHAR(50) NOT NULL,
    estado_reembolso VARCHAR(50) DEFAULT 'Pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
) ENGINE=InnoDB;

-- Tabla de Alertas de Viaje por Pais (HU-5: Visualizacion de alertas de viaje)
CREATE TABLE alertas_viaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(100) UNIQUE NOT NULL,
    nivel_alerta VARCHAR(50) DEFAULT 'Moderado',
    mensaje_alerta TEXT NOT NULL
) ENGINE=InnoDB;

-- Datos iniciales de prueba basados en las Historias de Usuario
INSERT INTO clientes (numero_pasaporte, nombre_completo, estado) VALUES
('AB123456', 'Carlos Pérez', 'Activo'),
('CD789012', 'Ana Gómez', 'Activo'),
('EF345678', 'Luis Martínez', 'Inactivo');

INSERT INTO clinicas (nombre, ciudad, pais, telefono) VALUES
('Hospital Central de Tokio', 'Tokio', 'Japón', '+81 3-1234-5678'),
('International Clinic Madrid', 'Madrid', 'España', '+34 91-987-6543'),
('Clínica Internacional Bogotá', 'Bogotá', 'Colombia', '+57 601-555-0199'),
('Miami Medical Center', 'Miami', 'Estados Unidos', '+1 305-555-0142');

INSERT INTO alertas_viaje (pais, nivel_alerta, mensaje_alerta) VALUES
('Japón', 'Alta', 'Se recomienda vacunación al día y uso de mascarilla en transporte público. Verificar cobertura sísmica.'),
('España', 'Baja', 'Sin restricciones sanitarias graves. Portar siempre certificado de seguro internacional vigente.');
