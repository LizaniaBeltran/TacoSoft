const pool = require('../config/db');

const obtenerCategorias = async () => {

  const result = await pool.query(
    'SELECT * FROM categoria'
  );

  return result.rows;
};

const crearCategoria = async ({ nombre, descripcion }) => {
  // Backend -> PostgreSQL: ejecuta procedimiento almacenado, no INSERT directo.
  await pool.query('CALL sp_crear_categoria($1, $2)', [nombre, descripcion || null]);
  const result = await pool.query('SELECT * FROM categoria ORDER BY categoria_id DESC LIMIT 1');
  return result.rows[0];
};

module.exports = {
  obtenerCategorias,
  crearCategoria
};
