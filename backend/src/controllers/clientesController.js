const clientesService = require('../services/clientesService');

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await clientesService.obtenerClientes();
    res.json({ ok: true, data: clientes });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const crearCliente = async (req, res) => {
  try {
    const cliente = await clientesService.crearCliente(req.body);
    res.status(201).json({ ok: true, data: cliente });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

module.exports = { obtenerClientes, crearCliente };
