-- =====================================================================
-- Rent Car Fios (AutoRent): Sistema Empresarial de Alquiler de Vehículos
-- Script SQL Completo con 15 Entidades Relacionales para MySQL
-- =====================================================================

CREATE DATABASE IF NOT EXISTS autorent_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE autorent_db;

-- 1. Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  telefono VARCHAR(30) NOT NULL,
  identificacion VARCHAR(40) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. Tabla de Vehículos
CREATE TABLE IF NOT EXISTS vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(80) NOT NULL,
  anio INT NOT NULL,
  placa VARCHAR(20) NOT NULL UNIQUE,
  precio_dia DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(40) NOT NULL DEFAULT 'Disponible'
) ENGINE=InnoDB;

-- 3. Tabla de Empleados
CREATE TABLE IF NOT EXISTS empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  telefono VARCHAR(30) NOT NULL,
  cargo VARCHAR(80) NOT NULL
) ENGINE=InnoDB;

-- 4. Tabla de Alquileres
CREATE TABLE IF NOT EXISTS alquileres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  empleado_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(40) NOT NULL DEFAULT 'Activo',
  CONSTRAINT fk_alquiler_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_alquiler_vehiculo
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_alquiler_empleado
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Tabla de Sucursales
CREATE TABLE IF NOT EXISTS sucursales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  provincia VARCHAR(60) NOT NULL,
  direccion VARCHAR(180) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  horario VARCHAR(100) NOT NULL DEFAULT 'Lunes a Sábado 7:00 a.m. - 7:00 p.m.'
) ENGINE=InnoDB;

-- 6. Tabla de Categorías de Vehículo
CREATE TABLE IF NOT EXISTS categorias_vehiculo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  descripcion VARCHAR(200) NOT NULL,
  tarifa_base_colones DECIMAL(10, 2) NOT NULL,
  deposito_garantia DECIMAL(10, 2) NOT NULL
) ENGINE=InnoDB;

-- 7. Tabla de Seguros y Coberturas
CREATE TABLE IF NOT EXISTS seguros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cobertura VARCHAR(100) NOT NULL,
  tipo VARCHAR(60) NOT NULL,
  costo_diario_colones DECIMAL(10, 2) NOT NULL,
  deducible_colones DECIMAL(10, 2) NOT NULL DEFAULT 0,
  descripcion VARCHAR(200) NOT NULL
) ENGINE=InnoDB;

-- 8. Tabla de Pagos
CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alquiler_id INT NOT NULL,
  monto_colones DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL DEFAULT 'SINPE Móvil',
  referencia VARCHAR(80) NOT NULL,
  fecha_pago DATE NOT NULL,
  estado VARCHAR(40) NOT NULL DEFAULT 'Aplicado',
  CONSTRAINT fk_pago_alquiler
    FOREIGN KEY (alquiler_id) REFERENCES alquileres(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 9. Tabla de Facturas Electrónicas
CREATE TABLE IF NOT EXISTS facturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_factura VARCHAR(50) NOT NULL UNIQUE,
  alquiler_id INT NOT NULL,
  cliente_id INT NOT NULL,
  subtotal_colones DECIMAL(10, 2) NOT NULL,
  iva_colones DECIMAL(10, 2) NOT NULL,
  total_colones DECIMAL(10, 2) NOT NULL,
  fecha_emision DATE NOT NULL,
  CONSTRAINT fk_factura_alquiler
    FOREIGN KEY (alquiler_id) REFERENCES alquileres(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_factura_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 10. Tabla de Mantenimientos de Flota
CREATE TABLE IF NOT EXISTS mantenimientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehiculo_id INT NOT NULL,
  tipo_servicio VARCHAR(120) NOT NULL,
  taller_proveedor VARCHAR(120) NOT NULL,
  costo_colones DECIMAL(10, 2) NOT NULL,
  fecha_ingreso DATE NOT NULL,
  fecha_salida DATE NULL,
  estado VARCHAR(40) NOT NULL DEFAULT 'En Proceso',
  CONSTRAINT fk_mantenimiento_vehiculo
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 11. Tabla de Inspecciones de Vehículo (Check-in / Check-out)
CREATE TABLE IF NOT EXISTS inspecciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alquiler_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  empleado_id INT NOT NULL,
  tipo_inspeccion VARCHAR(50) NOT NULL DEFAULT 'Entrega',
  kilometraje INT NOT NULL,
  nivel_combustible VARCHAR(40) NOT NULL DEFAULT 'Lleno (100%)',
  observaciones VARCHAR(220) NOT NULL,
  CONSTRAINT fk_inspeccion_alquiler
    FOREIGN KEY (alquiler_id) REFERENCES alquileres(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_inspeccion_vehiculo
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_inspeccion_empleado
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 12. Tabla de Multas e Infracciones
CREATE TABLE IF NOT EXISTS multas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alquiler_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  concepto VARCHAR(150) NOT NULL,
  monto_colones DECIMAL(10, 2) NOT NULL,
  fecha_infraccion DATE NOT NULL,
  estado VARCHAR(40) NOT NULL DEFAULT 'Pendiente',
  CONSTRAINT fk_multa_alquiler
    FOREIGN KEY (alquiler_id) REFERENCES alquileres(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_multa_vehiculo
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 13. Tabla de Accesorios Adicionales
CREATE TABLE IF NOT EXISTS accesorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio_diario_colones DECIMAL(10, 2) NOT NULL,
  stock_disponible INT NOT NULL DEFAULT 10,
  estado VARCHAR(40) NOT NULL DEFAULT 'Disponible'
) ENGINE=InnoDB;

-- 14. Tabla de Reservas Web Anticipadas
CREATE TABLE IF NOT EXISTS reservas_web (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  sucursal_retiro VARCHAR(100) NOT NULL,
  fecha_solicitada DATE NOT NULL,
  dias_estimados INT NOT NULL DEFAULT 3,
  monto_estimado_colones DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(40) NOT NULL DEFAULT 'Confirmada',
  CONSTRAINT fk_reserva_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reserva_vehiculo
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 15. Tabla de Calificaciones y Reseñas de Clientes
CREATE TABLE IF NOT EXISTS calificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  alquiler_id INT NOT NULL,
  puntuacion INT NOT NULL DEFAULT 5,
  comentario VARCHAR(220) NOT NULL,
  fecha DATE NOT NULL,
  CONSTRAINT fk_calificacion_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_calificacion_vehiculo
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_calificacion_alquiler
    FOREIGN KEY (alquiler_id) REFERENCES alquileres(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
