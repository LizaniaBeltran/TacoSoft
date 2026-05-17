const pool = require('../config/db');

const obtenerClientes = async () => {
  // Backend consulta PostgreSQL para evitar enviar cliente_id inexistentes al pedido.
  const result = await pool.query('SELECT * FROM cliente ORDER BY cliente_id');
  return result.rows;
};

const crearCliente = async ({ nombre, telefono, correo, ciudad }) => {
  // Garantiza el procedimiento requerido para guardar clientes usando CALL.
  await pool.query(`
    CREATE OR REPLACE PROCEDURE sp_crear_cliente(
      p_nombre VARCHAR,
      p_telefono VARCHAR,
      p_correo VARCHAR,
      p_ciudad VARCHAR
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
        RAISE EXCEPTION 'El nombre del cliente no puede estar vacío';
      END IF;

      INSERT INTO cliente(nombre, telefono, correo, ciudad)
      VALUES(p_nombre, p_telefono, p_correo, p_ciudad);
    END;
    $$;
  `);

  // Backend -> PostgreSQL: ejecuta procedimiento almacenado, no INSERT directo desde la ruta.
  await pool.query('CALL sp_crear_cliente($1, $2, $3, $4)', [
    nombre,
    telefono || null,
    correo || null,
    ciudad || null
  ]);

  const result = await pool.query('SELECT * FROM cliente ORDER BY cliente_id DESC LIMIT 1');
  return result.rows[0];
};

module.exports = { obtenerClientes, crearCliente };
