-- Datos de prueba TacoSoft - El Sinaloense
-- Ejecutar después de tablas.sql y procedimientos.sql

-- SUCURSALES
CALL sp_crear_sucursal('El Sinaloense Culiacán', 'Av. Álvaro Obregón 123 Centro', 'Culiacán', '6671234567');
CALL sp_crear_sucursal('El Sinaloense Mazatlán', 'Av. del Mar 456 Malecón', 'Mazatlán', '6691234567');
CALL sp_crear_sucursal('El Sinaloense Los Mochis', 'Blvd. Rosales 789', 'Los Mochis', '6681234567');
CALL sp_crear_sucursal('El Sinaloense Guasave', 'Calle Zaragoza 321', 'Guasave', '6871234567');

-- CATEGORÍAS
CALL sp_crear_categoria('Tacos', 'Tacos de carne asada, pastor y guisos sinaloenses');
CALL sp_crear_categoria('Burritos', 'Burritos grandes de harina');
CALL sp_crear_categoria('Bebidas', 'Refrescos, aguas frescas y bebidas embotelladas');
CALL sp_crear_categoria('Postres', 'Postres individuales');
CALL sp_crear_categoria('Extras', 'Complementos y adicionales');

-- PRODUCTOS (20)
CALL sp_crear_producto('Taco de asada', 'Taco de carne asada estilo Sinaloa', 1, 45, 22);
CALL sp_crear_producto('Taco al pastor', 'Taco de pastor con piña', 1, 38, 18);
CALL sp_crear_producto('Taco de chilorio', 'Taco de chilorio sinaloense', 1, 42, 20);
CALL sp_crear_producto('Taco de camarón', 'Taco de camarón capeado', 1, 58, 32);
CALL sp_crear_producto('Taco gobernador', 'Taco de camarón con queso', 1, 62, 36);
CALL sp_crear_producto('Burrito de asada', 'Burrito grande de carne asada', 2, 75, 35);
CALL sp_crear_producto('Burrito de pollo', 'Burrito de pollo a la plancha', 2, 68, 30);
CALL sp_crear_producto('Burrito de chilorio', 'Burrito de chilorio con frijol', 2, 72, 32);
CALL sp_crear_producto('Burrito mixto', 'Burrito con asada y pastor', 2, 82, 40);
CALL sp_crear_producto('Coca Cola', 'Refresco 600 ml', 3, 30, 12);
CALL sp_crear_producto('Agua de jamaica', 'Agua fresca 500 ml', 3, 25, 8);
CALL sp_crear_producto('Agua de horchata', 'Agua fresca 500 ml', 3, 25, 9);
CALL sp_crear_producto('Limonada mineral', 'Limonada con agua mineral', 3, 32, 11);
CALL sp_crear_producto('Flan napolitano', 'Postre individual', 4, 35, 15);
CALL sp_crear_producto('Arroz con leche', 'Postre casero', 4, 30, 12);
CALL sp_crear_producto('Pay de queso', 'Rebanada de pay', 4, 42, 20);
CALL sp_crear_producto('Guacamole', 'Extra de guacamole', 5, 25, 10);
CALL sp_crear_producto('Queso extra', 'Porción de queso extra', 5, 18, 7);
CALL sp_crear_producto('Salsa especial', 'Salsa de la casa', 5, 12, 4);
CALL sp_crear_producto('Orden de frijoles', 'Frijoles puercos sinaloenses', 5, 35, 14);

-- EMPLEADOS (12, 3 por sucursal, 1 gerente por sucursal)
CALL sp_crear_empleado('Juan Pérez López', '6671112233', 'gerente', 1, 7000, '2026-01-10');
CALL sp_crear_empleado('María González Ruiz', '6672223344', 'cajero', 1, 4500, '2026-01-12');
CALL sp_crear_empleado('Luis Alberto Vega', '6673334455', 'cajero', 1, 4500, '2026-01-15');
CALL sp_crear_empleado('Carlos Ramírez Soto', '6691112233', 'gerente', 2, 7000, '2026-01-10');
CALL sp_crear_empleado('Ana Torres Beltrán', '6692223344', 'cajero', 2, 4500, '2026-01-12');
CALL sp_crear_empleado('Rafael Quintero Díaz', '6693334455', 'cajero', 2, 4500, '2026-01-15');
CALL sp_crear_empleado('Sofía Castro León', '6681112233', 'gerente', 3, 7000, '2026-01-10');
CALL sp_crear_empleado('Pedro Meza Ríos', '6682223344', 'cajero', 3, 4500, '2026-01-12');
CALL sp_crear_empleado('Daniela Flores Mora', '6683334455', 'cajero', 3, 4500, '2026-01-15');
CALL sp_crear_empleado('Miguel Valdez Núñez', '6871112233', 'gerente', 4, 7000, '2026-01-10');
CALL sp_crear_empleado('Laura Medina Gil', '6872223344', 'cajero', 4, 4500, '2026-01-12');
CALL sp_crear_empleado('Héctor Salazar Rojo', '6873334455', 'cajero', 4, 4500, '2026-01-15');

-- CLIENTES (10)
INSERT INTO cliente(nombre, telefono, correo, ciudad) VALUES
('José Manuel Ibarra', '6677001001', 'jose.ibarra@email.com', 'Culiacán'),
('Carolina Soto Vega', '6697001002', 'carolina.soto@email.com', 'Mazatlán'),
('Ricardo Beltrán Ruiz', '6687001003', 'ricardo.beltran@email.com', 'Los Mochis'),
('Fernanda López Castro', '6877001004', 'fernanda.lopez@email.com', 'Guasave'),
('Alonso Quintero Meza', '6677001005', 'alonso.quintero@email.com', 'Culiacán'),
('Paola Ríos Medina', '6697001006', 'paola.rios@email.com', 'Mazatlán'),
('Iván Núñez Flores', '6687001007', 'ivan.nunez@email.com', 'Los Mochis'),
('Gabriela Mora Salazar', '6877001008', 'gabriela.mora@email.com', 'Guasave'),
('Roberto Valdez Gil', '6677001009', 'roberto.valdez@email.com', 'Culiacán'),
('Natalia León Díaz', '6697001010', 'natalia.leon@email.com', 'Mazatlán');

-- PEDIDOS (30) Y DETALLES (60+)
DO $$
DECLARE
    i INT;
    v_sucursal INT;
    v_empleado INT;
    v_cliente INT;
BEGIN
    FOR i IN 1..30 LOOP
        v_sucursal := ((i - 1) % 4) + 1;
        v_empleado := ((v_sucursal - 1) * 3) + 2;
        v_cliente := ((i - 1) % 10) + 1;

        CALL sp_nuevo_pedido(v_sucursal, v_empleado, v_cliente,
            CASE WHEN i % 3 = 0 THEN 'a domicilio' WHEN i % 3 = 1 THEN 'en local' ELSE 'para llevar' END
        );

        CALL sp_agregar_producto_pedido(i, ((i - 1) % 20) + 1, (i % 3) + 1);
        CALL sp_agregar_producto_pedido(i, (i % 20) + 1, ((i + 1) % 3) + 1);

        IF i % 5 = 0 THEN
            CALL sp_agregar_producto_pedido(i, ((i + 4) % 20) + 1, 1);
        END IF;

        UPDATE pedido
        SET fecha_hora = TIMESTAMP '2026-05-01 12:00:00' + (i || ' days')::INTERVAL,
            estatus = CASE
                WHEN i % 11 = 0 THEN 'cancelado'
                WHEN i % 7 = 0 THEN 'entregado'
                WHEN i % 5 = 0 THEN 'listo'
                WHEN i % 3 = 0 THEN 'preparando'
                ELSE 'pendiente'
            END
        WHERE pedido_id = i;
    END LOOP;
END $$;

-- PROMOCIONES (3: vigente y expirada)
CALL sp_crear_promocion('Combo Sinaloense', 'Descuento en tacos seleccionados', 10, '2026-05-01', '2026-12-31');
CALL sp_crear_promocion('Burrito Fest', 'Promoción de burritos', 15, '2026-04-01', '2026-04-30');
CALL sp_crear_promocion('Bebidas Frescas', 'Descuento en bebidas', 8, '2026-05-15', '2026-12-31');
CALL sp_agregar_producto_promocion(1, 1);
CALL sp_agregar_producto_promocion(1, 2);
CALL sp_agregar_producto_promocion(2, 6);
CALL sp_agregar_producto_promocion(2, 8);
CALL sp_agregar_producto_promocion(3, 10);
CALL sp_agregar_producto_promocion(3, 11);
