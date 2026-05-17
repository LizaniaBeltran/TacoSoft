const pool = require('../config/db');

const obtenerSucursales = async () => {

  const result = await pool.query(
    'SELECT * FROM sucursal'
  );

  return result.rows;
};

const crearSucursal = async ({ nombre, direccion, ciudad, telefono }) => {
  // Backend -> PostgreSQL: ejecuta procedimiento almacenado, no INSERT directo.
  await pool.query('CALL sp_crear_sucursal($1, $2, $3, $4)', [
    nombre,
    direccion,
    ciudad,
    telefono || null
  ]);

  const result = await pool.query('SELECT * FROM sucursal ORDER BY sucursal_id DESC LIMIT 1');
  return result.rows[0];
};

module.exports = {
  obtenerSucursales,
  crearSucursal
};
