document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:3000/api';
  const currentPage = window.location.pathname.split('/').pop() || 'login.html';

  if (currentPage !== 'login.html' && !localStorage.getItem('usuarioLogueado')) {
    window.location.href = 'login.html';
    return;
  }

  let sucursales = [];
  let categorias = [];

let productos = [];

  async function apiRequest(path, options = {}) {
    // Frontend -> Backend Express. El backend se encarga de ejecutar procedimientos en PostgreSQL.
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok === false) throw new Error(result.error || 'Error de API');
    return result.data ?? result;
  }

  async function cargarCatalogosAPI() {
    try {
      const [categoriasData, sucursalesData, empleadosData, clientesData, promocionesData, pedidosData, detalleData] = await Promise.all([
        apiRequest('/categorias'),
        apiRequest('/sucursales'),
        apiRequest('/empleados'),
        apiRequest('/clientes'),
        apiRequest('/promociones'),
        apiRequest('/pedidos'),
        apiRequest('/pedidos/detalle')
      ]);

      categorias = categoriasData.map(categoria => ({
        id_categoria: categoria.categoria_id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || 'Categoría registrada en PostgreSQL.'
      }));

      sucursales = sucursalesData.map(sucursal => ({
        id_sucursal: sucursal.sucursal_id,
        nombre: sucursal.nombre,
        ciudad: sucursal.ciudad,
        direccion: sucursal.direccion,
        telefono: sucursal.telefono || 'N/A',
        estatus: sucursal.estatus
      }));

      empleados = empleadosData.map(empleado => ({
        id_empleado: empleado.empleado_id,
        id_sucursal: empleado.sucursal_id,
        nombre: empleado.nombre_completo,
        telefono: empleado.telefono || 'N/A',
        puesto: empleado.puesto,
        salario: Number(empleado.salario_quincenal || 0),
        fecha_ingreso: empleado.fecha_ingreso?.slice(0, 10) || 'N/A',
        estatus: empleado.estatus
      }));

      clientes = [
        { id_cliente: null, nombre: 'Cliente general', telefono: 'N/A', correo: 'N/A', ciudad: 'N/A' },
        ...clientesData.map(cliente => ({
          id_cliente: cliente.cliente_id,
          nombre: cliente.nombre,
          telefono: cliente.telefono || 'N/A',
          correo: cliente.correo || 'N/A',
          ciudad: cliente.ciudad || 'N/A',
          fecha_registro: cliente.fecha_registro?.slice(0, 10) || 'N/A'
        }))
      ];

      promociones = promocionesData.map(promocion => ({
        id_promocion: promocion.promocion_id,
        nombre: promocion.nombre,
        descripcion: promocion.descripcion || 'Sin descripción',
        porcentaje: Number(promocion.porcentaje_descuento || 0),
        fecha_inicio: promocion.fecha_inicio?.slice(0, 10),
        fecha_fin: promocion.fecha_fin?.slice(0, 10),
        vigente: true,
        productos: promocion.productos || []
      }));

      pedidos = pedidosData.map(pedido => ({
        id_pedido: pedido.pedido_id,
        id_sucursal: pedido.sucursal_id,
        id_cliente: pedido.cliente_id,
        id_empleado: pedido.empleado_id,
        fecha_hora: formatDateTime(pedido.fecha_hora),
        fecha_raw: pedido.fecha_hora || null,
        tipo_pedido: pedido.tipo_pedido,
        total: Number(pedido.total || 0),
        estado: normalizeStatus(pedido.estatus)
      })).sort((a, b) => b.id_pedido - a.id_pedido);

      detallePedido = detalleData.map(detalle => ({
        id_pedido: detalle.pedido_id,
        id_producto: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio_unitario: Number(detalle.precio_unitario),
        subtotal: Number(detalle.subtotal)
      }));
    } catch (error) {
      console.error('Error cargando catálogos:', error);
      showToast('No se pudieron cargar todos los catálogos');
    }
  }

async function cargarProductosAPI() {
    try {
      // Conexión frontend -> backend Node/Express -> PostgreSQL.
      const data = await apiRequest('/productos');

      productos = (data || []).map(producto => ({
        id_producto: producto.producto_id ?? producto.id_producto,
        id_categoria: producto.categoria_id ?? producto.id_categoria,
        nombre: producto.nombre,
        descripcion: producto.descripcion || 'Producto disponible para venta.',
        precio: Number(producto.precio_actual ?? producto.precio ?? 0),
        costo: Number(producto.costo_preparacion ?? producto.costo ?? 0),
        estatus: producto.estatus || 'disponible',
        disponible: (producto.estatus || 'disponible').toLowerCase() === 'disponible',
        icon: getProductIcon(producto.nombre, producto.categoria_id ?? producto.id_categoria),
      }));

      renderCategories();
      renderProducts();
      renderDashboard();
    } catch (error) {
      console.error('Error cargando productos:', error);
      showToast('No se pudieron cargar los productos desde el backend');
    }
}

  function getProductIcon(nombre = '', categoriaId) {
    const text = nombre.toLowerCase();
    if (text.includes('coca') || text.includes('refresco') || categoriaId === 3) return 'bi-cup-straw';
    if (text.includes('burrito')) return 'bi-basket2';
    if (text.includes('flan') || categoriaId === 4) return 'bi-cake';
    if (text.includes('guacamole') || categoriaId === 5) return 'bi-basket';
    return 'bi-egg-fried';
  }

  let empleados = [];

  let clientes = [{ id_cliente: null, nombre: 'Cliente general', telefono: 'N/A', correo: 'N/A', ciudad: 'N/A' }];

  let promociones = [];
  let pedidos = [];
  let detallePedido = [];

  let carrito = [];
  let categoriaActual = 'todos';
  let descuentoAplicado = 0;
  let pedidoActualId = null;

  const money = (value) => `$${Number(value).toFixed(2)}`;
  const getSucursal = (id) => sucursales.find(item => item.id_sucursal === id)?.nombre || 'Sin sucursal';
  const getCliente = (id) => clientes.find(item => item.id_cliente === id)?.nombre || 'Cliente general';
  const getEmpleado = (id) => empleados.find(item => item.id_empleado === id)?.nombre || 'Sin empleado';
  const getCategoria = (id) => categorias.find(item => item.id_categoria === id)?.nombre || 'Sin categoría';
  const normalizeStatus = (estatus = '') => String(estatus || '').trim().toLowerCase();
  const formatStatus = (estatus = '') => {
    const value = normalizeStatus(estatus);
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Sin estatus';
  };
  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString('es-MX', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };
  const badgeClass = (estatus = '') => {
    const value = normalizeStatus(estatus);
    if (value === 'cancelado' || value === 'inactivo' || value === 'inactiva') return 'bg-danger';
    if (value === 'pendiente') return 'bg-warning text-dark';
    if (value === 'preparando') return 'bg-info text-dark';
    if (value === 'listo') return 'bg-success-subtle text-success';
    if (value === 'entregado') return 'bg-success';
    return 'bg-success';
  };

  async function crearPedidoDesdeCarrito() {
    if (pedidoActualId) return pedidoActualId;
    if (!carrito.length) throw new Error('El carrito está vacío');

    const payload = {
      sucursal_id: document.getElementById('branchSelect')?.value,
      empleado_id: document.getElementById('employeeSelect')?.value,
      cliente_id: document.getElementById('clientSelect')?.value || null,
      tipo_pedido: document.getElementById('orderTypeSelect')?.value,
      productos: carrito.map(item => ({ id_producto: item.id_producto, cantidad: item.cantidad }))
    };

    // Frontend -> Backend: Express ejecuta CALL sp_nuevo_pedido y CALL sp_agregar_producto_pedido por cada producto.
    const pedido = await apiRequest('/pedidos', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    pedidoActualId = pedido.pedido_id;
    return pedidoActualId;
  }

  const showToast = (message) => {
    const toastEl = document.getElementById('appToast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toastEl || !toastMessage || !window.bootstrap) {
      alert(message);
      return;
    }
    toastMessage.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  };

  const getMain = () => document.querySelector('.main-content main');
  const getActiveModule = () => document.querySelector('.module-link.active')?.dataset.module;

  async function refreshDataAndView(module = getActiveModule()) {
    await cargarCatalogosAPI();
    await cargarProductosAPI();
    fillSelects();

    if (module) renderModule(module);
    else renderDashboard();
  }

  const setActiveModule = (module) => {
    document.querySelectorAll('.sidebar .nav-item').forEach(item => item.classList.remove('active'));
    const link = document.querySelector(`.module-link[data-module="${module}"]`);
    if (link) link.classList.add('active');
  };

  const moduleHeader = (title, subtitle, action = '') => `
    <div class="module-header">
      <div>
        <span class="soft-pill mb-2"><i class="bi bi-database-check"></i> Conectado a PostgreSQL</span>
        <h1 class="pos-title mb-1">${title}</h1>
        <p class="pos-subtitle mb-0">${subtitle}</p>
      </div>
      ${action}
    </div>
  `;

  const table = (headers, rows) => `
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table custom-table mb-0">
            <thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead>
            <tbody>${rows || `<tr><td colspan="${headers.length}" class="text-center text-muted py-4">Sin registros</td></tr>`}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const productNames = (ids) => ids.map(id => productos.find(producto => producto.id_producto === id)?.nombre).filter(Boolean).join(', ');
  const getDetalleByPedido = (pedidoId) => detallePedido.filter(detalle => Number(detalle.id_pedido) === Number(pedidoId));
  const nextStatus = { pendiente: 'preparando', preparando: 'listo', listo: 'entregado' };
  const statusEndpoint = { pendiente: 'preparar', preparando: 'listo', listo: 'entregar' };
  const statusMessages = {
    preparar: 'Pedido marcado como preparando',
    listo: 'Pedido listo para entregar',
    entregar: 'Pedido entregado correctamente',
    cancelar: 'Pedido cancelado'
  };

  function rowActions(entity, id, labels) {
    return `<div class="d-flex flex-wrap gap-1">${labels.map(label => `<button class="btn btn-sm btn-outline-secondary row-action" data-entity="${entity}" data-id="${id}" data-label="${label}" type="button">${label}</button>`).join('')}</div>`;
  }

  function renderPedidosTable(items) {
    return table(['pedido_id', 'sucursal', 'empleado', 'cliente', 'fecha_hora', 'tipo_pedido', 'estatus', 'total', 'acciones'], items.map(pedido => `
      <tr>
        <td><span class="order-id">#${pedido.id_pedido}</span></td>
        <td>${getSucursal(pedido.id_sucursal)}</td>
        <td>${getEmpleado(pedido.id_empleado)}</td>
        <td>${getCliente(pedido.id_cliente)}</td>
        <td>${pedido.fecha_hora}</td>
        <td>${pedido.tipo_pedido}</td>
        <td><span class="badge ${badgeClass(pedido.estado)}">${formatStatus(pedido.estado)}</span></td>
        <td>${money(pedido.total)}</td>
        <td>${pedidoActions(pedido)}</td>
      </tr>`).join(''));
  }

  function pedidoActions(pedido) {
    const estado = normalizeStatus(pedido.estado);
    const next = nextStatus[estado];
    const nextLabel = estado === 'pendiente' ? 'Preparar' : estado === 'preparando' ? 'Marcar listo' : estado === 'listo' ? 'Entregar' : '';
    const canCancel = ['pendiente', 'preparando'].includes(estado);
    return `
      <div class="d-flex flex-wrap gap-1">
        <button class="btn btn-sm btn-outline-secondary row-action" data-entity="pedido" data-id="${pedido.id_pedido}" data-label="Ver detalle" type="button">Ver detalle</button>
        ${next ? `<button class="btn btn-sm btn-outline-secondary row-action" data-entity="pedido" data-id="${pedido.id_pedido}" data-label="${nextLabel}" type="button">${nextLabel}</button>` : ''}
        ${canCancel ? `<button class="btn btn-sm btn-outline-secondary row-action" data-entity="pedido" data-id="${pedido.id_pedido}" data-label="Cancelar" type="button">Cancelar</button>` : ''}
      </div>
    `;
  }

  function topProducts() {
    return productos.map(producto => {
      const details = detallePedido.filter(detalle => detalle.id_producto === producto.id_producto);
      return {
        ...producto,
        cantidad: details.reduce((sum, detalle) => sum + Number(detalle.cantidad), 0),
        total: details.reduce((sum, detalle) => sum + Number(detalle.subtotal), 0)
      };
    }).sort((a, b) => b.cantidad - a.cantidad);
  }

  function renderReports() {
    const ventasSucursal = sucursales.map(sucursal => {
      const ps = pedidos.filter(pedido => pedido.id_sucursal === sucursal.id_sucursal);
      const total = ps.reduce((sum, pedido) => sum + Number(pedido.total), 0);
      return { sucursal: sucursal.nombre, total_pedidos: ps.length, total_vendido: total, ticket_promedio: ps.length ? total / ps.length : 0 };
    });

    const ventasCategoria = categorias.map(categoria => {
      const total = detallePedido.filter(detalle => productos.find(producto => producto.id_producto === detalle.id_producto)?.id_categoria === categoria.id_categoria).reduce((sum, detalle) => sum + Number(detalle.subtotal), 0);
      return { categoria: categoria.nombre, total_vendido: total };
    });

    const rendimiento = empleados.map(empleado => {
      const ps = pedidos.filter(pedido => pedido.id_empleado === empleado.id_empleado);
      const total = ps.reduce((sum, pedido) => sum + Number(pedido.total), 0);
      return { empleado: empleado.nombre, pedidos_atendidos: ps.length, total_vendido: total, ticket_promedio: ps.length ? total / ps.length : 0 };
    });

    const monthly = pedidos.reduce((acc, pedido) => {
      const mes = pedido.fecha_raw ? String(pedido.fecha_raw).slice(0, 7) : 'Sin fecha';
      const key = `${mes}|${getSucursal(pedido.id_sucursal)}`;
      acc[key] = acc[key] || { mes, sucursal: getSucursal(pedido.id_sucursal), total_vendido: 0 };
      acc[key].total_vendido += Number(pedido.total);
      return acc;
    }, {});

    const sinMovimiento = productos.filter(producto => !detallePedido.some(detalle => detalle.id_producto === producto.id_producto));

    return `
      <div class="d-grid gap-3">
        ${table(['sucursal', 'total_pedidos', 'total_vendido', 'ticket_promedio'], ventasSucursal.map(item => `<tr><td>${item.sucursal}</td><td>${item.total_pedidos}</td><td>${money(item.total_vendido)}</td><td>${money(item.ticket_promedio)}</td></tr>`).join(''))}
        ${table(['producto', 'categoría', 'cantidad_vendida', 'total_vendido'], topProducts().map(item => `<tr><td>${item.nombre}</td><td>${getCategoria(item.id_categoria)}</td><td>${item.cantidad}</td><td>${money(item.total)}</td></tr>`).join(''))}
        ${table(['categoría', 'total_vendido'], ventasCategoria.map(item => `<tr><td>${item.categoria}</td><td>${money(item.total_vendido)}</td></tr>`).join(''))}
        ${table(['empleado', 'pedidos_atendidos', 'total_vendido', 'ticket_promedio'], rendimiento.map(item => `<tr><td>${item.empleado}</td><td>${item.pedidos_atendidos}</td><td>${money(item.total_vendido)}</td><td>${money(item.ticket_promedio)}</td></tr>`).join(''))}
        ${table(['mes', 'sucursal', 'total_vendido'], Object.values(monthly).map(item => `<tr><td>${item.mes}</td><td>${item.sucursal}</td><td>${money(item.total_vendido)}</td></tr>`).join(''))}
        ${table(['producto', 'categoría', 'estatus'], sinMovimiento.map(item => `<tr><td>${item.nombre}</td><td>${getCategoria(item.id_categoria)}</td><td>${item.estatus}</td></tr>`).join(''))}
      </div>
    `;
  }

  function renderModule(module) {
    const main = getMain();
    if (!main) return;
    main.className = 'content';
    setActiveModule(module);

    const actions = {
      Productos: '<button class="btn btn-primary module-action" data-action="sp_crear_producto" type="button"><i class="bi bi-plus-lg me-1"></i>Nuevo producto</button>',
      Categorías: '<button class="btn btn-primary module-action" data-action="sp_crear_categoria" type="button"><i class="bi bi-plus-lg me-1"></i>Nueva categoría</button>',
      Sucursales: '<button class="btn btn-primary module-action" data-action="sp_crear_sucursal" type="button"><i class="bi bi-plus-lg me-1"></i>Nueva sucursal</button>',
      Empleados: '<button class="btn btn-primary module-action" data-action="sp_crear_empleado" type="button"><i class="bi bi-plus-lg me-1"></i>Nuevo empleado</button>',
      Clientes: '',
      Pedidos: '<button class="btn btn-primary module-action" data-action="sp_nuevo_pedido" type="button"><i class="bi bi-plus-lg me-1"></i>Nuevo pedido</button>',
      Promociones: '<button class="btn btn-primary module-action" data-action="sp_crear_promocion" type="button"><i class="bi bi-plus-lg me-1"></i>Nueva promoción</button>',
    };

    const views = {
      Productos: () => `
        ${moduleHeader('Productos', 'Datos reales de la tabla producto.', actions.Productos)}
        ${table(['producto_id', 'nombre', 'descripción', 'categoría', 'precio_actual', 'costo_preparacion', 'estatus', 'acciones'], productos.map(producto => `
          <tr>
            <td>${producto.id_producto}</td>
            <td><span class="order-id">${producto.nombre}</span></td>
            <td>${producto.descripcion}</td>
            <td>${getCategoria(producto.id_categoria)}</td>
            <td>${money(producto.precio)}</td>
            <td>${money(producto.costo)}</td>
            <td><span class="badge ${badgeClass(producto.estatus)}">${producto.estatus}</span></td>
            <td>${rowActions('producto', producto.id_producto, ['Editar producto', 'Dar de baja producto'])}</td>
          </tr>`).join(''))}
      `,
      Categorías: () => `
        ${moduleHeader('Categorías', 'Datos reales de la tabla categoria.', actions.Categorías)}
        ${table(['categoria_id', 'nombre', 'descripción', 'acciones'], categorias.map(categoria => `
          <tr>
            <td>${categoria.id_categoria}</td>
            <td><span class="order-id">${categoria.nombre}</span></td>
            <td>${categoria.descripcion}</td>
            <td>${rowActions('categoria', categoria.id_categoria, ['Editar categoría'])}</td>
          </tr>`).join(''))}
      `,
      Sucursales: () => `
        ${moduleHeader('Sucursales', 'Datos reales de la tabla sucursal.', actions.Sucursales)}
        ${table(['sucursal_id', 'nombre', 'dirección', 'ciudad', 'teléfono', 'estatus', 'acciones'], sucursales.map(sucursal => `
          <tr>
            <td>${sucursal.id_sucursal}</td>
            <td><span class="order-id">${sucursal.nombre}</span></td>
            <td>${sucursal.direccion}</td>
            <td>${sucursal.ciudad}</td>
            <td>${sucursal.telefono}</td>
            <td><span class="badge ${badgeClass(sucursal.estatus)}">${sucursal.estatus}</span></td>
            <td>${rowActions('sucursal', sucursal.id_sucursal, ['Editar sucursal', 'Dar de baja sucursal'])}</td>
          </tr>`).join(''))}
      `,
      Empleados: () => `
        ${moduleHeader('Empleados', 'Datos reales de la tabla empleado.', actions.Empleados)}
        ${table(['empleado_id', 'nombre_completo', 'teléfono', 'puesto', 'sucursal asignada', 'salario_quincenal', 'fecha_ingreso', 'estatus', 'acciones'], empleados.map(empleado => `
          <tr>
            <td>${empleado.id_empleado}</td>
            <td><span class="order-id">${empleado.nombre}</span></td>
            <td>${empleado.telefono}</td>
            <td>${empleado.puesto}</td>
            <td>${getSucursal(empleado.id_sucursal)}</td>
            <td>${money(empleado.salario)}</td>
            <td>${empleado.fecha_ingreso}</td>
            <td><span class="badge ${badgeClass(empleado.estatus)}">${empleado.estatus}</span></td>
            <td>${rowActions('empleado', empleado.id_empleado, ['Editar empleado', 'Dar de baja empleado'])}</td>
          </tr>`).join(''))}
      `,
      Clientes: () => `
        ${moduleHeader('Clientes', 'Datos reales de la tabla cliente.', '<button class="btn btn-primary module-action" data-action="cliente" type="button"><i class="bi bi-plus-lg me-1"></i>Nuevo cliente</button>')}
        ${table(['cliente_id', 'nombre', 'teléfono', 'correo', 'ciudad', 'fecha_registro', 'acciones'], clientes.filter(cliente => cliente.id_cliente).map(cliente => `
          <tr>
            <td>${cliente.id_cliente}</td>
            <td><span class="order-id">${cliente.nombre}</span></td>
            <td>${cliente.telefono}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.ciudad}</td>
            <td>${cliente.fecha_registro}</td>
            <td>${rowActions('cliente', cliente.id_cliente, ['Editar cliente'])}</td>
          </tr>`).join(''))}
      `,
      Pedidos: () => `
        ${moduleHeader('Pedidos', 'Datos reales de pedido y detalle_pedido.', actions.Pedidos)}
        <div class="card mb-3"><div class="card-body"><select class="form-select filter-select" id="ordersStatusFilter"><option value="todos">Todos</option><option value="pendiente">Pendiente</option><option value="preparando">Preparando</option><option value="listo">Listo</option><option value="entregado">Entregado</option><option value="cancelado">Cancelado</option></select></div></div>
        <div id="ordersTableWrap">${renderPedidosTable(pedidos)}</div>
        <div id="orderDetailWrap" class="mt-3"></div>
      `,
      Promociones: () => `
        ${moduleHeader('Promociones', 'Datos reales de promocion y promocion_producto.', actions.Promociones)}
        ${table(['promocion_id', 'nombre', 'descripción', 'porcentaje_descuento', 'fecha_inicio', 'fecha_fin', 'productos aplicados', 'acciones'], promociones.map(promo => `
          <tr>
            <td>${promo.id_promocion}</td>
            <td><span class="order-id">${promo.nombre}</span></td>
            <td>${promo.descripcion}</td>
            <td>${promo.porcentaje}%</td>
            <td>${promo.fecha_inicio}</td>
            <td>${promo.fecha_fin}</td>
            <td>${productNames(promo.productos) || 'Sin productos'}</td>
            <td>${rowActions('promocion', promo.id_promocion, ['Agregar producto a promoción', 'Aplicar promoción a pedido'])}</td>
          </tr>`).join(''))}
      `,
      Reportes: () => {
        return `${moduleHeader('Reportes', 'Reportes calculados desde pedido, detalle_pedido, producto, categoria, sucursal y empleado.')}${renderReports()}`;
      },
    };

    main.innerHTML = views[module] ? views[module]() : '';
    main.querySelectorAll('.module-action').forEach(button => {
      button.addEventListener('click', () => ejecutarAccionCrud(button.dataset.action));
    });
    main.querySelectorAll('.row-action').forEach(button => {
      button.addEventListener('click', () => handleRowAction(button.dataset.entity, Number(button.dataset.id), button.dataset.label));
    });
    const ordersStatusFilter = document.getElementById('ordersStatusFilter');
    if (ordersStatusFilter) {
      ordersStatusFilter.addEventListener('change', () => {
        const filtered = ordersStatusFilter.value === 'todos' ? pedidos : pedidos.filter(pedido => pedido.estado === ordersStatusFilter.value);
        document.getElementById('ordersTableWrap').innerHTML = renderPedidosTable(filtered);
        document.querySelectorAll('#ordersTableWrap .row-action').forEach(button => {
          button.addEventListener('click', () => handleRowAction(button.dataset.entity, Number(button.dataset.id), button.dataset.label));
        });
      });
    }

    if (window.innerWidth <= 992) document.getElementById('sidebar')?.classList.remove('show');
  }

  async function handleRowAction(entity, id, label) {
    if (entity === 'pedido' && label === 'Ver detalle') {
      const rows = getDetalleByPedido(id).map(detalle => {
        const product = productos.find(item => item.id_producto === detalle.id_producto);
        return `<tr><td>${product?.nombre || 'Producto'}</td><td>${detalle.cantidad}</td><td>${money(detalle.precio_unitario)}</td><td>${money(detalle.subtotal)}</td></tr>`;
      }).join('');
      const pedido = pedidos.find(item => item.id_pedido === id);
      document.getElementById('orderDetailWrap').innerHTML = `
        ${moduleHeader(`Detalle del pedido #${id}`, `${getSucursal(pedido?.id_sucursal)} · ${getEmpleado(pedido?.id_empleado)} · ${money(pedido?.total || 0)}`)}
        ${table(['producto', 'cantidad', 'precio_unitario', 'subtotal'], rows)}
      `;
      return;
    }

    if (entity === 'pedido' && ['Preparar', 'Marcar listo', 'Entregar'].includes(label)) {
      const pedido = pedidos.find(item => item.id_pedido === id);
      const estado = normalizeStatus(pedido?.estado);
      const endpoint = statusEndpoint[estado];

      if (!endpoint) {
        showToast('Este pedido no permite cambio de estatus');
        return;
      }

      try {
        await apiRequest(`/pedidos/${id}/${endpoint}`, { method: 'PATCH' });
        await refreshDataAndView('Pedidos');
        showToast(statusMessages[endpoint]);
      } catch (error) {
        showToast(error.message);
      }
      return;
    }

    if (entity === 'pedido' && label === 'Cancelar') {
      const pedido = pedidos.find(item => item.id_pedido === id);
      const canCancel = ['pendiente', 'preparando'].includes(pedido?.estado);
      if (!canCancel) {
        showToast('Solo se puede cancelar si está pendiente o preparando');
        return;
      }

      if (!confirm('¿Seguro que deseas cancelar este pedido?')) return;

      try {
        await apiRequest(`/pedidos/${id}/cancelar`, { method: 'PATCH' });
        await refreshDataAndView('Pedidos');
        showToast(statusMessages.cancelar);
      } catch (error) {
        showToast(error.message);
      }
      return;
    }

    if (entity === 'promocion' && label === 'Aplicar promoción a pedido') {
      try {
        const pedidoId = prompt('pedido_id al que se aplicará la promoción:');
        if (!pedidoId) return;
        await apiRequest(`/pedidos/${pedidoId}/promocion`, {
          method: 'POST',
          body: JSON.stringify({ promocion_id: id })
        });
        await refreshDataAndView('Promociones');
        showToast('Promoción aplicada');
      } catch (error) {
        showToast(error.message);
      }
      return;
    }

    if (entity === 'promocion' && label === 'Agregar producto a promoción') {
      showToast('Endpoint requerido: POST para sp_agregar_producto_promocion');
      return;
    }

    showToast(`${label}: endpoint requerido para ${entity} #${id}`);
  }

  async function ejecutarAccionCrud(action) {
    try {
      const handlers = {
        sp_crear_producto: async () => apiRequest('/productos', {
          method: 'POST',
          body: JSON.stringify({
            nombre: prompt('Nombre del producto:'),
            descripcion: prompt('Descripción:') || '',
            categoria_id: Number(prompt('ID categoría:') || 1),
            precio_actual: Number(prompt('Precio:') || 0),
            costo_preparacion: Number(prompt('Costo:') || 0)
          })
        }),
        sp_crear_categoria: async () => apiRequest('/categorias', {
          method: 'POST',
          body: JSON.stringify({ nombre: prompt('Nombre de categoría:'), descripcion: prompt('Descripción:') || '' })
        }),
        sp_crear_sucursal: async () => apiRequest('/sucursales', {
          method: 'POST',
          body: JSON.stringify({
            nombre: prompt('Nombre de sucursal:'),
            direccion: prompt('Dirección:'),
            ciudad: prompt('Ciudad:'),
            telefono: prompt('Teléfono:') || ''
          })
        }),
        sp_crear_empleado: async () => apiRequest('/empleados', {
          method: 'POST',
          body: JSON.stringify({
            nombre_completo: prompt('Nombre completo:'),
            telefono: prompt('Teléfono:') || '',
            puesto: prompt('Puesto:') || 'Cajero',
            sucursal_id: Number(prompt('ID sucursal:') || 1),
            salario_quincenal: Number(prompt('Salario quincenal:') || 0),
            fecha_ingreso: new Date().toISOString().slice(0, 10)
          })
        }),
        sp_crear_promocion: async () => openPromotionModal(),
        cliente: async () => apiRequest('/clientes', {
          method: 'POST',
          body: JSON.stringify({
            nombre: prompt('Nombre del cliente:'),
            telefono: prompt('Teléfono:') || '',
            correo: prompt('Correo:') || '',
            ciudad: prompt('Ciudad:') || ''
          })
        }),
        sp_nuevo_pedido: async () => { window.location.href = 'index.html'; },
      };

      const result = await handlers[action]?.();
      if (action !== 'sp_crear_promocion') {
        await refreshDataAndView(getActiveModule() || 'Productos');
        showToast(result?.message || 'Registro guardado correctamente');
      }
    } catch (error) {
      showToast(error.message);
    }
  }

  function ensurePromotionModal() {
    let modal = document.getElementById('promotionModal');
    if (modal) return modal;

    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade" id="promotionModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0" style="border-radius: 24px;">
            <form id="promotionForm">
              <div class="modal-header border-0">
                <h5 class="modal-title fw-bold">Nueva promoción</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" name="nombre" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" name="descripcion" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Porcentaje descuento</label>
                  <input type="number" class="form-control" name="porcentaje_descuento" min="1" max="100" step="0.01" required>
                </div>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Fecha inicio</label>
                    <input type="date" class="form-control" name="fecha_inicio" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Fecha fin</label>
                    <input type="date" class="form-control" name="fecha_fin" required>
                  </div>
                </div>
              </div>
              <div class="modal-footer border-0">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar promoción</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `);

    modal = document.getElementById('promotionModal');
    const form = document.getElementById('promotionForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = {
        nombre: formData.get('nombre')?.trim(),
        descripcion: formData.get('descripcion')?.trim() || '',
        porcentaje_descuento: Number(formData.get('porcentaje_descuento')),
        fecha_inicio: formData.get('fecha_inicio'),
        fecha_fin: formData.get('fecha_fin')
      };

      try {
        const result = await apiRequest('/promociones', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        bootstrap.Modal.getOrCreateInstance(modal).hide();
        form.reset();
        await refreshDataAndView('Promociones');
        showToast(result?.message || 'Promoción guardada correctamente');
      } catch (error) {
        showToast(error.message);
      }
    });

    return modal;
  }

  function openPromotionModal() {
    const modal = ensurePromotionModal();
    bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  function reportCard(title, rows) {
    return `
      <div class="report-card">
        <h5>${title}</h5>
        <div class="d-grid gap-2">
          ${rows.map((row, index) => `
            <div class="report-row">
              <span>${row}</span>
              <div class="progress"><div class="progress-bar" style="width: ${Math.max(24, 100 - index * 18)}%"></div></div>
            </div>`).join('')}
        </div>
      </div>
    `;
  }

  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('show'));
    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 992 && !sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
        sidebar.classList.remove('show');
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username')?.value.trim();
      const password = document.getElementById('password')?.value.trim();

      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('usuarioLogueado', 'admin');
        window.location.href = 'dashboard.html';
        return;
      }

      showToast('Usuario o contraseña incorrectos');
    });
  }

  document.querySelectorAll('.logout-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('usuarioLogueado');
      window.location.href = 'login.html';
    });
  });

  document.querySelectorAll('.module-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      renderModule(link.dataset.module);
    });
  });

  document.querySelectorAll('.simulate-sp').forEach(button => {
    button.addEventListener('click', () => ejecutarAccionCrud(button.dataset.sp));
  });

  const viewPromoBtn = document.getElementById('viewPromoBtn');
  if (viewPromoBtn) {
    viewPromoBtn.addEventListener('click', () => renderModule('Promociones'));
  }

  function renderDashboard() {
    const recentOrdersBody = document.getElementById('recentOrdersBody');
    const topProductsList = document.getElementById('topProductsList');
    const branchesList = document.getElementById('branchesList');
    const promotionsList = document.getElementById('promotionsList');
    if (!recentOrdersBody) return;

    const totalVentas = pedidos.reduce((sum, pedido) => sum + Number(pedido.total), 0);
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    setText('statVentas', money(totalVentas));
    setText('statPedidos', pedidos.length);
    setText('statPendientes', pedidos.filter(pedido => pedido.estado === 'pendiente').length);
    setText('statCancelados', pedidos.filter(pedido => pedido.estado === 'cancelado').length);
    setText('statProductos', productos.filter(producto => producto.estatus === 'disponible').length);
    setText('statPromociones', promociones.length);
    setText('statSucursales', sucursales.filter(sucursal => sucursal.estatus === 'activa').length);

    const renderOrders = (estado = 'todos') => {
      const filtered = estado === 'todos' ? pedidos : pedidos.filter(pedido => pedido.estado === estado);
      recentOrdersBody.innerHTML = filtered.map(pedido => `
        <tr>
          <td><span class="order-id">#${pedido.id_pedido}</span></td>
          <td>${getSucursal(pedido.id_sucursal)}</td>
          <td>${getEmpleado(pedido.id_empleado)}</td>
          <td>${getCliente(pedido.id_cliente)}</td>
          <td>${pedido.tipo_pedido}</td>
          <td><span class="badge ${badgeClass(pedido.estado)}">${formatStatus(pedido.estado)}</span></td>
          <td>${money(pedido.total)}</td>
          <td>${pedido.fecha_hora}</td>
        </tr>
      `).join('');
    };

    renderOrders();
    document.getElementById('statusFilter')?.addEventListener('change', event => renderOrders(event.target.value));
    document.getElementById('dashboardSearch')?.addEventListener('input', event => {
      const q = event.target.value.toLowerCase();
      recentOrdersBody.querySelectorAll('tr').forEach(row => row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none');
    });

    if (topProductsList) {
      const vendidos = topProducts().slice(0, 5);

      topProductsList.innerHTML = vendidos.map((producto, index) => `
        <div class="top-product mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span>${producto.nombre}</span>
            <span class="text-warning">${producto.cantidad} · ${money(producto.total)}</span>
          </div>
          <div class="progress" style="height: 7px;"><div class="progress-bar" style="width: ${Math.max(20, 100 - index * 16)}%"></div></div>
        </div>
      `).join('');
    }

    if (branchesList) {
      branchesList.innerHTML = sucursales.map(sucursal => `
        <div class="mini-order-card">
          <div><strong>${sucursal.nombre}</strong><span class="text-muted small">${sucursal.ciudad} · ${sucursal.telefono}</span></div>
          <span class="badge ${badgeClass(sucursal.estatus)}">${sucursal.estatus}</span>
        </div>
      `).join('');
    }

    if (promotionsList) {
      promotionsList.innerHTML = promociones.map(promo => `
        <div class="mini-order-card">
          <div><strong>${promo.nombre}</strong><span class="text-muted small">${promo.porcentaje}% · ${productNames(promo.productos)}</span></div>
          <span class="badge bg-success">Vigente</span>
        </div>
      `).join('');
    }
  }

  function fillSelects() {
    const branchSelect = document.getElementById('branchSelect');
    const employeeSelect = document.getElementById('employeeSelect');
    const clientSelect = document.getElementById('clientSelect');
    if (!branchSelect || !employeeSelect || !clientSelect) return;

    branchSelect.innerHTML = sucursales.map(sucursal => `<option value="${sucursal.id_sucursal}">${sucursal.nombre}</option>`).join('');
    clientSelect.innerHTML = clientes.map(cliente => `<option value="${cliente.id_cliente ?? ''}">${cliente.nombre}</option>`).join('');

    const renderEmployees = () => {
      const idSucursal = Number(branchSelect.value);
      employeeSelect.innerHTML = empleados
        .filter(empleado => empleado.id_sucursal === idSucursal)
        .map(empleado => `<option value="${empleado.id_empleado}">${empleado.nombre} - ${empleado.puesto}</option>`)
        .join('');
    };

    branchSelect.addEventListener('change', () => { renderEmployees(); showToast('Sucursal seleccionada.'); });
    employeeSelect.addEventListener('change', () => showToast('Empleado/cajero seleccionado.'));
    clientSelect.addEventListener('change', () => showToast('Cliente seleccionado para el pedido.'));
    document.getElementById('orderTypeSelect')?.addEventListener('change', () => showToast('Tipo de pedido actualizado.'));
    renderEmployees();
  }

  function renderCategories() {
    const categoryTabs = document.getElementById('categoryTabs');
    if (!categoryTabs) return;
    categoryTabs.innerHTML = `
      <li class="nav-item"><a class="nav-link active" data-category="todos">Todas</a></li>
      ${categorias.map(categoria => `<li class="nav-item"><a class="nav-link" data-category="${categoria.id_categoria}">${categoria.nombre}</a></li>`).join('')}
    `;
    categoryTabs.querySelectorAll('.nav-link').forEach(tab => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        categoryTabs.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        categoriaActual = tab.dataset.category;
        renderProducts();
      });
    });
  }

  function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    const productSearch = document.getElementById('productSearch');
    if (!productGrid) return;
    const q = productSearch?.value.toLowerCase() || '';
    const filtered = productos.filter(producto => {
      const categoryMatch = categoriaActual === 'todos' || producto.id_categoria === Number(categoriaActual);
      const searchMatch = producto.nombre.toLowerCase().includes(q) || getCategoria(producto.id_categoria).toLowerCase().includes(q);
      return producto.disponible && categoryMatch && searchMatch;
    });

    productGrid.innerHTML = filtered.length ? filtered.map(producto => `
      <div class="col-12 col-sm-6 col-xl-4 col-xxl-3">
        <div class="product-card">
          <div class="product-visual"><span class="product-tag">${getCategoria(producto.id_categoria)}</span><i class="bi ${producto.icon}"></i></div>
          <div class="product-name">${producto.nombre}</div>
          <div class="product-category">producto.id_producto: ${producto.id_producto}</div>
          <p class="product-desc">${producto.descripcion}</p>
          <span class="badge ${badgeClass(producto.estatus)}">${producto.estatus}</span>
          <div class="product-footer">
            <div class="product-price">${money(producto.precio)}</div>
            <button class="btn btn-add" data-product="${producto.id_producto}" type="button" title="Agregar producto"><i class="bi bi-plus-lg"></i></button>
          </div>
        </div>
      </div>
    `).join('') : `<div class="col-12"><div class="card"><div class="card-body text-center text-muted">No hay productos disponibles.</div></div></div>`;

    productGrid.querySelectorAll('.btn-add').forEach(button => button.addEventListener('click', () => addProduct(Number(button.dataset.product))));
  }

  function addProduct(idProducto) {
    const producto = productos.find(item => item.id_producto === idProducto);
    if (!producto) return;
    const item = carrito.find(detalle => detalle.id_producto === idProducto);
    if (item) {
      item.cantidad += 1;
      item.subtotal = item.cantidad * item.precio_unitario;
    } else {
      carrito.push({ id_producto: producto.id_producto, nombre: producto.nombre, cantidad: 1, precio_unitario: producto.precio, subtotal: producto.precio });
    }
    descuentoAplicado = 0;
    renderCart();
    showToast('Producto agregado al carrito');
  }

  function updateQuantity(idProducto, delta) {
    const item = carrito.find(detalle => detalle.id_producto === idProducto);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) carrito = carrito.filter(detalle => detalle.id_producto !== idProducto);
    else item.subtotal = item.cantidad * item.precio_unitario;
    descuentoAplicado = 0;
    renderCart();
  }

  function removeProduct(idProducto) {
    carrito = carrito.filter(detalle => detalle.id_producto !== idProducto);
    descuentoAplicado = 0;
    renderCart();
    showToast('Producto eliminado del carrito');
  }

  function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartCount = document.getElementById('cartCount');
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!cartItems) return;

    const subtotal = carrito.reduce((total, item) => total + item.subtotal, 0);
    const total = Math.max(0, subtotal - descuentoAplicado);
    const count = carrito.reduce((totalItems, item) => totalItems + item.cantidad, 0);

    cartEmpty.style.display = carrito.length ? 'none' : 'block';
    cartCount.textContent = count;
    subtotalEl.textContent = money(subtotal);
    discountEl.textContent = `-${money(descuentoAplicado)}`;
    totalEl.textContent = money(total);
    applyPromoBtn.disabled = carrito.length === 0;
    if (clearCartBtn) clearCartBtn.disabled = carrito.length === 0;
    checkoutBtn.disabled = carrito.length === 0;

    cartItems.innerHTML = carrito.map(item => `
      <div class="cart-item">
        <div class="cart-item-info"><span class="cart-item-name">${item.nombre}</span><span class="cart-item-price">${item.cantidad} x ${money(item.precio_unitario)} = ${money(item.subtotal)}</span></div>
        <div class="cart-item-qty"><button class="qty-minus" data-product="${item.id_producto}" type="button">-</button><span>${item.cantidad}</span><button class="qty-plus" data-product="${item.id_producto}" type="button">+</button></div>
        <button class="btn-remove" data-product="${item.id_producto}" type="button"><i class="bi bi-trash"></i></button>
      </div>
    `).join('');

    cartItems.querySelectorAll('.qty-minus').forEach(button => button.addEventListener('click', () => updateQuantity(Number(button.dataset.product), -1)));
    cartItems.querySelectorAll('.qty-plus').forEach(button => button.addEventListener('click', () => updateQuantity(Number(button.dataset.product), 1)));
    cartItems.querySelectorAll('.btn-remove').forEach(button => button.addEventListener('click', () => removeProduct(Number(button.dataset.product))));
  }

  document.getElementById('applyPromoBtn')?.addEventListener('click', () => {
    aplicarPromocionReal();
  });

  document.getElementById('clearCartBtn')?.addEventListener('click', () => {
    carrito = [];
    descuentoAplicado = 0;
    pedidoActualId = null;
    renderCart();
    showToast('Carrito limpio');
  });

  async function aplicarPromocionReal() {
    try {
      const promo = promociones.find(item => item.vigente && carrito.some(detalle => item.productos.includes(detalle.id_producto)));
      if (!promo) {
        showToast('No hay promoción aplicable para estos productos.');
        return;
      }

      const pedidoId = await crearPedidoDesdeCarrito();
      // Frontend -> Backend: Express ejecuta CALL sp_aplicar_promocion(...).
      const pedido = await apiRequest(`/pedidos/${pedidoId}/promocion`, {
        method: 'POST',
        body: JSON.stringify({ promocion_id: promo.id_promocion })
      });

      descuentoAplicado = Math.max(0, carrito.reduce((sum, item) => sum + item.subtotal, 0) - Number(pedido.total || 0));
      renderCart();
      showToast(`Promoción aplicada: ${promo.nombre}`);
    } catch (error) {
      showToast(error.message);
    }
  }

  document.getElementById('checkoutBtn')?.addEventListener('click', async () => {
    try {
      if (!carrito.length) return;
      const pedidoId = await crearPedidoDesdeCarrito();
      carrito = [];
      descuentoAplicado = 0;
      pedidoActualId = null;
      await refreshDataAndView(getActiveModule());
      renderCart();
      showToast(`Pedido confirmado #${pedidoId}`);
    } catch (error) {
      showToast(error.message);
    }
  });

  document.getElementById('productSearch')?.addEventListener('input', renderProducts);

  (async function initApp() {
    await cargarCatalogosAPI();
    await cargarProductosAPI();
    fillSelects();
    renderCategories();
    renderDashboard();
    renderCart();
  })();
});
