const productosService = require('../services/productosService');

const obtenerProductos = async (req, res) => {
  try {

    const productos = await productosService.obtenerProductos();

    res.json({
      ok: true,
      data: productos
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const crearProducto = async (req, res) => {
  try {
    const producto = await productosService.crearProducto(req.body);
    res.status(201).json({ ok: true, data: producto });
  } catch (error) {
    console.error(error);
    res.status(400).json({ ok: false, error: error.message });
  }
};

module.exports = {
  obtenerProductos,
  crearProducto
};
