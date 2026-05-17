const express = require('express');
const { obtenerClientes, crearCliente } = require('../controllers/clientesController');

const router = express.Router();

router.get('/', obtenerClientes);
router.post('/', crearCliente);

module.exports = router;
