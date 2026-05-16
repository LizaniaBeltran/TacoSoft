const express = require('express');

const router = express.Router();

const {
  obtenerProductos
} = require('../controllers/productosController');

router.get('/', obtenerProductos);

module.exports = router;