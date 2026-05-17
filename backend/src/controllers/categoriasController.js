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

const crearCategoria = async (req, res) => {
  try {
    const categoria = await categoriasService.crearCategoria(req.body);
    res.status(201).json({ ok: true, data: categoria });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

module.exports = {
  obtenerCategorias,
  crearCategoria
};
