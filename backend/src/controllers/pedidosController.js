const pedidosService = require('../services/pedidosService');

const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await pedidosService.obtenerPedidos();
    res.json({ ok: true, data: pedidos });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const obtenerDetallePedido = async (req, res) => {
  try {
    const detalle = await pedidosService.obtenerDetallePedido();
    res.json({ ok: true, data: detalle });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const crearPedido = async (req, res) => {
  try {
    const pedido = await pedidosService.crearPedido(req.body);
    res.status(201).json({ ok: true, data: pedido });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

const agregarProductoPedido = async (req, res) => {
  try {
    const pedido = await pedidosService.agregarProductoPedido(req.params.id, req.body);
    res.status(201).json({ ok: true, data: pedido });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

const aplicarPromocion = async (req, res) => {
  try {
    const pedido = await pedidosService.aplicarPromocion(req.params.id, req.body);
    res.json({ ok: true, data: pedido });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

const cancelarPedido = async (req, res) => {
  try {
    const pedido = await pedidosService.cancelarPedido(req.params.id);
    res.json({ ok: true, data: pedido });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

const prepararPedido = async (req, res) => {
  try {
    const pedido = await pedidosService.prepararPedido(req.params.id);
    res.json({ ok: true, data: pedido });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

const marcarPedidoListo = async (req, res) => {
  try {
    const pedido = await pedidosService.marcarPedidoListo(req.params.id);
    res.json({ ok: true, data: pedido });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

const entregarPedido = async (req, res) => {
  try {
    const pedido = await pedidosService.entregarPedido(req.params.id);
    res.json({ ok: true, data: pedido });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

module.exports = {
  obtenerPedidos,
  obtenerDetallePedido,
  crearPedido,
  agregarProductoPedido,
  aplicarPromocion,
  cancelarPedido,
  prepararPedido,
  marcarPedidoListo,
  entregarPedido
};
