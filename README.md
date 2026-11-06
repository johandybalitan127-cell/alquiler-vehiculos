# Rent Car Fios — Sistema Empresarial de Gestión de Flota y Alquiler de Vehículos

Sistema web Full Stack de nivel corporativo para la administración y alquiler de vehículos en Costa Rica (**CRC ₡**), desarrollado con **Node.js**, **Express**, **Sequelize ORM**, **MySQL** y **React (Vite)**.

---

## 1. Características Principales

- **Identidad Corporativa**: Marca oficial **Rent Car Fios** con diseño ejecutivo SaaS, showroom interactivo y galería de vehículos en tiempo real.
- **Moneda Oficial**: Facturación y tarifas en **Colones Costarricenses (`₡`)** con cálculo de **IVA 13%** y placas vehiculares de Costa Rica.
- **15 Entidades Relacionales en MySQL**: Modelo de base de datos relacional robusto con llaves foráneas e integridad referencial.
- **15 Controladores Backend**: Módulos independientes para operaciones, cotizador en tiempo real, facturación, rendimiento de asesores y reportes ejecutivos.
- **Colección Thunder Client**: Archivo `thunder-collection_AutoRent.json` listo para importar y probar los endpoints.

---

## 2. Estructura del Proyecto

```text
vehiculo/
├── .gitignore
├── database.sql                        # Script SQL completo (15 tablas y datos semilla en ₡)
├── thunder-collection_AutoRent.json    # Colección para Thunder Client / Postman
├── README.md
├── backend/
│   ├── .env                            # Variables de entorno de conexión MySQL
│   ├── .env.example                    # Plantilla de variables de entorno
│   ├── package.json
│   └── src/
│       ├── app.js                      # Servidor Express y sincronización Sequelize
│       ├── config/
│       │   └── database.js             # Conexión Sequelize y creación automática de BD
│       ├── models/
│       │   ├── index.js                # Asociaciones (15 modelos) y datos semilla
│       │   ├── Cliente.js
│       │   ├── Vehiculo.js
│       │   ├── Empleado.js
│       │   ├── Alquiler.js
│       │   ├── Sucursal.js
│       │   ├── CategoriaVehiculo.js
│       │   ├── Seguro.js
│       │   ├── Pago.js
│       │   ├── Factura.js
│       │   ├── Mantenimiento.js
│       │   ├── Inspeccion.js
│       │   ├── Multa.js
│       │   ├── Accesorio.js
│       │   ├── ReservaWeb.js
│       │   └── Calificacion.js
│       ├── controllers/
│       │   ├── clienteController.js
│       │   ├── vehiculoController.js
│       │   ├── empleadoController.js
│       │   ├── alquilerController.js
│       │   ├── dashboardController.js
│       │   ├── flotaController.js
│       │   ├── facturacionController.js
│       │   ├── reporteController.js
│       │   ├── busquedaController.js
│       │   ├── historialClienteController.js
│       │   ├── historialVehiculoController.js
│       │   ├── rendimientoEmpleadoController.js
│       │   ├── cotizadorController.js
│       │   ├── mantenimientoController.js
│       │   └── perfilAgenciaController.js
│       └── routes/
│           ├── clienteRoutes.js
│           ├── vehiculoRoutes.js
│           ├── empleadoRoutes.js
│           ├── alquilerRoutes.js
│           └── operacionesRoutes.js
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   ├── logo-autorent.svg           # Logotipo oficial Rent Car Fios
    │   ├── flota-autorent.jpg
    │   └── entrega-llaves.jpg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css                     # Sistema de diseño ejecutivo
        ├── services/
        │   └── api.js                  # Comunicación REST hacia el backend
        ├── utils/
        │   └── vehicleImages.js        # Formateador de colones (₡) e imágenes
        └── components/
            ├── Sidebar.jsx
            ├── Dashboard.jsx
            ├── CatalogoView.jsx
            ├── ClientesView.jsx
            ├── VehiculosView.jsx
            ├── EmpleadosView.jsx
            ├── AlquileresView.jsx
            ├── CentroControladoresView.jsx
            ├── PerfilView.jsx
            ├── ConfirmModal.jsx
            └── DetailModal.jsx
```

---

## 3. Las 15 Entidades de Base de Datos (MySQL)

1. **`clientes`**: Clientes registrados (cédula costarricense, correo, teléfono, dirección).
2. **`vehiculos`**: Flota vehicular (marca, modelo, año, placa CR, tarifa diaria en colones, estado).
3. **`empleados`**: Personal operativo y asesores comerciales de la agencia.
4. **`alquileres`**: Contratos de alquiler que relacionan cliente, vehículo y asesor.
5. **`sucursales`**: Sedes y agencias de Rent Car Fios en el país.
6. **`categorias_vehiculo`**: Clasificación de flota (Sedán, SUV, Premium, Pickup).
7. **`seguros`**: Pólizas de cobertura básica y cero deducible.
8. **`pagos`**: Registro de pagos y depósitos en garantía vinculados a alquileres.
9. **`facturas`**: Facturación electrónica con desglose de IVA (13%).
10. **`mantenimientos`**: Órdenes de taller preventivo y correctivo para vehículos.
11. **`inspecciones`**: Check-in y check-out de kilometraje y combustible al entregar/recibir el auto.
12. **`multas`**: Infracciones de tránsito y peajes asociados a contratos.
13. **`accesorios`**: Extras de viaje (GPS, silla infantil, Wi-Fi portátil, racks).
14. **`reservas_web`**: Solicitudes de reserva previa por sucursal.
15. **`calificaciones`**: Evaluaciones, puntuación y opiniones de clientes sobre el servicio.

---

## 4. Los 15 Controladores Backend

| # | Controlador | Ruta Base | Descripción |
| :---: | :--- | :--- | :--- |
| **1** | `clienteController.js` | `/api/clientes` | CRUD completo de Clientes |
| **2** | `vehiculoController.js` | `/api/vehiculos` | CRUD completo de Vehículos |
| **3** | `empleadoController.js` | `/api/empleados` | CRUD completo de Empleados |
| **4** | `alquilerController.js` | `/api/alquileres` | CRUD completo de Contratos de Alquiler |
| **5** | `dashboardController.js` | `/api/dashboard/resumen` | Métricas y estadísticas del panel principal |
| **6** | `flotaController.js` | `/api/flota/disponibles` | Disponibilidad y cambio de estado rápido |
| **7** | `facturacionController.js` | `/api/facturacion/resumen` | Recaudación acumulada y facturación en colones |
| **8** | `reporteController.js` | `/api/reportes/general` | Reporte general y explorador de las 15 entidades |
| **9** | `busquedaController.js` | `/api/busqueda?q=` | Búsqueda global multicriterio |
| **10** | `historialClienteController.js` | `/api/historial-clientes/:id` | Expediente y contratos históricos por cliente |
| **11** | `historialVehiculoController.js` | `/api/historial-vehiculos/:id` | Historial de contratos y estado por vehículo |
| **12** | `rendimientoEmpleadoController.js` | `/api/rendimiento-empleados` | Ventas y contratos generados por asesor |
| **13** | `cotizadorController.js` | `/api/cotizador` | Calculadora de cotizaciones con IVA (13%) en colones |
| **14** | `mantenimientoController.js` | `/api/mantenimiento` | Envío y retorno de vehículos a taller mecánico |
| **15** | `perfilAgenciaController.js` | `/api/perfil` | Configuración oficial de la agencia y logotipo |

---

## 5. Instrucciones de Instalación y Ejecución

### Prerrequisitos
- **Node.js** (v18 o superior)
- **MySQL Server** (XAMPP, MySQL Workbench, Laragon o servicio local en el puerto `3306`)

### Paso 1: Configurar la Base de Datos
1. Inicia el servicio de **MySQL**.
2. Opcionalmente importa el archivo `database.sql` en tu gestor de base de datos preferido (MySQL Workbench, phpMyAdmin, etc.).
3. Revisa el archivo `backend/.env` con tus credenciales de MySQL:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=autorent_db
   DB_USER=root
   DB_PASS=1234
   ```
*(Nota: El servidor crea automáticamente la base de datos `autorent_db`, las tablas y los datos semilla si no existen).*

### Paso 2: Ejecutar el Backend
```bash
cd backend
npm install
npm start
```
El servidor backend iniciará en: `http://localhost:3000`.

### Paso 3: Ejecutar el Frontend
En otra consola/terminal:
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en: `http://localhost:5173`.

---

## 6. Pruebas con Thunder Client / Postman

Importa el archivo **`thunder-collection_AutoRent.json`** en la extensión Thunder Client de VS Code o en Postman para probar los endpoints CRUD y los servicios operativos con respuestas en formato JSON y códigos de estado HTTP estándar (200, 201, 400, 404, 500).
