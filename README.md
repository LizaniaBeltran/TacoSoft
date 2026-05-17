# TacoSoft - El Sinaloense

Sistema POS y administrativo para la taquería El Sinaloense. Incluye frontend HTML/CSS/JavaScript, backend Node.js/Express y base de datos PostgreSQL con procedimientos almacenados.

## Tecnologías

- HTML, CSS, JavaScript vanilla y Bootstrap
- Node.js y Express
- PostgreSQL 17
- Docker Compose para la base de datos

## Estructura

- `frontend/`: login, panel administrativo, POS, estilos y JavaScript principal.
- `backend/`: API REST que conecta con PostgreSQL.
- `database/`: tablas, procedimientos almacenados e inserts de prueba.
- `docker/`: `docker-compose.yml` para PostgreSQL.

## Instalación

1. Iniciar PostgreSQL:

```bash
docker compose -f docker/docker-compose.yml up -d
```

2. Crear estructura y datos desde PostgreSQL:

```bash
psql -h localhost -U postgres -d tacosoft -f database/tablas.sql
psql -h localhost -U postgres -d tacosoft -f database/procedimientos.sql
psql -h localhost -U postgres -d tacosoft -f database/inserts.sql
```

3. Instalar dependencias del backend:

```bash
cd backend
npm install
```

4. Iniciar API:

```bash
npm run dev
```

La API queda disponible en `http://localhost:3000`.

## Acceso

- Usuario: `admin`
- Contraseña: `admin123`
- Archivo inicial: `frontend/login.html`

## Base De Datos

Tablas principales:

- `sucursal`
- `categoria`
- `producto`
- `empleado`
- `cliente`
- `pedido`
- `detalle_pedido`
- `promocion`
- `promocion_producto`

El archivo `database/procedimientos.sql` contiene procedimientos para altas, actualizaciones, bajas, pedidos, promociones, cancelaciones y reportes.

## API Principal

- `GET /api/productos`
- `POST /api/productos`
- `GET /api/categorias`
- `POST /api/categorias`
- `GET /api/sucursales`
- `POST /api/sucursales`
- `GET /api/empleados`
- `POST /api/empleados`
- `GET /api/clientes`
- `POST /api/clientes`
- `GET /api/promociones`
- `POST /api/promociones`
- `GET /api/pedidos`
- `GET /api/pedidos/detalle`
- `POST /api/pedidos`
- `POST /api/pedidos/:id/productos`
- `POST /api/pedidos/:id/promocion`
- `PATCH /api/pedidos/:id/preparar`
- `PATCH /api/pedidos/:id/listo`
- `PATCH /api/pedidos/:id/entregar`
- `PATCH /api/pedidos/:id/cancelar`
- `PATCH /api/pedidos/cancelar-pendientes-24h`

## Reportes

Los reportes aceptan filtros opcionales `fecha_inicio`, `fecha_fin` y `sucursal_id`.

- `GET /api/reportes/ventas-sucursal`
- `GET /api/reportes/productos-mas-vendidos`
- `GET /api/reportes/ventas-categoria`
- `GET /api/reportes/rendimiento-empleados`
- `GET /api/reportes/comparativo-mensual`
- `GET /api/reportes/productos-sin-movimiento`

Ejemplo:

```bash
http://localhost:3000/api/reportes/ventas-sucursal?fecha_inicio=2026-05-01&fecha_fin=2026-05-31&sucursal_id=1
```

## Flujo De Pedido

El pedido se crea desde el POS y se guarda con `sp_nuevo_pedido`. Los productos se agregan con `sp_agregar_producto_pedido`. El estado sigue este flujo:

`pendiente -> preparando -> listo -> entregado`

Los pedidos `pendiente` o `preparando` pueden cancelarse. También existe la cancelación masiva de pedidos pendientes con más de 24 horas.
