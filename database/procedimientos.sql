CREATE OR REPLACE PROCEDURE sp_crear_sucursal(
    p_nombre VARCHAR,
    p_direccion TEXT,
    p_ciudad VARCHAR,
    p_telefono VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
        RAISE EXCEPTION 'El nombre de la sucursal no puede estar vacío';
    END IF;

    INSERT INTO sucursal(nombre, direccion, ciudad, telefono, estatus)
    VALUES(p_nombre, p_direccion, p_ciudad, p_telefono, 'activa');

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear sucursal: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_actualizar_sucursal(
    p_id INT,
    p_nombre VARCHAR,
    p_direccion TEXT,
    p_ciudad VARCHAR,
    p_telefono VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sucursal WHERE sucursal_id = p_id) THEN
        RAISE EXCEPTION 'La sucursal no existe';
    END IF;

    UPDATE sucursal
    SET nombre = p_nombre,
        direccion = p_direccion,
        ciudad = p_ciudad,
        telefono = p_telefono
    WHERE sucursal_id = p_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar sucursal: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_baja_sucursal(
    p_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sucursal WHERE sucursal_id = p_id) THEN
        RAISE EXCEPTION 'La sucursal no existe';
    END IF;

    UPDATE sucursal
    SET estatus = 'inactiva'
    WHERE sucursal_id = p_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al dar de baja sucursal: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_crear_categoria(
    p_nombre VARCHAR,
    p_descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
        RAISE EXCEPTION 'El nombre de la categoría no puede estar vacío';
    END IF;

    INSERT INTO categoria(nombre, descripcion)
    VALUES(p_nombre, p_descripcion);

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear categoría: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_actualizar_categoria(
    p_id INT,
    p_nombre VARCHAR,
    p_descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM categoria WHERE categoria_id = p_id) THEN
        RAISE EXCEPTION 'La categoría no existe';
    END IF;

    UPDATE categoria
    SET nombre = p_nombre,
        descripcion = p_descripcion
    WHERE categoria_id = p_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al actualizar categoría: %', SQLERRM;
END;
$$;



CREATE OR REPLACE PROCEDURE sp_nuevo_pedido(
    p_sucursal_id INT,
    p_empleado_id INT,
    p_cliente_id INT,
    p_tipo_pedido VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM sucursal
        WHERE sucursal_id = p_sucursal_id
        AND estatus = 'activa'
    ) THEN
        RAISE EXCEPTION 'La sucursal no existe o esta inactiva';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM empleado
        WHERE empleado_id = p_empleado_id
        AND estatus = 'activo'
    ) THEN
        RAISE EXCEPTION 'El empleado no existe o esta inactivo';
    END IF;

    INSERT INTO pedido(
        sucursal_id,
        empleado_id,
        cliente_id,
        tipo_pedido,
        estatus,
        total
    )
    VALUES(
        p_sucursal_id,
        p_empleado_id,
        p_cliente_id,
        p_tipo_pedido,
        'pendiente',
        0
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear pedido: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_crear_empleado(
    p_nombre_completo VARCHAR,
    p_telefono VARCHAR,
    p_puesto VARCHAR,
    p_sucursal_id INT,
    p_salario_quincenal NUMERIC,
    p_fecha_ingreso DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_nombre_completo IS NULL OR TRIM(p_nombre_completo) = '' THEN
        RAISE EXCEPTION 'El nombre del empleado no puede estar vacío';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM sucursal
        WHERE sucursal_id = p_sucursal_id
        AND estatus = 'activa'
    ) THEN
        RAISE EXCEPTION 'La sucursal no existe o está inactiva';
    END IF;

    INSERT INTO empleado(
        nombre_completo,
        telefono,
        puesto,
        sucursal_id,
        salario_quincenal,
        fecha_ingreso,
        estatus
    )
    VALUES(
        p_nombre_completo,
        p_telefono,
        p_puesto,
        p_sucursal_id,
        p_salario_quincenal,
        p_fecha_ingreso,
        'activo'
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear empleado: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_agregar_producto_pedido(
    p_pedido_id INT,
    p_producto_id INT,
    p_cantidad INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_precio NUMERIC(10,2);
    v_subtotal NUMERIC(10,2);
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM pedido
        WHERE pedido_id = p_pedido_id
    ) THEN
        RAISE EXCEPTION 'El pedido no existe';
    END IF;

    SELECT precio_actual
    INTO v_precio
    FROM producto
    WHERE producto_id = p_producto_id;

    IF v_precio IS NULL THEN
        RAISE EXCEPTION 'El producto no existe';
    END IF;

    v_subtotal := v_precio * p_cantidad;

    INSERT INTO detalle_pedido(
        pedido_id,
        producto_id,
        cantidad,
        precio_unitario,
        subtotal
    )
    VALUES(
        p_pedido_id,
        p_producto_id,
        p_cantidad,
        v_precio,
        v_subtotal
    );

    UPDATE pedido
    SET total = total + v_subtotal
    WHERE pedido_id = p_pedido_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al agregar producto: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_crear_producto(
    p_nombre VARCHAR,
    p_descripcion TEXT,
    p_categoria_id INT,
    p_precio_actual NUMERIC,
    p_costo_preparacion NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
        RAISE EXCEPTION 'El nombre del producto no puede estar vacío';
    END IF;

    IF p_precio_actual <= 0 THEN
        RAISE EXCEPTION 'El precio debe ser mayor a 0';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM categoria
        WHERE categoria_id = p_categoria_id
    ) THEN
        RAISE EXCEPTION 'La categoría no existe';
    END IF;

    INSERT INTO producto(
        nombre,
        descripcion,
        categoria_id,
        precio_actual,
        costo_preparacion,
        estatus
    )
    VALUES(
        p_nombre,
        p_descripcion,
        p_categoria_id,
        p_precio_actual,
        p_costo_preparacion,
        'disponible'
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear producto: %', SQLERRM;
END;
$$;



CREATE OR REPLACE PROCEDURE sp_cancelar_pedido(
    p_pedido_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_estatus VARCHAR(30);
BEGIN

    SELECT estatus
    INTO v_estatus
    FROM pedido
    WHERE pedido_id = p_pedido_id;

    IF v_estatus IS NULL THEN
        RAISE EXCEPTION 'El pedido no existe';
    END IF;

    IF v_estatus = 'entregado' THEN
        RAISE EXCEPTION 'No se puede cancelar un pedido entregado';
    END IF;

    UPDATE pedido
    SET estatus = 'cancelado'
    WHERE pedido_id = p_pedido_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al cancelar pedido: %', SQLERRM;
END;
$$;