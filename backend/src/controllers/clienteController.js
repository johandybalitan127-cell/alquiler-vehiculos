const { Cliente, Alquiler, Vehiculo } = require('../models');

const handleSequelizeError = (res, error, defaultMsg) => {
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    const errores = error.errors.map((e) => e.message);
    return res.status(400).json({
      error: errores[0] || 'Error de validación en los datos enviados.',
      detalles: errores
    });
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'No se puede eliminar o modificar el cliente porque tiene alquileres asociados.'
    });
  }
  return res.status(500).json({
    error: defaultMsg,
    detalle: error.message
  });
};

// READ ALL - Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{ model: Alquiler, as: 'alquileres' }],
      order: [['id', 'DESC']]
    });
    return res.status(200).json(clientes);
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al consultar los clientes.');
  }
};

// READ BY ID - Obtener un cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del cliente debe ser un número entero válido.' });
    }

    const cliente = await Cliente.findByPk(id, {
      include: [
        {
          model: Alquiler,
          as: 'alquileres',
          include: [{ model: Vehiculo, as: 'vehiculo' }]
        }
      ]
    });

    if (!cliente) {
      return res.status(404).json({ error: `Cliente con ID ${id} no encontrado.` });
    }

    return res.status(200).json(cliente);
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al obtener el cliente.');
  }
};

// CREATE - Registrar un nuevo cliente
exports.crearCliente = async (req, res) => {
  try {
    const { nombre, correo, telefono, identificacion } = req.body;

    if (!nombre || !correo || !telefono || !identificacion) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, correo, telefono e identificacion.'
      });
    }

    const nuevoCliente = await Cliente.create({
      nombre: String(nombre).trim(),
      correo: String(correo).trim().toLowerCase(),
      telefono: String(telefono).trim(),
      identificacion: String(identificacion).trim()
    });

    return res.status(201).json({
      mensaje: 'Cliente registrado exitosamente.',
      data: nuevoCliente
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al registrar el cliente.');
  }
};

// UPDATE - Actualizar un cliente existente
exports.actualizarCliente = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del cliente debe ser un número entero válido.' });
    }

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: `Cliente con ID ${id} no encontrado.` });
    }

    const { nombre, correo, telefono, identificacion } = req.body;
    if (!nombre || !correo || !telefono || !identificacion) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, correo, telefono e identificacion.'
      });
    }

    await cliente.update({
      nombre: String(nombre).trim(),
      correo: String(correo).trim().toLowerCase(),
      telefono: String(telefono).trim(),
      identificacion: String(identificacion).trim()
    });

    return res.status(200).json({
      mensaje: 'Cliente actualizado exitosamente.',
      data: cliente
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al actualizar el cliente.');
  }
};

// DELETE - Eliminar un cliente
exports.eliminarCliente = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del cliente debe ser un número entero válido.' });
    }

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: `Cliente con ID ${id} no encontrado.` });
    }

    const alquileresAsociados = await Alquiler.count({ where: { cliente_id: id } });
    if (alquileresAsociados > 0) {
      return res.status(400).json({
        error: `No se puede eliminar el cliente porque tiene ${alquileresAsociados} alquiler(es) registrado(s).`
      });
    }

    await cliente.destroy();
    return res.status(200).json({
      mensaje: 'Cliente eliminado correctamente.'
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al eliminar el cliente.');
  }
};

