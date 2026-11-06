const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaVehiculo = sequelize.define(
  'CategoriaVehiculo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    tarifa_base_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    deposito_garantia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    tableName: 'categorias_vehiculo',
    timestamps: false
  }
);

module.exports = CategoriaVehiculo;

