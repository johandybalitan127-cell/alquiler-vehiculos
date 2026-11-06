const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seguro = sequelize.define(
  'Seguro',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_cobertura: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    costo_diario_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    deducible_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  },
  {
    tableName: 'seguros',
    timestamps: false
  }
);

module.exports = Seguro;

