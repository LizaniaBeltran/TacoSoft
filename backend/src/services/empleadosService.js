const pool = require('../config/db');

const obtenerEmpleados = async () => {
  // Backend consulta PostgreSQL para poblar vistas administrativas.
  const result = await pool.query('SELECT * FROM empleado ORDER BY empleado_id');
  return result.rows;
};

const crearEmpleado = async ({ nombre_completo, telefono, puesto, sucursal_id, salario_quincenal, fecha_ingreso }) => {
  // Backend -> PostgreSQL: ejecuta procedimiento almacenado, no INSERT directo.
  await pool.query('CALL sp_crear_empleado($1, $2, $3, $4, $5, $6)', [
    nombre_completo,
    telefono || null,
    puesto,
    Number(sucursal_id),
    Number(salario_quincenal || 0),
    fecha_ingreso || new Date().toISOString().slice(0, 10)
  ]);

  const result = await pool.query('SELECT * FROM empleado ORDER BY empleado_id DESC LIMIT 1');
  return result.rows[0];
};

module.exports = { obtenerEmpleados, crearEmpleado };
