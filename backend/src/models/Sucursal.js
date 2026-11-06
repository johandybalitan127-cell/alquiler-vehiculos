const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sucursal = sequelize.define(
  'Sucursal',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    provincia: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(180),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    horario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Lunes a Sábado 7:00 a.m. - 7:00 p.m.'
    }
  },
  {
    tableName: 'sucursales',
    timestamps: false
  }
);

module.exports = Sucursal;

