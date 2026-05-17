const reportesService = require('../services/reportesService');

const handler = (serviceFn) => async (req, res) => {
  try {
    const data = await serviceFn(req.query);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  ventasSucursal: handler(reportesService.ventasSucursal),
  productosMasVendidos: handler(reportesService.productosMasVendidos),
  ventasCategoria: handler(reportesService.ventasCategoria),
  rendimientoEmpleados: handler(reportesService.rendimientoEmpleados),
  comparativoMensual: handler(reportesService.comparativoMensual),
  productosSinMovimiento: handler(reportesService.productosSinMovimiento)
};
