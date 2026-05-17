const express = require('express');
const {
  obtenerPedidos,
  obtenerDetallePedido,
  crearPedido,
  agregarProductoPedido,
  aplicarPromocion,
  cancelarPedido,
  prepararPedido,
  marcarPedidoListo,
  entregarPedido
} = require('../controllers/pedidosController');

const router = express.Router();

router.get('/', obtenerPedidos);
router.get('/detalle', obtenerDetallePedido);
router.post('/', crearPedido);
router.post('/:id/productos', agregarProductoPedido);
router.post('/:id/promocion', aplicarPromocion);
router.patch('/:id/preparar', prepararPedido);
router.patch('/:id/listo', marcarPedidoListo);
router.patch('/:id/entregar', entregarPedido);
router.patch('/:id/cancelar', cancelarPedido);

module.exports = router;
