const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const productosRoutes = require('./routes/productosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const sucursalesRoutes = require('./routes/sucursalesRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/sucursales', sucursalesRoutes);
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
