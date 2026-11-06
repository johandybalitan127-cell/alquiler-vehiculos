const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define(
  'Cliente',
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
        notEmpty: { msg: 'El nombre del cliente es obligatorio.' }
      }
    },
    correo: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: {
        name: 'uk_clientes_correo',
        msg: 'El correo electrónico ya está registrado.'
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
    identificacion: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: {
        name: 'uk_clientes_identificacion',
        msg: 'El número de identificación ya está registrado.'
      },
      validate: {
        notEmpty: { msg: 'La identificación es obligatoria.' }
      }
    }
  },
  {
    tableName: 'clientes',
    timestamps: false
  }
);

module.exports = Cliente;

