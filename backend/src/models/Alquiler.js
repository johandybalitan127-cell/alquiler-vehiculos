const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alquiler = sequelize.define(
  'Alquiler',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      },
      validate: {
        isInt: { msg: 'El ID del cliente debe ser un número entero.' }
      }
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehiculos',
        key: 'id'
      },
      validate: {
        isInt: { msg: 'El ID del vehículo debe ser un número entero.' }
      }
    },
    empleado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empleados',
        key: 'id'
      },
      validate: {
        isInt: { msg: 'El ID del empleado debe ser un número entero.' }
      }
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'La fecha de inicio debe ser una fecha válida (YYYY-MM-DD).' }
      }
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'La fecha de fin debe ser una fecha válida (YYYY-MM-DD).' }
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'El total debe ser un valor numérico válido.' },
        min: { args: [0.01], msg: 'El total del alquiler debe ser mayor a 0.' }
      }
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'Activo',
      validate: {
        notEmpty: { msg: 'El estado del alquiler es obligatorio.' },
        isIn: {
          args: [['Activo', 'Finalizado', 'Cancelado']],
          msg: 'El estado debe ser Activo, Finalizado o Cancelado.'
        }
      }
    }
  },
  {
    tableName: 'alquileres',
    timestamps: false
  }
);

module.exports = Alquiler;

