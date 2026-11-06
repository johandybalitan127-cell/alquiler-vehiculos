const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Empleado = sequelize.define(
  'Empleado',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del empleado es obligatorio.' }
      }
    },
    correo: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: {
        name: 'uk_empleados_correo',
        msg: 'El correo electrónico del empleado ya está registrado.'
      },
      validate: {
        notEmpty: { msg: 'El correo electrónico es obligatorio.' },
        isEmail: { msg: 'Debe proporcionar un correo electrónico válido.' }
      }
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El teléfono es obligatorio.' }
      }
    },
    cargo: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El cargo del empleado es obligatorio.' }
      }
    }
  },
  {
    tableName: 'empleados',
    timestamps: false
  }
);

module.exports = Empleado;

