const sucursalesService = require('../services/sucursalesService');

const obtenerSucursales = async (req, res) => {

  try {

    const sucursales = await sucursalesService.obtenerSucursales();

    res.json({
      ok: true,
      data: sucursales
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

const crearSucursal = async (req, res) => {
  try {
    const sucursal = await sucursalesService.crearSucursal(req.body);
    res.status(201).json({ ok: true, data: sucursal });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

module.exports = {
  obtenerSucursales,
  crearSucursal
};
