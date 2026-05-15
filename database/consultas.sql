-- Ventas por sucursal
SELECT 
    s.nombre AS sucursal,
    COUNT(p.pedido_id) AS total_pedidos,
    SUM(p.total) AS total_vendido,
    AVG(p.total) AS ticket_promedio
FROM pedido p
INNER JOIN sucursal s ON p.sucursal_id = s.sucursal_id
GROUP BY s.nombre;

-- Productos más vendidos
SELECT 
    pr.nombre AS producto,
    c.nombre AS categoria,
    SUM(dp.cantidad) AS cantidad_vendida,
    SUM(dp.subtotal) AS total_vendido
FROM detalle_pedido dp
INNER JOIN producto pr ON dp.producto_id = pr.producto_id
INNER JOIN categoria c ON pr.categoria_id = c.categoria_id
GROUP BY pr.nombre, c.nombre
ORDER BY cantidad_vendida DESC;