const express = require('express');
const { obtenerPromociones, crearPromocion } = require('../controllers/promocionesController');

const router = express.Router();

router.get('/', obtenerPromociones);
router.post('/', crearPromocion);

module.exports = router;
