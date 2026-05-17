const pool = require('../config/db');

const obtenerPedidos = async () => {
  // Backend consulta PostgreSQL para dashboard/reportes.
  const result = await pool.query('SELECT * FROM pedido ORDER BY pedido_id DESC');
  return result.rows;
};

const obtenerDetallePedido = async () => {
  const result = await pool.query('SELECT * FROM detalle_pedido ORDER BY detalle_id DESC');
  return result.rows;
};

const ensurePedidoStatusProcedures = async () => {
  // Backend prepara procedimientos almacenados para el flujo real de estatus.
  await pool.query(`
    CREATE OR REPLACE PROCEDURE sp_preparar_pedido(p_pedido_id INT)
    LANGUAGE plpgsql
    AS $$
    DECLARE v_estatus VARCHAR(30);
    BEGIN
      SELECT estatus INTO v_estatus FROM pedido WHERE pedido_id = p_pedido_id;
      IF v_estatus IS NULL THEN RAISE EXCEPTION 'El pedido no existe'; END IF;
      IF v_estatus <> 'pendiente' THEN RAISE EXCEPTION 'Solo los pedidos pendientes pueden pasar a preparando'; END IF;
      UPDATE pedido SET estatus = 'preparando' WHERE pedido_id = p_pedido_id;
    END;
    $$;

    CREATE OR REPLACE PROCEDURE sp_marcar_pedido_listo(p_pedido_id INT)
    LANGUAGE plpgsql
    AS $$
    DECLARE v_estatus VARCHAR(30);
    BEGIN
      SELECT estatus INTO v_estatus FROM pedido WHERE pedido_id = p_pedido_id;
      IF v_estatus IS NULL THEN RAISE EXCEPTION 'El pedido no existe'; END IF;
      IF v_estatus <> 'preparando' THEN RAISE EXCEPTION 'Solo los pedidos preparando pueden pasar a listo'; END IF;
      UPDATE pedido SET estatus = 'listo' WHERE pedido_id = p_pedido_id;
    END;
    $$;

    CREATE OR REPLACE PROCEDURE sp_entregar_pedido(p_pedido_id INT)
    LANGUAGE plpgsql
    AS $$
    DECLARE v_estatus VARCHAR(30);
    BEGIN
      SELECT estatus INTO v_estatus FROM pedido WHERE pedido_id = p_pedido_id;
      IF v_estatus IS NULL THEN RAISE EXCEPTION 'El pedido no existe'; END IF;
      IF v_estatus <> 'listo' THEN RAISE EXCEPTION 'Solo los pedidos listos pueden pasar a entregado'; END IF;
      UPDATE pedido SET estatus = 'entregado' WHERE pedido_id = p_pedido_id;
    END;
    $$;
  `);
};

const obtenerPedido = async (pedidoId) => {
  const result = await pool.query('SELECT * FROM pedido WHERE pedido_id = $1', [Number(pedidoId)]);
  return result.rows[0];
};

const crearPedido = async ({ sucursal_id, empleado_id, cliente_id, tipo_pedido, productos = [] }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const clienteId = cliente_id ? Number(cliente_id) : null;
    let clienteValido = null;

    if (clienteId) {
      const clienteResult = await client.query('SELECT 1 FROM cliente WHERE cliente_id = $1', [clienteId]);
      clienteValido = clienteResult.rowCount ? clienteId : null;
    }

    // Backend -> PostgreSQL: crea pedido con procedimiento almacenado.
    await client.query('CALL sp_nuevo_pedido($1, $2, $3, $4)', [
      Number(sucursal_id),
      Number(empleado_id),
      clienteValido,
      tipo_pedido
    ]);

    const pedidoResult = await client.query("SELECT currval(pg_get_serial_sequence('pedido','pedido_id')) AS pedido_id");
    const pedidoId = Number(pedidoResult.rows[0].pedido_id);

    for (const producto of productos) {
      // Backend -> PostgreSQL: agrega detalle con procedimiento almacenado.
      await client.query('CALL sp_agregar_producto_pedido($1, $2, $3)', [
        pedidoId,
        Number(producto.id_producto ?? producto.producto_id),
        Number(producto.cantidad)
      ]);
    }

    await client.query('COMMIT');

    const pedido = await pool.query('SELECT * FROM pedido WHERE pedido_id = $1', [pedidoId]);
    const detalle = await pool.query('SELECT * FROM detalle_pedido WHERE pedido_id = $1 ORDER BY detalle_id', [pedidoId]);

    return { ...pedido.rows[0], detalle: detalle.rows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const agregarProductoPedido = async (pedidoId, { producto_id, cantidad }) => {
  // Backend -> PostgreSQL: agrega producto a pedido existente con procedimiento almacenado.
  await pool.query('CALL sp_agregar_producto_pedido($1, $2, $3)', [
    Number(pedidoId),
    Number(producto_id),
    Number(cantidad)
  ]);

  const result = await pool.query('SELECT * FROM pedido WHERE pedido_id = $1', [Number(pedidoId)]);
  return result.rows[0];
};

const aplicarPromocion = async (pedidoId, { promocion_id }) => {
  // Backend -> PostgreSQL: aplica promoción con procedimiento almacenado.
  await pool.query('CALL sp_aplicar_promocion($1, $2)', [Number(pedidoId), Number(promocion_id)]);
  const result = await pool.query('SELECT * FROM pedido WHERE pedido_id = $1', [Number(pedidoId)]);
  return result.rows[0];
};

const cancelarPedido = async (pedidoId) => {
  // Backend -> PostgreSQL: cancela pedido con procedimiento almacenado.
  await pool.query('CALL sp_cancelar_pedido($1)', [Number(pedidoId)]);
  return obtenerPedido(pedidoId);
};

const prepararPedido = async (pedidoId) => {
  await ensurePedidoStatusProcedures();
  await pool.query('CALL sp_preparar_pedido($1)', [Number(pedidoId)]);
  return obtenerPedido(pedidoId);
};

const marcarPedidoListo = async (pedidoId) => {
  await ensurePedidoStatusProcedures();
  await pool.query('CALL sp_marcar_pedido_listo($1)', [Number(pedidoId)]);
  return obtenerPedido(pedidoId);
};

const entregarPedido = async (pedidoId) => {
  await ensurePedidoStatusProcedures();
  await pool.query('CALL sp_entregar_pedido($1)', [Number(pedidoId)]);
  return obtenerPedido(pedidoId);
};

module.exports = {
  obtenerPedidos,
  obtenerDetallePedido,
  crearPedido,
  agregarProductoPedido,
  aplicarPromocion,
  cancelarPedido,
  prepararPedido,
  marcarPedidoListo,
  entregarPedido
};
