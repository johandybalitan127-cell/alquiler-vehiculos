const { sequelize } = require('../config/database');
const Cliente = require('./Cliente');
const Vehiculo = require('./Vehiculo');
const Empleado = require('./Empleado');
const Alquiler = require('./Alquiler');
const Sucursal = require('./Sucursal');
const CategoriaVehiculo = require('./CategoriaVehiculo');
const Seguro = require('./Seguro');
const Pago = require('./Pago');
const Factura = require('./Factura');
const Mantenimiento = require('./Mantenimiento');
const Inspeccion = require('./Inspeccion');
const Multa = require('./Multa');
const Accesorio = require('./Accesorio');
const ReservaWeb = require('./ReservaWeb');
const Calificacion = require('./Calificacion');

// 1. Cliente <-> Alquiler
Cliente.hasMany(Alquiler, { foreignKey: 'cliente_id', as: 'alquileres', onDelete: 'RESTRICT' });
Alquiler.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// 2. Vehiculo <-> Alquiler
Vehiculo.hasMany(Alquiler, { foreignKey: 'vehiculo_id', as: 'alquileres', onDelete: 'RESTRICT' });
Alquiler.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

// 3. Empleado <-> Alquiler
Empleado.hasMany(Alquiler, { foreignKey: 'empleado_id', as: 'alquileres', onDelete: 'RESTRICT' });
Alquiler.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });

// 4. Alquiler <-> Pago
Alquiler.hasMany(Pago, { foreignKey: 'alquiler_id', as: 'pagos', onDelete: 'CASCADE' });
Pago.belongsTo(Alquiler, { foreignKey: 'alquiler_id', as: 'alquiler' });

// 5. Alquiler / Cliente <-> Factura
Alquiler.hasOne(Factura, { foreignKey: 'alquiler_id', as: 'factura', onDelete: 'CASCADE' });
Factura.belongsTo(Alquiler, { foreignKey: 'alquiler_id', as: 'alquiler' });
Cliente.hasMany(Factura, { foreignKey: 'cliente_id', as: 'facturas', onDelete: 'CASCADE' });
Factura.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// 6. Vehiculo <-> Mantenimiento
Vehiculo.hasMany(Mantenimiento, {
  foreignKey: 'vehiculo_id',
  as: 'mantenimientos',
  onDelete: 'CASCADE'
});
Mantenimiento.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

// 7. Alquiler / Vehiculo / Empleado <-> Inspeccion
Alquiler.hasMany(Inspeccion, { foreignKey: 'alquiler_id', as: 'inspecciones', onDelete: 'CASCADE' });
Inspeccion.belongsTo(Alquiler, { foreignKey: 'alquiler_id', as: 'alquiler' });
Vehiculo.hasMany(Inspeccion, { foreignKey: 'vehiculo_id', as: 'inspecciones', onDelete: 'CASCADE' });
Inspeccion.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
Empleado.hasMany(Inspeccion, { foreignKey: 'empleado_id', as: 'inspecciones', onDelete: 'CASCADE' });
Inspeccion.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });

// 8. Alquiler / Vehiculo <-> Multa
Alquiler.hasMany(Multa, { foreignKey: 'alquiler_id', as: 'multas', onDelete: 'CASCADE' });
Multa.belongsTo(Alquiler, { foreignKey: 'alquiler_id', as: 'alquiler' });
Vehiculo.hasMany(Multa, { foreignKey: 'vehiculo_id', as: 'multas', onDelete: 'CASCADE' });
Multa.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

// 9. Cliente / Vehiculo <-> ReservaWeb
Cliente.hasMany(ReservaWeb, { foreignKey: 'cliente_id', as: 'reservas_web', onDelete: 'CASCADE' });
ReservaWeb.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Vehiculo.hasMany(ReservaWeb, { foreignKey: 'vehiculo_id', as: 'reservas_web', onDelete: 'CASCADE' });
ReservaWeb.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

// 10. Cliente / Vehiculo / Alquiler <-> Calificacion
Cliente.hasMany(Calificacion, { foreignKey: 'cliente_id', as: 'calificaciones', onDelete: 'CASCADE' });
Calificacion.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Vehiculo.hasMany(Calificacion, { foreignKey: 'vehiculo_id', as: 'calificaciones', onDelete: 'CASCADE' });
Calificacion.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
Alquiler.hasMany(Calificacion, { foreignKey: 'alquiler_id', as: 'calificaciones', onDelete: 'CASCADE' });
Calificacion.belongsTo(Alquiler, { foreignKey: 'alquiler_id', as: 'alquiler' });

async function seedInitialData() {
  const clientesCount = await Cliente.count();
  if (clientesCount === 0) {
    const clientes = await Cliente.bulkCreate([
      {
        nombre: 'Carlos Mendoza Rivera',
        correo: 'carlos.mendoza@empresa.com',
        telefono: '+506 8845-1290',
        identificacion: '1-1452-0893'
      },
      {
        nombre: 'Valeria Gómez Solís',
        correo: 'valeria.gomez@corporativo.com',
        telefono: '+506 8721-4410',
        identificacion: '2-0784-0312'
      },
      {
        nombre: 'Roberto Alvarado Castro',
        correo: 'roberto.alvarado@logistica.com',
        telefono: '+506 8390-7765',
        identificacion: '1-1298-0554'
      },
      {
        nombre: 'Andrea Jiménez Mora',
        correo: 'andrea.jimenez@finanzas.com',
        telefono: '+506 8911-3022',
        identificacion: '4-0219-0987'
      }
    ]);

    const vehiculos = await Vehiculo.bulkCreate([
      {
        marca: 'Toyota',
        modelo: 'Corolla Cross XLE',
        anio: 2024,
        placa: 'ABC-104',
        precio_dia: 35000.00,
        estado: 'Alquilado'
      },
      {
        marca: 'BMW',
        modelo: '330i M Sport',
        anio: 2024,
        placa: 'LUX-889',
        precio_dia: 65000.00,
        estado: 'Disponible'
      },
      {
        marca: 'Hyundai',
        modelo: 'Tucson Limited',
        anio: 2023,
        placa: 'CRV-452',
        precio_dia: 40000.00,
        estado: 'Disponible'
      },
      {
        marca: 'Audi',
        modelo: 'Q5 Quattro S-Line',
        anio: 2024,
        placa: 'EXE-901',
        precio_dia: 75000.00,
        estado: 'Alquilado'
      },
      {
        marca: 'Kia',
        modelo: 'Sportage EX',
        anio: 2023,
        placa: 'KIA-307',
        precio_dia: 32000.00,
        estado: 'Mantenimiento'
      }
    ]);

    const empleados = await Empleado.bulkCreate([
      {
        nombre: 'Laura Fernández Vega',
        correo: 'lfernandez@autorent.com',
        telefono: '+506 2250-1001',
        cargo: 'Ejecutiva de Ventas Senior'
      },
      {
        nombre: 'Diego Ramírez Herrera',
        correo: 'dramirez@autorent.com',
        telefono: '+506 2250-1002',
        cargo: 'Coordinador de Flota'
      },
      {
        nombre: 'Sofía Vargas Navarro',
        correo: 'svargas@autorent.com',
        telefono: '+506 2250-1003',
        cargo: 'Asesora Comercial'
      }
    ]);

    await Alquiler.bulkCreate([
      {
        cliente_id: clientes[0].id,
        vehiculo_id: vehiculos[0].id,
        empleado_id: empleados[0].id,
        fecha_inicio: '2026-11-01',
        fecha_fin: '2026-11-06',
        total: 175000.00,
        estado: 'Activo'
      },
      {
        cliente_id: clientes[1].id,
        vehiculo_id: vehiculos[3].id,
        empleado_id: empleados[2].id,
        fecha_inicio: '2026-11-03',
        fecha_fin: '2026-11-08',
        total: 375000.00,
        estado: 'Activo'
      },
      {
        cliente_id: clientes[2].id,
        vehiculo_id: vehiculos[1].id,
        empleado_id: empleados[1].id,
        fecha_inicio: '2026-10-20',
        fecha_fin: '2026-10-24',
        total: 260000.00,
        estado: 'Finalizado'
      }
    ]);
  }

  // Semilla para las entidades #5 a #15 si están vacías
  if ((await Sucursal.count()) === 0) {
    await Sucursal.bulkCreate([
      {
        nombre: 'Sucursal Central Paseo Colón',
        provincia: 'San José',
        direccion: 'Avenida Segunda, Paseo Colón, frente a Torre Mercedes',
        telefono: '+506 2250-1000',
        horario: 'Lunes a Domingo · 6:00 a.m. - 9:00 p.m.'
      },
      {
        nombre: 'Sucursal Aeropuerto Juan Santamaría',
        provincia: 'Alajuela',
        direccion: 'costado oeste Terminal Internacional SJO',
        telefono: '+506 2440-8800',
        horario: 'Abierto 24 horas'
      },
      {
        nombre: 'Sucursal Guanacaste Liberia',
        provincia: 'Guanacaste',
        direccion: 'Boulevard Aeropuerto Daniel Oduber Quirós',
        telefono: '+506 2666-4500',
        horario: 'Lunes a Domingo · 6:00 a.m. - 10:00 p.m.'
      }
    ]);
  }

  if ((await CategoriaVehiculo.count()) === 0) {
    await CategoriaVehiculo.bulkCreate([
      {
        nombre: 'SUV Compacto & Familiar',
        descripcion: 'Unidades amplias con tracción inteligente e ideal para carretera.',
        tarifa_base_colones: 35000,
        deposito_garantia: 150000
      },
      {
        nombre: 'Sedán Ejecutivo Luxury',
        descripcion: 'Vehículos premium para viajes de negocios y eventos corporativos.',
        tarifa_base_colones: 65000,
        deposito_garantia: 250000
      },
      {
        nombre: 'SUV Premium 4x4',
        descripcion: 'Máximo confort, potencia y seguridad en todo terreno.',
        tarifa_base_colones: 75000,
        deposito_garantia: 300000
      }
    ]);
  }

  if ((await Seguro.count()) === 0) {
    await Seguro.bulkCreate([
      {
        nombre_cobertura: 'Cobertura Básica Obligatoria (SLI)',
        tipo: 'Básico',
        costo_diario_colones: 6500,
        deducible_colones: 250000,
        descripcion: 'Responsabilidad civil por daños a terceros y colisión básica.'
      },
      {
        nombre_cobertura: 'Cobertura Total Cero Deducible (Full Cover)',
        tipo: 'Premium',
        costo_diario_colones: 14500,
        deducible_colones: 0,
        descripcion: 'Protección total contra colisión, robo, cristales y asistencia 24/7 en ruta.'
      }
    ]);
  }

  if ((await Accesorio.count()) === 0) {
    await Accesorio.bulkCreate([
      {
        nombre: 'Silla de Seguridad Infantil ISOFIX',
        precio_diario_colones: 3500,
        stock_disponible: 12,
        estado: 'Disponible'
      },
      {
        nombre: 'Router Wi-Fi Móvil 5G Ilimitado',
        precio_diario_colones: 4500,
        stock_disponible: 15,
        estado: 'Disponible'
      },
      {
        nombre: 'Navegador GPS Garmin Costa Rica',
        precio_diario_colones: 3000,
        stock_disponible: 8,
        estado: 'Disponible'
      },
      {
        nombre: 'Rack Portaequipaje de Techo',
        precio_diario_colones: 5000,
        stock_disponible: 6,
        estado: 'Disponible'
      }
    ]);
  }

  // Obtener IDs reales para entidades relacionales dependientes
  const primerAlquiler = await Alquiler.findOne({ order: [['id', 'ASC']] });
  const primerCliente = await Cliente.findOne({ order: [['id', 'ASC']] });
  const primerVehiculo = await Vehiculo.findOne({ order: [['id', 'ASC']] });
  const primerEmpleado = await Empleado.findOne({ order: [['id', 'ASC']] });

  if (primerAlquiler && primerCliente && primerVehiculo && primerEmpleado) {
    if ((await Pago.count()) === 0) {
      await Pago.bulkCreate([
        {
          alquiler_id: primerAlquiler.id,
          monto_colones: 175000,
          metodo_pago: 'Tarjeta Corporativa Visa',
          referencia: 'AUT-994812',
          fecha_pago: '2026-11-01',
          estado: 'Aplicado'
        },
        {
          alquiler_id: primerAlquiler.id,
          monto_colones: 50000,
          metodo_pago: 'SINPE Móvil',
          referencia: 'SNP-448102',
          fecha_pago: '2026-11-02',
          estado: 'Depósito Garantía'
        }
      ]);
    }

    if ((await Factura.count()) === 0) {
      await Factura.bulkCreate([
        {
          numero_factura: 'FE-0010000145',
          alquiler_id: primerAlquiler.id,
          cliente_id: primerCliente.id,
          subtotal_colones: 154867.26,
          iva_colones: 20132.74,
          total_colones: 175000.00,
          fecha_emision: '2026-11-01'
        }
      ]);
    }

    if ((await Mantenimiento.count()) === 0) {
      await Mantenimiento.bulkCreate([
        {
          vehiculo_id: primerVehiculo.id,
          tipo_servicio: 'Cambio de aceite sintético, filtros y alineamiento',
          taller_proveedor: 'Taller Autorizado AutoFios Service',
          costo_colones: 68000,
          fecha_ingreso: '2026-10-25',
          fecha_salida: '2026-10-26',
          estado: 'Completado'
        }
      ]);
    }

    if ((await Inspeccion.count()) === 0) {
      await Inspeccion.bulkCreate([
        {
          alquiler_id: primerAlquiler.id,
          vehiculo_id: primerVehiculo.id,
          empleado_id: primerEmpleado.id,
          tipo_inspeccion: 'Entrega Inicial',
          kilometraje: 14250,
          nivel_combustible: 'Lleno (100%)',
          observaciones: 'Carrocería impecable, llanta de repuesto y kit de emergencia completos.'
        }
      ]);
    }

    if ((await Multa.count()) === 0) {
      await Multa.bulkCreate([
        {
          alquiler_id: primerAlquiler.id,
          vehiculo_id: primerVehiculo.id,
          concepto: 'Peaje electrónico Ruta 27 no cancelado',
          monto_colones: 8500,
          fecha_infraccion: '2026-11-03',
          estado: 'Pagada'
        }
      ]);
    }

    if ((await ReservaWeb.count()) === 0) {
      await ReservaWeb.bulkCreate([
        {
          cliente_id: primerCliente.id,
          vehiculo_id: primerVehiculo.id,
          sucursal_retiro: 'Sucursal Aeropuerto Juan Santamaría',
          fecha_solicitada: '2026-11-15',
          dias_estimados: 4,
          monto_estimado_colones: 140000,
          estado: 'Confirmada'
        }
      ]);
    }

    if ((await Calificacion.count()) === 0) {
      await Calificacion.bulkCreate([
        {
          cliente_id: primerCliente.id,
          vehiculo_id: primerVehiculo.id,
          alquiler_id: primerAlquiler.id,
          puntuacion: 5,
          comentario: 'Excelente atención en Rent Car Fios, el vehículo estaba impecable y puntual.',
          fecha: '2026-11-04'
        }
      ]);
    }
  }
}

module.exports = {
  sequelize,
  Cliente,
  Vehiculo,
  Empleado,
  Alquiler,
  Sucursal,
  CategoriaVehiculo,
  Seguro,
  Pago,
  Factura,
  Mantenimiento,
  Inspeccion,
  Multa,
  Accesorio,
  ReservaWeb,
  Calificacion,
  seedInitialData
};
