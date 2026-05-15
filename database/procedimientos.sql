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