const pool = require('../config/db');

const obtenerSucursales = async () => {

  const result = await pool.query(
    'SELECT * FROM sucursal'
  );

  return result.rows;
};

module.exports = {
  obtenerSucursales
};