const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Calificacion = sequelize.define(
  'Calificacion',
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
    alquiler_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alquileres',
        key: 'id'
      }
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    comentario: {
      type: DataTypes.STRING(220),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    tableName: 'calificaciones',
    timestamps: false
  }
);

module.exports = Calificacion;

