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

module.exports = {
  obtenerProductos
};