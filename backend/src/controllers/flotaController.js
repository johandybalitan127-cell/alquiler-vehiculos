const { Vehiculo, Alquiler, Cliente } = require('../models');

// Controlador #6: Control operativo y disponibilidad de la flota vehicular
exports.obtenerVehiculosDisponibles = async (req, res) => {
  try {
    const disponibles = await Vehiculo.findAll({
      where: { estado: 'Disponible' },
      order: [['precio_dia', 'ASC']]
    });
    return res.status(200).json(disponibles);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al consultar los vehículos disponibles.',
      detalle: error.message
    });
  }
};

exports.obtenerVehiculosEnAlquiler = async (req, res) => {
  try {
    const alquilados = await Vehiculo.findAll({
      where: { estado: 'Alquilado' },
      include: [
        {
          model: Alquiler,
          as: 'alquileres',
          include: [{ model: Cliente, as: 'cliente' }]
        }
      ],
      order: [['id', 'DESC']]
    });
    return res.status(200).json(alquilados);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al consultar los vehículos en alquiler.',
      detalle: error.message
    });
  }
};

exports.cambiarEstadoVehiculo = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID de vehículo inválido.' });
    }

    const estadosValidos = ['Disponible', 'Alquilado', 'Mantenimiento'];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: 'El estado debe ser Disponible, Alquilado o Mantenimiento.'
      });
    }

    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${id} no encontrado.` });
    }

    await vehiculo.update({ estado });
    return res.status(200).json({
      mensaje: `Estado del vehículo ${vehiculo.placa} actualizado a ${estado}.`,
      data: vehiculo
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno al cambiar el estado del vehículo.',
      detalle: error.message
    });
  }
};

