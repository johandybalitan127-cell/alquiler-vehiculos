const { Cliente, Alquiler, Vehiculo, Empleado } = require('../models');

// Controlador #10: Historial completo de alquileres e inversión por cliente
exports.obtenerHistorialPorCliente = async (req, res) => {
  try {
    const clienteId = Number(req.params.clienteId);
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      return res.status(400).json({ error: 'ID de cliente inválido.' });
    }

    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: `Cliente con ID ${clienteId} no encontrado.` });
    }

    const alquileres = await Alquiler.findAll({
      where: { cliente_id: clienteId },
      include: [
        { model: Vehiculo, as: 'vehiculo' },
        { model: Empleado, as: 'empleado' }
      ],
      order: [['fecha_inicio', 'DESC']]
    });

    const totalInvertido = alquileres
      .filter((a) => a.estado !== 'Cancelado')
      .reduce((acc, a) => acc + Number(a.total || 0), 0);

    return res.status(200).json({
      cliente,
      resumen: {
        total_contratos: alquileres.length,
        contratos_activos: alquileres.filter((a) => a.estado === 'Activo').length,
        inversion_total_colones: totalInvertido
      },
      historial: alquileres
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al consultar el historial del cliente.',
      detalle: error.message
    });
  }
};

