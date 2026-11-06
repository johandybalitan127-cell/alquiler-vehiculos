const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Factura = sequelize.define(
  'Factura',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_factura: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    alquiler_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alquileres',
        key: 'id'
      }
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    subtotal_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    iva_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_emision: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    tableName: 'facturas',
    timestamps: false
  }
);

module.exports = Factura;

