const { Alquiler, Vehiculo, Cliente } = require('../models');

// Controlador #7: Facturación e ingresos financieros en Colones (₡)
exports.obtenerResumenFacturacion = async (req, res) => {
  try {
    const alquileres = await Alquiler.findAll({
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Cliente, as: 'cliente' }
      ]
    });

    let ingresosActivos = 0;
    let ingresosFinalizados = 0;
    let montoCancelado = 0;

    alquileres.forEach((alq) => {
      const monto = Number(alq.total || 0);
      if (alq.estado === 'Activo') ingresosActivos += monto;
      else if (alq.estado === 'Finalizado') ingresosFinalizados += monto;
      else if (alq.estado === 'Cancelado') montoCancelado += monto;
    });

    const totalFacturado = ingresosActivos + ingresosFinalizados;
    const contratosValidos = alquileres.filter((a) => a.estado !== 'Cancelado').length;
    const ticketPromedio = contratosValidos > 0 ? totalFacturado / contratosValidos : 0;

    return res.status(200).json({
      moneda: 'CRC (₡ Colones)',
      ingresos_activos: ingresosActivos,
      ingresos_finalizados: ingresosFinalizados,
      monto_cancelado: montoCancelado,
      total_facturado: totalFacturado,
      ticket_promedio: Math.round(ticketPromedio),
      total_contratos: alquileres.length
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al calcular el resumen de facturación.',
      detalle: error.message
    });
  }
};

exports.obtenerFacturacionPorVehiculo = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll({
      include: [{ model: Alquiler, as: 'alquileres' }]
    });

    const desglose = vehiculos.map((v) => {
      const contratosValidos = (v.alquileres || []).filter((a) => a.estado !== 'Cancelado');
      const recaudado = contratosValidos.reduce((sum, a) => sum + Number(a.total || 0), 0);
      return {
        vehiculo_id: v.id,
        marca: v.marca,
        modelo: v.modelo,
        placa: v.placa,
        precio_dia: Number(v.precio_dia),
        contratos_realizados: contratosValidos.length,
        total_recaudado: recaudado
      };
    });

    desglose.sort((a, b) => b.total_recaudado - a.total_recaudado);
    return res.status(200).json(desglose);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener la facturación por vehículo.',
      detalle: error.message
    });
  }
};

