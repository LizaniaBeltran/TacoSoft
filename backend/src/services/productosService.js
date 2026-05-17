const pool = require('../config/db');

const obtenerProductos = async () => {

  const result = await pool.query(
    'SELECT * FROM producto'
  );

  return result.rows;
};

const crearProducto = async ({ nombre, descripcion, categoria_id, precio_actual, costo_preparacion }) => {
  // Backend -> PostgreSQL: ejecuta procedimiento almacenado, no INSERT directo.
  await pool.query('CALL sp_crear_producto($1, $2, $3, $4, $5)', [
    nombre,
    descripcion || null,
    Number(categoria_id),
    Number(precio_actual),
    Number(costo_preparacion)
  ]);

  const result = await pool.query('SELECT * FROM producto ORDER BY producto_id DESC LIMIT 1');
  return result.rows[0];
};

module.exports = {
  obtenerProductos,
  crearProducto
};
