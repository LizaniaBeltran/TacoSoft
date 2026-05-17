const pool = require('../config/db');

const obtenerPromociones = async () => {
  // Backend consulta PostgreSQL para mostrar promociones y productos aplicados.
  const result = await pool.query(`
    SELECT p.*, COALESCE(array_agg(pp.producto_id) FILTER (WHERE pp.producto_id IS NOT NULL), '{}') AS productos
    FROM promocion p
    LEFT JOIN promocion_producto pp ON pp.promocion_id = p.promocion_id
    GROUP BY p.promocion_id
    ORDER BY p.promocion_id
  `);
  return result.rows;
};

const crearPromocion = async ({ nombre, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin, productos = [] }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    // Backend -> PostgreSQL: ejecuta procedimiento almacenado, no INSERT directo.
    await client.query('CALL sp_crear_promocion($1, $2, $3, $4, $5)', [
      nombre,
      descripcion || null,
      Number(porcentaje_descuento),
      fecha_inicio,
      fecha_fin
    ]);

    const promoResult = await client.query("SELECT currval(pg_get_serial_sequence('promocion','promocion_id')) AS promocion_id");
    const promocionId = Number(promoResult.rows[0].promocion_id);

    for (const productoId of productos) {
      await client.query('CALL sp_agregar_producto_promocion($1, $2)', [promocionId, Number(productoId)]);
    }

    await client.query('COMMIT');
    const result = await pool.query('SELECT * FROM promocion WHERE promocion_id = $1', [promocionId]);
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { obtenerPromociones, crearPromocion };
