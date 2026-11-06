const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ReservaWeb = sequelize.define(
  'ReservaWeb',
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
    sucursal_retiro: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Sucursal Central, San José'
    },
    fecha_solicitada: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dias_estimados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    monto_estimado_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'Confirmada'
    }
  },
  {
    tableName: 'reservas_web',
    timestamps: false
  }
);

module.exports = ReservaWeb;

