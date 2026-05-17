const express = require('express');

const router = express.Router();

const {
  obtenerSucursales,
  crearSucursal
} = require('../controllers/sucursalesController');

router.get('/', obtenerSucursales);
router.post('/', crearSucursal);

module.exports = router;
