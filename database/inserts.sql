-- SUCURSALES
CALL sp_crear_sucursal('Sucursal Culiacán Centro', 'Av. Álvaro Obregón 123', 'Culiacán', '6671234567');
CALL sp_crear_sucursal('Sucursal Mazatlán Malecón', 'Av. del Mar 456', 'Mazatlán', '6691234567');
CALL sp_crear_sucursal('Sucursal Los Mochis', 'Blvd. Rosales 789', 'Los Mochis', '6681234567');
CALL sp_crear_sucursal('Sucursal Guasave', 'Calle Zaragoza 321', 'Guasave', '6871234567');

-- CATEGORÍAS
CALL sp_crear_categoria('Tacos', 'Tacos de diferentes guisos');
CALL sp_crear_categoria('Burritos', 'Burritos de harina');
CALL sp_crear_categoria('Bebidas', 'Refrescos y aguas frescas');
CALL sp_crear_categoria('Postres', 'Postres del menú');
CALL sp_crear_categoria('Extras', 'Complementos');

-- EMPLEADOS
CALL sp_crear_empleado('Juan Pérez López', '6671112233', 'cajero', 1, 4500, '2026-05-15');
CALL sp_crear_empleado('María González Ruiz', '6672223344', 'gerente', 1, 7000, '2026-05-15');
CALL sp_crear_empleado('Carlos Ramírez Soto', '6691112233', 'cajero', 2, 4500, '2026-05-15');
CALL sp_crear_empleado('Ana Torres Beltrán', '6681112233', 'gerente', 3, 7000, '2026-05-15');

-- PRODUCTOS
CALL sp_crear_producto('Taco de asada', 'Taco de carne asada', 1, 45, 22);
CALL sp_crear_producto('Taco al pastor', 'Taco de pastor con piña', 1, 38, 18);
CALL sp_crear_producto('Burrito de asada', 'Burrito grande de harina', 2, 75, 35);
CALL sp_crear_producto('Coca Cola', 'Refresco 600 ml', 3, 30, 12);
CALL sp_crear_producto('Flan', 'Postre individual', 4, 35, 15);
CALL sp_crear_producto('Guacamole', 'Extra de guacamole', 5, 25, 10);



----------------------------------------
-------------------------------------


-- PEDIDOS DE PRUEBA
CALL sp_nuevo_pedido(1, 1, NULL, 'en local');
CALL sp_agregar_producto_pedido(1, 1, 2);
CALL sp_agregar_producto_pedido(1, 4, 1);

CALL sp_nuevo_pedido(2, 3, NULL, 'para llevar');
CALL sp_agregar_producto_pedido(2, 2, 3);
CALL sp_agregar_producto_pedido(2, 6, 1);