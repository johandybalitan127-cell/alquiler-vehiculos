const { Vehiculo } = require('../models');

// Controlador #14: Gestión de taller y mantenimiento preventivo de flota
exports.obtenerVehiculosEnMantenimiento = async (req, res) => {
  try {
    const enTaller = await Vehiculo.findAll({
      where: { estado: 'Mantenimiento' },
      order: [['id', 'DESC']]
    });
    return res.status(200).json({
      total_en_taller: enTaller.length,
      vehiculos: enTaller
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al consultar los vehículos en mantenimiento.',
      detalle: error.message
    });
  }
};

exports.enviarVehiculoAMantenimiento = async (req, res) => {
  try {
    const vehiculoId = Number(req.params.vehiculoId);
    if (!Number.isInteger(vehiculoId) || vehiculoId <= 0) {
      return res.status(400).json({ error: 'ID de vehículo inválido.' });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${vehiculoId} no encontrado.` });
    }

    if (vehiculo.estado === 'Alquilado') {
      return res.status(400).json({
        error: 'No se puede enviar a taller un vehículo que tiene un alquiler activo.'
      });
    }

    await vehiculo.update({ estado: 'Mantenimiento' });
    return res.status(200).json({
      mensaje: `Vehículo ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa}) ingresado a mantenimiento.`,
      data: vehiculo
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al enviar el vehículo a mantenimiento.',
      detalle: error.message
    });
  }
};

exports.liberarVehiculoDeMantenimiento = async (req, res) => {
  try {
    const vehiculoId = Number(req.params.vehiculoId);
    if (!Number.isInteger(vehiculoId) || vehiculoId <= 0) {
      return res.status(400).json({ error: 'ID de vehículo inválido.' });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${vehiculoId} no encontrado.` });
    }

    await vehiculo.update({ estado: 'Disponible' });
    return res.status(200).json({
      mensaje: `Vehículo ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa}) habilitado como Disponible.`,
      data: vehiculo
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al liberar el vehículo de mantenimiento.',
      detalle: error.message
    });
  }
};

