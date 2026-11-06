const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehiculo = sequelize.define(
  'Vehiculo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    marca: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La marca del vehículo es obligatoria.' }
      }
    },
    modelo: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El modelo del vehículo es obligatorio.' }
      }
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'El año debe ser un número entero.' },
        min: { args: [1980], msg: 'El año del vehículo no puede ser menor a 1980.' },
        max: { args: [2030], msg: 'El año del vehículo no es válido.' }
      }
    },
    placa: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        name: 'uk_vehiculos_placa',
        msg: 'La placa del vehículo ya está registrada.'
      },
      validate: {
        notEmpty: { msg: 'La placa es obligatoria.' }
      }
    },
    precio_dia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'El precio por día debe ser un valor numérico válido.' },
        min: { args: [0.01], msg: 'El precio por día debe ser mayor a 0.' }
      }
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'Disponible',
      validate: {
        notEmpty: { msg: 'El estado del vehículo es obligatorio.' },
        isIn: {
          args: [['Disponible', 'Alquilado', 'Mantenimiento']],
          msg: 'El estado debe ser Disponible, Alquilado o Mantenimiento.'
        }
      }
    }
  },
  {
    tableName: 'vehiculos',
    timestamps: false
  }
);

module.exports = Vehiculo;

