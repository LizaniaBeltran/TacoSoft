const pool = require('../config/db');

const obtenerCategorias = async () => {

  const result = await pool.query(
    'SELECT * FROM categoria'
  );

  return result.rows;
};

module.exports = {
  obtenerCategorias
};