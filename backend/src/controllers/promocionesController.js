const promocionesService = require('../services/promocionesService');

const obtenerPromociones = async (req, res) => {
  try {
    const promociones = await promocionesService.obtenerPromociones();
    res.json({ ok: true, data: promociones });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const crearPromocion = async (req, res) => {
  try {
    const promocion = await promocionesService.crearPromocion(req.body);
    res.status(201).json({
      ok: true,
      message: 'Promoción guardada correctamente',
      data: promocion
    });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

module.exports = { obtenerPromociones, crearPromocion };
