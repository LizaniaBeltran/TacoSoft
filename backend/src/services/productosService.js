const pool = require('../config/db');

const obtenerProductos = async () => {

  const result = await pool.query(
    'SELECT * FROM producto'
  );

  return result.rows;
};

module.exports = {
  obtenerProductos
};