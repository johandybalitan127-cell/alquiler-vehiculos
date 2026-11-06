const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { ensureDatabaseExists } = require('./config/database');
const { sequelize, seedInitialData } = require('./models');

const clienteRoutes = require('./routes/clienteRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const alquilerRoutes = require('./routes/alquilerRoutes');
const operacionesRoutes = require('./routes/operacionesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Capturar errores de JSON mal formado (HTTP 400)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'El cuerpo de la petición no contiene un formato JSON válido.'
    });
  }
  next(err);
});

// Ruta raíz informativa de la API
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    sistema: 'AutoRent - Sistema Empresarial de Gestión de Alquiler de Vehículos',
    estado: 'Operativo',
    total_controladores: 15,
    endpoints: {
      clientes: '/api/clientes',
      vehiculos: '/api/vehiculos',
      empleados: '/api/empleados',
      alquileres: '/api/alquileres',
      dashboard: '/api/dashboard/resumen',
      flota: '/api/flota/disponibles',
      facturacion: '/api/facturacion/resumen',
      reportes: '/api/reportes/clientes-frecuentes',
      busqueda: '/api/busqueda?q=Toyota',
      historial_clientes: '/api/historial-clientes/1',
      historial_vehiculos: '/api/historial-vehiculos/1',
      rendimiento_empleados: '/api/rendimiento-empleados',
      cotizador: '/api/cotizador',
      mantenimiento: '/api/mantenimiento',
      perfil: '/api/perfil'
    }
  });
});

// Rutas REST principales (15 controladores integrados)
app.use('/api/clientes', clienteRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/alquileres', alquilerRoutes);
app.use('/api', operacionesRoutes);

// Manejador 404 para rutas inexistentes (siempre en JSON)
app.use((req, res) => {
  return res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejador global de errores 500
app.use((err, req, res, next) => {
  return res.status(500).json({
    error: 'Error interno del servidor.',
    detalle: err.message
  });
});

async function iniciarServidor() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente.');

    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados con la base de datos.');

    await seedInitialData();
    console.log('✅ Datos iniciales verificados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor AutoRent ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos MySQL:', error.message);
    process.exit(1);
  }
}

iniciarServidor();

