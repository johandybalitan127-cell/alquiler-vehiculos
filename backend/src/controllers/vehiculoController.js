const { Vehiculo, Alquiler, Cliente } = require('../models');

const handleSequelizeError = (res, error, defaultMsg) => {
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    const errores = error.errors.map((e) => e.message);
    return res.status(400).json({
      error: errores[0] || 'Error de validación en los datos del vehículo.',
      detalles: errores
    });
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'No se puede eliminar el vehículo porque tiene contratos de alquiler asociados.'
    });
  }
  return res.status(500).json({
    error: defaultMsg,
    detalle: error.message
  });
};

// READ ALL - Obtener todos los vehículos
exports.obtenerVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll({
      include: [{ model: Alquiler, as: 'alquileres' }],
      order: [['id', 'DESC']]
    });
    return res.status(200).json(vehiculos);
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al consultar los vehículos.');
  }
};

// READ BY ID - Obtener un vehículo por ID
exports.obtenerVehiculoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del vehículo debe ser un número entero válido.' });
    }

    const vehiculo = await Vehiculo.findByPk(id, {
      include: [
        {
          model: Alquiler,
          as: 'alquileres',
          include: [{ model: Cliente, as: 'cliente' }]
        }
      ]
    });

    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${id} no encontrado.` });
    }

    return res.status(200).json(vehiculo);
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al obtener el vehículo.');
  }
};

// CREATE - Registrar un nuevo vehículo
exports.crearVehiculo = async (req, res) => {
  try {
    const { marca, modelo, anio, placa, precio_dia, estado } = req.body;

    if (!marca || !modelo || anio === undefined || !placa || precio_dia === undefined) {
      return res.status(400).json({
        error: 'Los campos marca, modelo, anio, placa y precio_dia son obligatorios.'
      });
    }

    const anioNum = Number(anio);
    const precioNum = Number(precio_dia);

    if (!Number.isInteger(anioNum) || anioNum < 1980 || anioNum > 2030) {
      return res.status(400).json({
        error: 'El año (anio) debe ser un número entero válido entre 1980 y 2030.'
      });
    }

    if (Number.isNaN(precioNum) || precioNum <= 0) {
      return res.status(400).json({
        error: 'El precio por día (precio_dia) debe ser un número mayor a 0.'
      });
    }

    const nuevoVehiculo = await Vehiculo.create({
      marca: String(marca).trim(),
      modelo: String(modelo).trim(),
      anio: anioNum,
      placa: String(placa).trim().toUpperCase(),
      precio_dia: precioNum,
      estado: estado ? String(estado).trim() : 'Disponible'
    });

    return res.status(201).json({
      mensaje: 'Vehículo registrado exitosamente.',
      data: nuevoVehiculo
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al registrar el vehículo.');
  }
};

// UPDATE - Actualizar un vehículo existente
exports.actualizarVehiculo = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del vehículo debe ser un número entero válido.' });
    }

    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${id} no encontrado.` });
    }

    const { marca, modelo, anio, placa, precio_dia, estado } = req.body;

    if (!marca || !modelo || anio === undefined || !placa || precio_dia === undefined || !estado) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: marca, modelo, anio, placa, precio_dia y estado.'
      });
    }

    const anioNum = Number(anio);
    const precioNum = Number(precio_dia);

    if (!Number.isInteger(anioNum) || anioNum < 1980 || anioNum > 2030) {
      return res.status(400).json({
        error: 'El año (anio) debe ser un número entero válido entre 1980 y 2030.'
      });
    }

    if (Number.isNaN(precioNum) || precioNum <= 0) {
      return res.status(400).json({
        error: 'El precio por día (precio_dia) debe ser un número mayor a 0.'
      });
    }

    await vehiculo.update({
      marca: String(marca).trim(),
      modelo: String(modelo).trim(),
      anio: anioNum,
      placa: String(placa).trim().toUpperCase(),
      precio_dia: precioNum,
      estado: String(estado).trim()
    });

    return res.status(200).json({
      mensaje: 'Vehículo actualizado exitosamente.',
      data: vehiculo
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al actualizar el vehículo.');
  }
};

// DELETE - Eliminar un vehículo
exports.eliminarVehiculo = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El ID del vehículo debe ser un número entero válido.' });
    }

    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${id} no encontrado.` });
    }

    const alquileresAsociados = await Alquiler.count({ where: { vehiculo_id: id } });
    if (alquileresAsociados > 0) {
      return res.status(400).json({
        error: `No se puede eliminar el vehículo porque tiene ${alquileresAsociados} alquiler(es) registrado(s).`
      });
    }

    await vehiculo.destroy();
    return res.status(200).json({
      mensaje: 'Vehículo eliminado correctamente.'
    });
  } catch (error) {
    return handleSequelizeError(res, error, 'Error interno al eliminar el vehículo.');
  }
};

