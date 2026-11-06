const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inspeccion = sequelize.define(
  'Inspeccion',
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
    empleado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empleados',
        key: 'id'
      }
    },
    tipo_inspeccion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Entrega'
    },
    kilometraje: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nivel_combustible: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'Lleno (100%)'
    },
    observaciones: {
      type: DataTypes.STRING(220),
      allowNull: false,
      defaultValue: 'Sin rayones ni abolladuras visibles.'
    }
  },
  {
    tableName: 'inspecciones',
    timestamps: false
  }
);

module.exports = Inspeccion;

