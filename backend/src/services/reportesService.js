const pool = require('../config/db');

const params = ({ fecha_inicio, fecha_fin, sucursal_id }) => [
  fecha_inicio || null,
  fecha_fin || null,
  sucursal_id ? Number(sucursal_id) : null
];

const runReport = async (functionName, query) => {
  // Backend consulta PostgreSQL ejecutando funciones de reporte con GROUP BY/JOIN/HAVING.
  const result = await pool.query(`SELECT * FROM ${functionName}($1, $2, $3)`, params(query));
  return result.rows;
};

module.exports = {
  ventasSucursal: (query) => runReport('sp_reporte_ventas_sucursal', query),
  productosMasVendidos: (query) => runReport('sp_productos_mas_vendidos', query),
  ventasCategoria: (query) => runReport('sp_ventas_categoria', query),
  rendimientoEmpleados: (query) => runReport('sp_rendimiento_empleados', query),
  comparativoMensual: (query) => runReport('sp_comparativo_mensual', query),
  productosSinMovimiento: (query) => runReport('sp_productos_sin_movimiento', query)
};
