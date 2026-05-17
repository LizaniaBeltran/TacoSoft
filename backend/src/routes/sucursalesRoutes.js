const express = require('express');

const router = express.Router();

const {
  obtenerSucursales
} = require('../controllers/sucursalesController');

router.get('/', obtenerSucursales);

module.exports = router;