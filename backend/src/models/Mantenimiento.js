const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mantenimiento = sequelize.define(
  'Mantenimiento',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehiculos',
        key: 'id'
      }
    },
    tipo_servicio: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    taller_proveedor: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    costo_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_salida: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'En Proceso'
    }
  },
  {
    tableName: 'mantenimientos',
    timestamps: false
  }
);

module.exports = Mantenimiento;

