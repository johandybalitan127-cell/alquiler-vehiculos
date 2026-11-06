const { Op } = require('sequelize');
const { Cliente, Vehiculo, Empleado, Alquiler } = require('../models');

// Controlador #9: Búsqueda global multicriterio en todas las entidades
exports.buscarEnSistema = async (req, res) => {
  try {
    const termino = String(req.query.q || '').trim();
    if (!termino) {
      return res.status(400).json({
        error: 'Debe proporcionar un término de búsqueda en el parámetro ?q='
      });
    }

    const likeQuery = { [Op.like]: `%${termino}%` };

    const [clientes, vehiculos, empleados, alquileres] = await Promise.all([
      Cliente.findAll({
        where: {
          [Op.or]: [
            { nombre: likeQuery },
            { correo: likeQuery },
            { identificacion: likeQuery },
            { telefono: likeQuery }
          ]
        }
      }),
      Vehiculo.findAll({
        where: {
          [Op.or]: [
            { marca: likeQuery },
            { modelo: likeQuery },
            { placa: likeQuery },
            { estado: likeQuery }
          ]
        }
      }),
      Empleado.findAll({
        where: {
          [Op.or]: [
            { nombre: likeQuery },
            { correo: likeQuery },
            { cargo: likeQuery }
          ]
        }
      }),
      Alquiler.findAll({
        where: {
          estado: likeQuery
        },
        include: [
          { model: Cliente, as: 'cliente' },
          { model: Vehiculo, as: 'vehiculo' }
        ]
      })
    ]);

    return res.status(200).json({
      termino,
      total_coincidencias:
        clientes.length + vehiculos.length + empleados.length + alquileres.length,
      resultados: {
        clientes,
        vehiculos,
        empleados,
        alquileres
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al realizar la búsqueda global.',
      detalle: error.message
    });
  }
};

