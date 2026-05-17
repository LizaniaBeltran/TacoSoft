const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const productosRoutes = require('./routes/productosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const sucursalesRoutes = require('./routes/sucursalesRoutes');
const empleadosRoutes = require('./routes/empleadosRoutes');
const promocionesRoutes = require('./routes/promocionesRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/clientes', clientesRoutes);
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      ok: true,
      fecha: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.send('API TacoSoft funcionando');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
