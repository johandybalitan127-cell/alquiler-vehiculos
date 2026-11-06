const { Empleado, Alquiler, Cliente, Vehiculo } = require('../models');

const handleSequelizeError = (res, error, defaultMsg) => {
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    const errores = error.errors.map((e) => e.message);
    return res.status(400).json({
      error: errores[0] || 'Error de validación en los datos del empleado.',
      detalles: errores
    });
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'No se puede eliminar el empleado porque tiene contratos de alquiler asociados.'
    });
  }
  return res.status(500).json({
    error: defaultMsg,
    detalle: error.message
  });
};

// READ ALL - Obtener todos los empleados
exports.obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      include: [{ model: Alquiler, as: 'alquileres' }],
      order: [['id', 'DESC']]
    });
    return res.status(200).json(empleados);
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al consultar los empleados.');
  }
};

// READ BY ID - Obtener un empleado por ID
exports.obtenerEmpleadoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del empleado debe ser un número entero válido.' });
    }

    const empleado = await Empleado.findByPk(id, {
      include: [
        {
          model: Alquiler,
          as: 'alquileres',
          include: [
            { model: Cliente, as: 'cliente' },
            { model: Vehiculo, as: 'vehiculo' }
          ]
        }
      ]
    });

    if (!empleado) {
      return res.status(404).json({ error: `Empleado con ID ${id} no encontrado.` });
    }

    return res.status(200).json(empleado);
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al obtener el empleado.');
  }
};

// CREATE - Registrar un nuevo empleado
exports.crearEmpleado = async (req, res) => {
  try {
    const { nombre, correo, telefono, cargo } = req.body;

    if (!nombre || !correo || !telefono || !cargo) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, correo, telefono y cargo.'
      });
    }

    const nuevoEmpleado = await Empleado.create({
      nombre: String(nombre).trim(),
      correo: String(correo).trim().toLowerCase(),
      telefono: String(telefono).trim(),
      cargo: String(cargo).trim()
    });

    return res.status(201).json({
      mensaje: 'Empleado registrado exitosamente.',
      data: nuevoEmpleado
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al registrar el empleado.');
  }
};

// UPDATE - Actualizar un empleado existente
exports.actualizarEmpleado = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del empleado debe ser un número entero válido.' });
    }

    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ error: `Empleado con ID ${id} no encontrado.` });
    }

    const { nombre, correo, telefono, cargo } = req.body;
    if (!nombre || !correo || !telefono || !cargo) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, correo, telefono y cargo.'
      });
    }

    await empleado.update({
      nombre: String(nombre).trim(),
      correo: String(correo).trim().toLowerCase(),
      telefono: String(telefono).trim(),
      cargo: String(cargo).trim()
    });

    return res.status(200).json({
      mensaje: 'Empleado actualizado exitosamente.',
      data: empleado
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al actualizar el empleado.');
  }
};

// DELETE - Eliminar un empleado
exports.eliminarEmpleado = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del empleado debe ser un número entero válido.' });
    }

    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ error: `Empleado con ID ${id} no encontrado.` });
    }

    const alquileresAsociados = await Alquiler.count({ where: { empleado_id: id } });
    if (alquileresAsociados > 0) {
      return res.status(400).json({
        error: `No se puede eliminar el empleado porque gestiona ${alquileresAsociados} alquiler(es) registrado(s).`
      });
    }

    await empleado.destroy();
    return res.status(200).json({
      mensaje: 'Empleado eliminado correctamente.'
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al eliminar el empleado.');
  }
};

