const {
  Cliente,
  Vehiculo,
  Empleado,
  Alquiler,
  Sucursal,
  CategoriaVehiculo,
  Seguro,
  Pago,
  Factura,
  Mantenimiento,
  Inspeccion,
  Multa,
  Accesorio,
  ReservaWeb,
  Calificacion
} = require('../models');

const MAPA_MODELOS = {
  clientes: Cliente,
  vehiculos: Vehiculo,
  empleados: Empleado,
  alquileres: Alquiler,
  sucursales: Sucursal,
  categorias_vehiculo: CategoriaVehiculo,
  seguros: Seguro,
  pagos: Pago,
  facturas: Factura,
  mantenimientos: Mantenimiento,
  inspecciones: Inspeccion,
  multas: Multa,
  accesorios: Accesorio,
  reservas_web: ReservaWeb,
  calificaciones: Calificacion
};

// Controlador #8: Reportes empresariales, clientes frecuentes y explorador de las 15 entidades de BD
exports.obtenerReporteGeneral = async (req, res) => {
  try {
    const [
      clientes,
      vehiculos,
      empleados,
      alquileres,
      sucursales,
      categorias_vehiculo,
      seguros,
      pagos,
      facturas,
      mantenimientos,
      inspecciones,
      multas,
      accesorios,
      reservas_web,
      calificaciones
    ] = await Promise.all([
      Cliente.findAll({ order: [['id', 'DESC']] }),
      Vehiculo.findAll({ order: [['id', 'DESC']] }),
      Empleado.findAll({ order: [['id', 'DESC']] }),
      Alquiler.findAll({ order: [['id', 'DESC']] }),
      Sucursal.findAll({ order: [['id', 'DESC']] }),
      CategoriaVehiculo.findAll({ order: [['id', 'DESC']] }),
      Seguro.findAll({ order: [['id', 'DESC']] }),
      Pago.findAll({ order: [['id', 'DESC']] }),
      Factura.findAll({ order: [['id', 'DESC']] }),
      Mantenimiento.findAll({ order: [['id', 'DESC']] }),
      Inspeccion.findAll({ order: [['id', 'DESC']] }),
      Multa.findAll({ order: [['id', 'DESC']] }),
      Accesorio.findAll({ order: [['id', 'DESC']] }),
      ReservaWeb.findAll({ order: [['id', 'DESC']] }),
      Calificacion.findAll({ order: [['id', 'DESC']] })
    ]);

    return res.status(200).json({
      fecha_generacion: new Date().toISOString(),
      total_tablas_bd: 15,
      entidades: {
        clientes,
        vehiculos,
        empleados,
        alquileres,
        sucursales,
        categorias_vehiculo,
        seguros,
        pagos,
        facturas,
        mantenimientos,
        inspecciones,
        multas,
        accesorios,
        reservas_web,
        calificaciones
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al generar el reporte general de las 15 entidades.',
      detalle: error.message
    });
  }
};

exports.obtenerClientesFrecuentes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{ model: Alquiler, as: 'alquileres' }]
    });

    const ranking = clientes.map((c) => {
      const contratos = (c.alquileres || []).filter((a) => a.estado !== 'Cancelado');
      const inversionTotal = contratos.reduce((sum, a) => sum + Number(a.total || 0), 0);
      return {
        id: c.id,
        nombre: c.nombre,
        correo: c.correo,
        telefono: c.telefono,
        identificacion: c.identificacion,
        cantidad_alquileres: contratos.length,
        inversion_colones: inversionTotal
      };
    });

    ranking.sort((a, b) => b.inversion_colones - a.inversion_colones);
    return res.status(200).json(ranking);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener el ranking de clientes frecuentes.',
      detalle: error.message
    });
  }
};

exports.crearRegistroEntidad = async (req, res) => {
  try {
    const { tabla } = req.params;
    const Modelo = MAPA_MODELOS[tabla];
    if (!Modelo) {
      return res.status(404).json({ error: `La entidad '${tabla}' no existe.` });
    }

    const nuevo = await Modelo.create(req.body);
    return res.status(201).json({
      mensaje: `Registro creado exitosamente en la tabla '${tabla}'.`,
      data: nuevo
    });
  } catch (error) {
    return res.status(400).json({
      error: `Error al insertar en '${req.params.tabla}': ${error.message}`
    });
  }
};

exports.eliminarRegistroEntidad = async (req, res) => {
  try {
    const { tabla, id } = req.params;
    const Modelo = MAPA_MODELOS[tabla];
    if (!Modelo) {
      return res.status(404).json({ error: `La entidad '${tabla}' no existe.` });
    }

    const registro = await Modelo.findByPk(Number(id));
    if (!registro) {
      return res.status(404).json({ error: `Registro #${id} no encontrado en '${tabla}'.` });
    }

    await registro.destroy();
    return res.status(200).json({
      mensaje: `Registro #${id} eliminado de la tabla '${tabla}'.`
    });
  } catch (error) {
    return res.status(400).json({
      error: `No se pudo eliminar el registro: ${error.message}`
    });
  }
};
