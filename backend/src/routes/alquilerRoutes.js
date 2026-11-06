const express = require('express');
const router = express.Router();
const alquilerController = require('../controllers/alquilerController');

router.get('/', alquilerController.obtenerAlquileres);
router.get('/:id', alquilerController.obtenerAlquilerPorId);
router.post('/', alquilerController.crearAlquiler);
router.put('/:id', alquilerController.actualizarAlquiler);
router.delete('/:id', alquilerController.eliminarAlquiler);

module.exports = router;

