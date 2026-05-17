const categoriasService = require('../services/categoriasService');

const obtenerCategorias = async (req, res) => {

  try {

    const categorias = await categoriasService.obtenerCategorias();

    res.json({
      ok: true,
      data: categorias
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

module.exports = {
  obtenerCategorias
};