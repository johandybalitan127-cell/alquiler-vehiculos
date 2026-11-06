// Controlador #15: Gestión del perfil corporativo de la agencia AutoRent
let perfilCorporativo = {
  nombre: 'Rent Car Fios',
  rol: 'Perfil Oficial · Administración General',
  correo: 'administracion@rentcarfios.cr',
  telefono: '+506 2250-1000',
  sucursal: 'Sucursal Central, San José',
  horario: 'Lunes a Sábado · 7:00 a.m. – 7:00 p.m.',
  biografia:
    'Rent Car Fios — Agencia especializada en alquiler de vehículos ejecutivos, SUV y flota corporativa en Costa Rica.',
  avatar: '/logo-autorent.svg?v=fios',
  moneda: 'CRC (₡ Colones)'
};

exports.obtenerPerfilAgencia = async (req, res) => {
  try {
    return res.status(200).json(perfilCorporativo);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener la información del perfil de la agencia.',
      detalle: error.message
    });
  }
};

exports.actualizarPerfilAgencia = async (req, res) => {
  try {
    const { nombre, rol, correo, telefono, sucursal, horario, biografia, avatar } = req.body;

    if (!nombre || !correo) {
      return res.status(400).json({
        error: 'El nombre y el correo electrónico del perfil son obligatorios.'
      });
    }

    perfilCorporativo = {
      ...perfilCorporativo,
      nombre: String(nombre).trim(),
      rol: rol ? String(rol).trim() : perfilCorporativo.rol,
      correo: String(correo).trim(),
      telefono: telefono ? String(telefono).trim() : perfilCorporativo.telefono,
      sucursal: sucursal ? String(sucursal).trim() : perfilCorporativo.sucursal,
      horario: horario ? String(horario).trim() : perfilCorporativo.horario,
      biografia: biografia !== undefined ? String(biografia).trim() : perfilCorporativo.biografia,
      avatar: avatar || perfilCorporativo.avatar
    };

    return res.status(200).json({
      mensaje: 'Perfil corporativo actualizado correctamente en el servidor.',
      data: perfilCorporativo
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al actualizar el perfil de la agencia.',
      detalle: error.message
    });
  }
};

