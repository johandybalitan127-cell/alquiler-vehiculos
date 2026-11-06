const { Alquiler, Cliente, Vehiculo, Empleado } = require('../models');

const handleSequelizeError = (res, error, defaultMsg) => {
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    const errores = error.errors.map((e) => e.message);
    return res.status(400).json({
      error: errores[0] || 'Error de validación en los datos del alquiler.',
      detalles: errores
    });
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'El cliente, vehículo o empleado especificado no existe en el sistema.'
    });
  }
  return res.status(500).json({
    error: defaultMsg,
    detalle: error.message
  });
};

// READ ALL - Obtener todos los alquileres con relaciones
exports.obtenerAlquileres = async (req, res) => {
  try {
    const alquileres = await Alquiler.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Vehiculo, as: 'vehiculo' },
        { model: Empleado, as: 'empleado' }
      ],
      order: [['id', 'DESC']]
    });
    return res.status(200).json(alquileres);
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al consultar los alquileres.');
  }
};

// READ BY ID - Obtener un alquiler por ID
exports.obtenerAlquilerPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del alquiler debe ser un número entero válido.' });
    }

    const alquiler = await Alquiler.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Vehiculo, as: 'vehiculo' },
        { model: Empleado, as: 'empleado' }
      ]
    });

    if (!alquiler) {
      return res.status(404).json({ error: `Alquiler con ID ${id} no encontrado.` });
    }

    return res.status(200).json(alquiler);
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al obtener el alquiler.');
  }
};

// CREATE - Registrar un nuevo alquiler
exports.crearAlquiler = async (req, res) => {
  try {
    const {
      cliente_id,
      vehiculo_id,
      empleado_id,
      fecha_inicio,
      fecha_fin,
      total,
      estado
    } = req.body;

    if (
      cliente_id === undefined ||
      vehiculo_id === undefined ||
      empleado_id === undefined ||
      !fecha_inicio ||
      !fecha_fin ||
      total === undefined
    ) {
      return res.status(400).json({
        error:
          'Los campos cliente_id, vehiculo_id, empleado_id, fecha_inicio, fecha_fin y total son obligatorios.'
      });
    }

    const clienteIdNum = Number(cliente_id);
    const vehiculoIdNum = Number(vehiculo_id);
    const empleadoIdNum = Number(empleado_id);
    const totalNum = Number(total);

    if (
      !Number.isInteger(clienteIdNum) ||
      !Number.isInteger(vehiculoIdNum) ||
      !Number.isInteger(empleadoIdNum)
    ) {
      return res.status(400).json({
        error: 'Los identificadores cliente_id, vehiculo_id y empleado_id deben ser números enteros.'
      });
    }

    if (Number.isNaN(totalNum) || totalNum <= 0) {
      return res.status(400).json({
        error: 'El total del alquiler debe ser un número mayor a 0.'
      });
    }

    if (new Date(fecha_fin) < new Date(fecha_inicio)) {
      return res.status(400).json({
        error: 'La fecha de fin no puede ser anterior a la fecha de inicio.'
      });
    }

    // Verificar existencia de entidades relacionadas
    const [cliente, vehiculo, empleado] = await Promise.all([
      Cliente.findByPk(clienteIdNum),
      Vehiculo.findByPk(vehiculoIdNum),
      Empleado.findByPk(empleadoIdNum)
    ]);

    if (!cliente) {
      return res.status(404).json({ error: `Cliente con ID ${clienteIdNum} no encontrado.` });
    }
    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${vehiculoIdNum} no encontrado.` });
    }
    if (!empleado) {
      return res.status(404).json({ error: `Empleado con ID ${empleadoIdNum} no encontrado.` });
    }

    const estadoFinal = estado ? String(estado).trim() : 'Activo';

    const nuevoAlquiler = await Alquiler.create({
      cliente_id: clienteIdNum,
      vehiculo_id: vehiculoIdNum,
      empleado_id: empleadoIdNum,
      fecha_inicio,
      fecha_fin,
      total: totalNum,
      estado: estadoFinal
    });

    if (estadoFinal === 'Activo') {
      await vehiculo.update({ estado: 'Alquilado' });
    }

    const alquilerCompleto = await Alquiler.findByPk(nuevoAlquiler.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Vehiculo, as: 'vehiculo' },
        { model: Empleado, as: 'empleado' }
      ]
    });

    return res.status(201).json({
      mensaje: 'Contrato de alquiler registrado exitosamente.',
      data: alquilerCompleto
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al registrar el alquiler.');
  }
};

// UPDATE - Actualizar un alquiler existente
exports.actualizarAlquiler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del alquiler debe ser un número entero válido.' });
    }

    const alquiler = await Alquiler.findByPk(id);
    if (!alquiler) {
      return res.status(404).json({ error: `Alquiler con ID ${id} no encontrado.` });
    }

    const {
      cliente_id,
      vehiculo_id,
      empleado_id,
      fecha_inicio,
      fecha_fin,
      total,
      estado
    } = req.body;

    if (
      cliente_id === undefined ||
      vehiculo_id === undefined ||
      empleado_id === undefined ||
      !fecha_inicio ||
      !fecha_fin ||
      total === undefined ||
      !estado
    ) {
      return res.status(400).json({
        error:
          'Todos los campos son obligatorios: cliente_id, vehiculo_id, empleado_id, fecha_inicio, fecha_fin, total y estado.'
      });
    }

    const clienteIdNum = Number(cliente_id);
    const vehiculoIdNum = Number(vehiculo_id);
    const empleadoIdNum = Number(empleado_id);
    const totalNum = Number(total);

    if (
      !Number.isInteger(clienteIdNum) ||
      !Number.isInteger(vehiculoIdNum) ||
      !Number.isInteger(empleadoIdNum)
    ) {
      return res.status(400).json({
        error: 'Los identificadores cliente_id, vehiculo_id y empleado_id deben ser números enteros.'
      });
    }

    if (Number.isNaN(totalNum) || totalNum <= 0) {
      return res.status(400).json({
        error: 'El total del alquiler debe ser un número mayor a 0.'
      });
    }

    if (new Date(fecha_fin) < new Date(fecha_inicio)) {
      return res.status(400).json({
        error: 'La fecha de fin no puede ser anterior a la fecha de inicio.'
      });
    }

    const [cliente, vehiculo, empleado] = await Promise.all([
      Cliente.findByPk(clienteIdNum),
      Vehiculo.findByPk(vehiculoIdNum),
      Empleado.findByPk(empleadoIdNum)
    ]);

    if (!cliente) {
      return res.status(404).json({ error: `Cliente con ID ${clienteIdNum} no encontrado.` });
    }
    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${vehiculoIdNum} no encontrado.` });
    }
    if (!empleado) {
      return res.status(404).json({ error: `Empleado con ID ${empleadoIdNum} no encontrado.` });
    }

    const vehiculoAnteriorId = alquiler.vehiculo_id;

    await alquiler.update({
      cliente_id: clienteIdNum,
      vehiculo_id: vehiculoIdNum,
      empleado_id: empleadoIdNum,
      fecha_inicio,
      fecha_fin,
      total: totalNum,
      estado: String(estado).trim()
    });

    // Sincronizar estado del vehículo
    if (vehiculoAnteriorId !== vehiculoIdNum) {
      const vehiculoAnterior = await Vehiculo.findByPk(vehiculoAnteriorId);
      if (vehiculoAnterior) {
        await vehiculoAnterior.update({ estado: 'Disponible' });
      }
    }

    if (estado === 'Activo') {
      await vehiculo.update({ estado: 'Alquilado' });
    } else if (estado === 'Finalizado' || estado === 'Cancelado') {
      await vehiculo.update({ estado: 'Disponible' });
    }

    const alquilerActualizado = await Alquiler.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Vehiculo, as: 'vehiculo' },
        { model: Empleado, as: 'empleado' }
      ]
    });

    return res.status(200).json({
      mensaje: 'Contrato de alquiler actualizado exitosamente.',
      data: alquilerActualizado
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al actualizar el alquiler.');
  }
};

// DELETE - Eliminar un alquiler
exports.eliminarAlquiler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del alquiler debe ser un número entero válido.' });
    }

    const alquiler = await Alquiler.findByPk(id);
    if (!alquiler) {
      return res.status(404).json({ error: `Alquiler con ID ${id} no encontrado.` });
    }

    const vehiculoId = alquiler.vehiculo_id;
    const eraActivo = alquiler.estado === 'Activo';

    await alquiler.destroy();

    if (eraActivo) {
      const vehiculo = await Vehiculo.findByPk(vehiculoId);
      if (vehiculo) {
        await vehiculo.update({ estado: 'Disponible' });
      }
    }

    return res.status(200).json({
      mensaje: 'Contrato de alquiler eliminado correctamente.'
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al eliminar el alquiler.');
  }
};

