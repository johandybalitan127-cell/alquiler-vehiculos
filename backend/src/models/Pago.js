const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pago = sequelize.define(
  'Pago',
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
    monto_colones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    metodo_pago: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'SINPE Móvil'
    },
    referencia: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    fecha_pago: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'Aplicado'
    }
  },
  {
    tableName: 'pagos',
    timestamps: false
  }
);

module.exports = Pago;

