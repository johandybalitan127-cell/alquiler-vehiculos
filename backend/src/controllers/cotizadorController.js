const { Vehiculo } = require('../models');

// Controlador #13: Cotizador de tarifas de alquiler en Colones (₡)
exports.calcularCotizacion = async (req, res) => {
  try {
    const { vehiculo_id, fecha_inicio, fecha_fin } = req.body;

    if (!vehiculo_id || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        error: 'Debe enviar vehiculo_id, fecha_inicio y fecha_fin para cotizar.'
      });
    }

    const vehiculo = await Vehiculo.findByPk(Number(vehiculo_id));
    if (!vehiculo) {
      return res.status(404).json({
        error: `Vehículo con ID ${vehiculo_id} no encontrado.`
      });
    }

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime()) || fin < inicio) {
      return res.status(400).json({
        error: 'El rango de fechas proporcionado no es válido.'
      });
    }

    const dias = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));
    const tarifaDiaria = Number(vehiculo.precio_dia);
    const subtotal = dias * tarifaDiaria;
    const iva = Math.round(subtotal * 0.13);
    const totalConIva = subtotal + iva;

    return res.status(200).json({
      vehiculo: {
        id: vehiculo.id,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        placa: vehiculo.placa,
        estado: vehiculo.estado
      },
      fecha_inicio,
      fecha_fin,
      dias_alquiler: dias,
      tarifa_diaria_colones: tarifaDiaria,
      subtotal_colones: subtotal,
      iva_13_colones: iva,
      total_estimado_colones: totalConIva
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al calcular la cotización de alquiler.',
      detalle: error.message
    });
  }
};

