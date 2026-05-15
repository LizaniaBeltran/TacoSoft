DROP TABLE IF EXISTS detalle_pedido CASCADE;
DROP TABLE IF EXISTS pedido CASCADE;
DROP TABLE IF EXISTS promocion_producto CASCADE;
DROP TABLE IF EXISTS promocion CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TABLE IF EXISTS sucursal CASCADE;

CREATE TABLE sucursal (
    sucursal_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    estatus VARCHAR(20) NOT NULL DEFAULT 'activa'
);

CREATE TABLE categoria (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE producto (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria_id INT NOT NULL,
    precio_actual NUMERIC(10,2) NOT NULL,
    costo_preparacion NUMERIC(10,2) NOT NULL,
    estatus VARCHAR(20) NOT NULL DEFAULT 'disponible',
    FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id)
);

CREATE TABLE empleado (
    empleado_id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    puesto VARCHAR(50) NOT NULL,
    sucursal_id INT NOT NULL,
    salario_quincenal NUMERIC(10,2),
    fecha_ingreso DATE NOT NULL,
    estatus VARCHAR(20) NOT NULL DEFAULT 'activo',
    FOREIGN KEY (sucursal_id) REFERENCES sucursal(sucursal_id)
);

CREATE TABLE cliente (
    cliente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(120),
    ciudad VARCHAR(100),
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE promocion (
    promocion_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    porcentaje_descuento NUMERIC(5,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
);

CREATE TABLE promocion_producto (
    promocion_id INT NOT NULL,
    producto_id INT NOT NULL,
    PRIMARY KEY (promocion_id, producto_id),
    FOREIGN KEY (promocion_id) REFERENCES promocion(promocion_id),
    FOREIGN KEY (producto_id) REFERENCES producto(producto_id)
);

CREATE TABLE pedido (
    pedido_id SERIAL PRIMARY KEY,
    sucursal_id INT NOT NULL,
    empleado_id INT NOT NULL,
    cliente_id INT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_pedido VARCHAR(30) NOT NULL,
    estatus VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    total NUMERIC(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (sucursal_id) REFERENCES sucursal(sucursal_id),
    FOREIGN KEY (empleado_id) REFERENCES empleado(empleado_id),
    FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id)
);

CREATE TABLE detalle_pedido (
    detalle_id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedido(pedido_id),
    FOREIGN KEY (producto_id) REFERENCES producto(producto_id)
);