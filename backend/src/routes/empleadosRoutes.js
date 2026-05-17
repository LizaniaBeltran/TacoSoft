const express = require('express');
const { obtenerEmpleados, crearEmpleado } = require('../controllers/empleadosController');

const router = express.Router();

router.get('/', obtenerEmpleados);
router.post('/', crearEmpleado);

module.exports = router;
