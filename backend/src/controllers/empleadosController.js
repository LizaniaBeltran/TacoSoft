const empleadosService = require('../services/empleadosService');

const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await empleadosService.obtenerEmpleados();
    res.json({ ok: true, data: empleados });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const crearEmpleado = async (req, res) => {
  try {
    const empleado = await empleadosService.crearEmpleado(req.body);
    res.status(201).json({ ok: true, data: empleado });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

module.exports = { obtenerEmpleados, crearEmpleado };
