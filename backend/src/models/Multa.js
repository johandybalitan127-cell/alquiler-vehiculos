const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Multa = sequelize.define(
  'Multa',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alquiler_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alquileres',
        key: 'id'
      }
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehiculos',
        key: 'id'
      }
    },
    concepto: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    monto_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_infraccion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'Pendiente'
    }
  },
  {
    tableName: 'multas',
    timestamps: false
  }
);

module.exports = Multa;

