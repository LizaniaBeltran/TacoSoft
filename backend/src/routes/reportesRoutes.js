const express = require('express');
const reportes = require('../controllers/reportesController');

const router = express.Router();

router.get('/ventas-sucursal', reportes.ventasSucursal);
router.get('/productos-mas-vendidos', reportes.productosMasVendidos);
router.get('/ventas-categoria', reportes.ventasCategoria);
router.get('/rendimiento-empleados', reportes.rendimientoEmpleados);
router.get('/comparativo-mensual', reportes.comparativoMensual);
router.get('/productos-sin-movimiento', reportes.productosSinMovimiento);

module.exports = router;
