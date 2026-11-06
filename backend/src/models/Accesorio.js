const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Accesorio = sequelize.define(
  'Accesorio',
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
    precio_diario_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock_disponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'Disponible'
    }
  },
  {
    tableName: 'accesorios',
    timestamps: false
  }
);

module.exports = Accesorio;

