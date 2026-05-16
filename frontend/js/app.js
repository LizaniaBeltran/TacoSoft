document.addEventListener('DOMContentLoaded', () => {
  const sucursales = [
    { id_sucursal: 1, nombre: 'TacoSoft Centro', ciudad: 'Ciudad Universitaria', direccion: 'Av. Universidad 120', telefono: '555-110-2400', estatus: 'Activa' },
    { id_sucursal: 2, nombre: 'TacoSoft Norte', ciudad: 'Monterrey', direccion: 'Blvd. Independencia 45', telefono: '818-220-7711', estatus: 'Activa' },
    { id_sucursal: 3, nombre: 'TacoSoft Sur', ciudad: 'Puebla', direccion: 'Calle Reforma 88', telefono: '222-441-0933', estatus: 'Activa' },
  ];

  const categorias = [
    { id_categoria: 1, nombre: 'Tacos', descripcion: 'Productos principales servidos en tortilla.' },
    { id_categoria: 2, nombre: 'Tortas', descripcion: 'Tortas preparadas con proteína y complementos.' },
    { id_categoria: 3, nombre: 'Bebidas', descripcion: 'Bebidas disponibles para pedidos.' },
    { id_categoria: 4, nombre: 'Complementos', descripcion: 'Productos adicionales para acompañar pedidos.' },
  ];

  const productos = [
    { id_producto: 1, id_categoria: 1, nombre: 'Taco al Pastor', precio: 35, costo: 18, estatus: 'Activo', disponible: true, icon: 'bi-egg-fried' },
    { id_producto: 2, id_categoria: 1, nombre: 'Taco de Suadero', precio: 38, costo: 20, estatus: 'Activo', disponible: true, icon: 'bi-egg-fried' },
    { id_producto: 3, id_categoria: 1, nombre: 'Taco de Barbacoa', precio: 42, costo: 24, estatus: 'Activo', disponible: true, icon: 'bi-egg-fried' },
    { id_producto: 4, id_categoria: 2, nombre: 'Torta al Pastor', precio: 68, costo: 38, estatus: 'Activo', disponible: true, icon: 'bi-bread' },
    { id_producto: 5, id_categoria: 2, nombre: 'Torta de Suadero', precio: 72, costo: 41, estatus: 'Activo', disponible: true, icon: 'bi-bread' },
    { id_producto: 6, id_categoria: 3, nombre: 'Agua de Horchata', precio: 24, costo: 9, estatus: 'Activo', disponible: true, icon: 'bi-cup-straw' },
    { id_producto: 7, id_categoria: 3, nombre: 'Agua de Jamaica', precio: 24, costo: 8, estatus: 'Activo', disponible: true, icon: 'bi-cup-straw' },
    { id_producto: 8, id_categoria: 4, nombre: 'Orden de Guacamole', precio: 45, costo: 25, estatus: 'Activo', disponible: true, icon: 'bi-basket' },
    { id_producto: 9, id_categoria: 4, nombre: 'Frijoles Charros', precio: 40, costo: 21, estatus: 'Activo', disponible: true, icon: 'bi-bowl-hot' },
  ];

  const empleados = [
    { id_empleado: 1, id_sucursal: 1, nombre: 'Luis Herrera', puesto: 'Cajero', salario: 9800, estatus: 'Activo' },
    { id_empleado: 2, id_sucursal: 1, nombre: 'Ana Martínez', puesto: 'Encargada', salario: 13200, estatus: 'Activo' },
    { id_empleado: 3, id_sucursal: 2, nombre: 'Sofía Ramos', puesto: 'Cajera', salario: 9600, estatus: 'Activo' },
    { id_empleado: 4, id_sucursal: 3, nombre: 'Diego Cruz', puesto: 'Cajero', salario: 9500, estatus: 'Activo' },
  ];

  const clientes = [
    { id_cliente: null, nombre: 'Cliente general', telefono: 'N/A', correo: 'N/A', ciudad: 'N/A' },
    { id_cliente: 1, nombre: 'Carlos López', telefono: '555-842-1900', correo: 'carlos@correo.com', ciudad: 'Ciudad Universitaria' },
    { id_cliente: 2, nombre: 'María García', telefono: '818-774-2020', correo: 'maria@correo.com', ciudad: 'Monterrey' },
    { id_cliente: 3, nombre: 'Pedro Sánchez', telefono: '222-662-4821', correo: 'pedro@correo.com', ciudad: 'Puebla' },
  ];

  const promociones = [
    { id_promocion: 1, nombre: 'Combo Pastor', porcentaje: 12, fecha_inicio: '2026-05-01', fecha_fin: '2026-05-31', vigente: true, productos: [1, 6] },
    { id_promocion: 2, nombre: 'Tortas Martes', porcentaje: 10, fecha_inicio: '2026-05-01', fecha_fin: '2026-06-15', vigente: true, productos: [4, 5] },
    { id_promocion: 3, nombre: 'Bebidas en Pedido Grande', porcentaje: 8, fecha_inicio: '2026-05-10', fecha_fin: '2026-05-30', vigente: true, productos: [6, 7] },
    { id_promocion: 4, nombre: 'Cliente Frecuente', porcentaje: 15, fecha_inicio: '2026-05-01', fecha_fin: '2026-07-01', vigente: true, productos: [1, 2, 3] },
  ];

  const pedidos = [
    { id_pedido: 124, id_sucursal: 1, id_cliente: 1, id_empleado: 1, tipo_pedido: 'para llevar', total: 142, estado: 'Confirmado' },
    { id_pedido: 125, id_sucursal: 2, id_cliente: 2, id_empleado: 3, tipo_pedido: 'a domicilio', total: 210, estado: 'Pendiente' },
    { id_pedido: 126, id_sucursal: 1, id_cliente: null, id_empleado: 2, tipo_pedido: 'en local', total: 105, estado: 'Confirmado' },
    { id_pedido: 127, id_sucursal: 3, id_cliente: 3, id_empleado: 4, tipo_pedido: 'para llevar', total: 72, estado: 'Cancelado' },
    { id_pedido: 128, id_sucursal: 1, id_cliente: 2, id_empleado: 1, tipo_pedido: 'en local', total: 185, estado: 'Confirmado' },
  ];

  const detallePedido = [
    { id_pedido: 124, id_producto: 1, cantidad: 2, precio_unitario: 35, subtotal: 70 },
    { id_pedido: 124, id_producto: 6, cantidad: 3, precio_unitario: 24, subtotal: 72 },
    { id_pedido: 125, id_producto: 4, cantidad: 2, precio_unitario: 68, subtotal: 136 },
    { id_pedido: 125, id_producto: 8, cantidad: 1, precio_unitario: 45, subtotal: 45 },
    { id_pedido: 126, id_producto: 2, cantidad: 2, precio_unitario: 38, subtotal: 76 },
    { id_pedido: 128, id_producto: 3, cantidad: 3, precio_unitario: 42, subtotal: 126 },
  ];

  let carrito = [];
  let categoriaActual = 'todos';
  let descuentoAplicado = 0;

  const money = (value) => `$${Number(value).toFixed(2)}`;
  const getSucursal = (id) => sucursales.find(item => item.id_sucursal === id)?.nombre || 'Sin sucursal';
  const getCliente = (id) => clientes.find(item => item.id_cliente === id)?.nombre || 'Cliente general';
  const getEmpleado = (id) => empleados.find(item => item.id_empleado === id)?.nombre || 'Sin empleado';
  const getCategoria = (id) => categorias.find(item => item.id_categoria === id)?.nombre || 'Sin categoría';
  const badgeClass = (estatus) => estatus === 'Cancelado' || estatus === 'Inactivo' ? 'bg-danger' : estatus === 'Pendiente' ? 'bg-warning' : 'bg-success';

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

  const setActiveModule = (module) => {
    document.querySelectorAll('.sidebar .nav-item').forEach(item => item.classList.remove('active'));
    const link = document.querySelector(`.module-link[data-module="${module}"]`);
    if (link) link.classList.add('active');
  };

  const moduleHeader = (title, subtitle, action = '') => `
    <div class="module-header">
      <div>
        <span class="soft-pill mb-2"><i class="bi bi-database-check"></i> Datos simulados PostgreSQL</span>
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
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const productNames = (ids) => ids.map(id => productos.find(producto => producto.id_producto === id)?.nombre).filter(Boolean).join(', ');

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
      Clientes: '<button class="btn btn-primary module-action" data-action="cliente_simulado" type="button"><i class="bi bi-plus-lg me-1"></i>Nuevo cliente</button>',
      Pedidos: '<button class="btn btn-primary module-action" data-action="sp_nuevo_pedido" type="button"><i class="bi bi-plus-lg me-1"></i>Nuevo pedido</button>',
      Promociones: '<button class="btn btn-primary module-action" data-action="sp_crear_promocion" type="button"><i class="bi bi-plus-lg me-1"></i>Nueva promoción</button>',
    };

    const views = {
      Productos: () => `
        ${moduleHeader('Productos', 'Tabla producto con categoría, precio, costo y estatus.', actions.Productos)}
        ${table(['Producto', 'Categoría', 'Precio', 'Costo', 'Estatus'], productos.map(producto => `
          <tr>
            <td><span class="order-id">${producto.nombre}</span></td>
            <td>${getCategoria(producto.id_categoria)}</td>
            <td>${money(producto.precio)}</td>
            <td>${money(producto.costo)}</td>
            <td><span class="badge ${badgeClass(producto.estatus)}">${producto.estatus}</span></td>
          </tr>`).join(''))}
      `,
      Categorías: () => `
        ${moduleHeader('Categorías', 'Listado de categorías registradas para producto.', actions.Categorías)}
        <div class="module-grid">${categorias.map(categoria => `
          <div class="module-card">
            <span class="module-icon"><i class="bi bi-diagram-3"></i></span>
            <h5>${categoria.nombre}</h5>
            <p>${categoria.descripcion}</p>
          </div>`).join('')}</div>
      `,
      Sucursales: () => `
        ${moduleHeader('Sucursales', 'Listado sucursal con ciudad, teléfono y estatus.', actions.Sucursales)}
        ${table(['Sucursal', 'Ciudad', 'Teléfono', 'Dirección', 'Estatus'], sucursales.map(sucursal => `
          <tr>
            <td><span class="order-id">${sucursal.nombre}</span></td>
            <td>${sucursal.ciudad}</td>
            <td>${sucursal.telefono}</td>
            <td>${sucursal.direccion}</td>
            <td><span class="badge ${badgeClass(sucursal.estatus)}">${sucursal.estatus}</span></td>
          </tr>`).join(''))}
      `,
      Empleados: () => `
        ${moduleHeader('Empleados', 'Listado empleado con puesto, sucursal, salario y estatus.', actions.Empleados)}
        ${table(['Empleado', 'Puesto', 'Sucursal', 'Salario', 'Estatus'], empleados.map(empleado => `
          <tr>
            <td><span class="order-id">${empleado.nombre}</span></td>
            <td>${empleado.puesto}</td>
            <td>${getSucursal(empleado.id_sucursal)}</td>
            <td>${money(empleado.salario)}</td>
            <td><span class="badge ${badgeClass(empleado.estatus)}">${empleado.estatus}</span></td>
          </tr>`).join(''))}
      `,
      Clientes: () => `
        ${moduleHeader('Clientes', 'Listado cliente con datos de contacto simulados.', actions.Clientes)}
        ${table(['Cliente', 'Teléfono', 'Correo', 'Ciudad'], clientes.filter(cliente => cliente.id_cliente).map(cliente => `
          <tr>
            <td><span class="order-id">${cliente.nombre}</span></td>
            <td>${cliente.telefono}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.ciudad}</td>
          </tr>`).join(''))}
      `,
      Pedidos: () => `
        ${moduleHeader('Pedidos', 'Tabla pedido con sucursal, empleado, cliente, tipo, estatus y total.', actions.Pedidos)}
        ${table(['Pedido', 'Sucursal', 'Empleado', 'Cliente', 'Tipo', 'Estatus', 'Total'], pedidos.map(pedido => `
          <tr>
            <td><span class="order-id">#${pedido.id_pedido}</span></td>
            <td>${getSucursal(pedido.id_sucursal)}</td>
            <td>${getEmpleado(pedido.id_empleado)}</td>
            <td>${getCliente(pedido.id_cliente)}</td>
            <td>${pedido.tipo_pedido}</td>
            <td><span class="badge ${badgeClass(pedido.estado)}">${pedido.estado}</span></td>
            <td>${money(pedido.total)}</td>
          </tr>`).join(''))}
      `,
      Promociones: () => `
        ${moduleHeader('Promociones', 'Promociones con porcentaje, vigencia y productos aplicados.', actions.Promociones)}
        <div class="module-grid">${promociones.map(promo => `
          <div class="module-card wide">
            <div class="d-flex justify-content-between align-items-start gap-3">
              <div>
                <span class="module-icon mb-3"><i class="bi bi-tags"></i></span>
                <h5>${promo.nombre}</h5>
              </div>
              <span class="badge bg-success">${promo.porcentaje}%</span>
            </div>
            <p class="mb-2">${promo.fecha_inicio} al ${promo.fecha_fin}</p>
            <p class="mb-0"><strong>Productos:</strong> ${productNames(promo.productos)}</p>
          </div>`).join('')}</div>
      `,
      Reportes: () => {
        const ventasSucursal = sucursales.map(sucursal => ({ nombre: sucursal.nombre, total: pedidos.filter(pedido => pedido.id_sucursal === sucursal.id_sucursal).reduce((sum, pedido) => sum + pedido.total, 0) }));
        const productosVendidos = productos.map(producto => ({ nombre: producto.nombre, cantidad: detallePedido.filter(detalle => detalle.id_producto === producto.id_producto).reduce((sum, detalle) => sum + detalle.cantidad, 0) })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 4);
        const ventasCategoria = categorias.map(categoria => ({ nombre: categoria.nombre, total: detallePedido.filter(detalle => productos.find(producto => producto.id_producto === detalle.id_producto)?.id_categoria === categoria.id_categoria).reduce((sum, detalle) => sum + detalle.subtotal, 0) }));
        const rendimiento = empleados.map(empleado => ({ nombre: empleado.nombre, pedidos: pedidos.filter(pedido => pedido.id_empleado === empleado.id_empleado).length }));
        return `
          ${moduleHeader('Reportes', 'Indicadores simulados usando pedido, detalle_pedido, producto, categoría, sucursal y empleado.')}
          <div class="report-grid">
            ${reportCard('Ventas por sucursal', ventasSucursal.map(item => `${item.nombre}: ${money(item.total)}`))}
            ${reportCard('Productos más vendidos', productosVendidos.map(item => `${item.nombre}: ${item.cantidad} vendidos`))}
            ${reportCard('Ventas por categoría', ventasCategoria.map(item => `${item.nombre}: ${money(item.total)}`))}
            ${reportCard('Rendimiento de empleados', rendimiento.map(item => `${item.nombre}: ${item.pedidos} pedidos`))}
          </div>
        `;
      },
    };

    main.innerHTML = views[module] ? views[module]() : '';
    main.querySelectorAll('.module-action').forEach(button => {
      button.addEventListener('click', () => showToast(`Acción simulada: ${button.dataset.action}`));
    });

    if (window.innerWidth <= 992) document.getElementById('sidebar')?.classList.remove('show');
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
      showToast('Inicio de sesión simulado. Redirigiendo al dashboard.');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 450);
    });
  }

  document.querySelectorAll('.module-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      renderModule(link.dataset.module);
    });
  });

  document.querySelectorAll('.simulate-sp').forEach(button => {
    button.addEventListener('click', () => showToast(`Procedimiento simulado: ${button.dataset.sp}`));
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

    const renderOrders = (estado = 'todos') => {
      const filtered = estado === 'todos' ? pedidos : pedidos.filter(pedido => pedido.estado === estado);
      recentOrdersBody.innerHTML = filtered.map(pedido => `
        <tr>
          <td><span class="order-id">#${pedido.id_pedido}</span></td>
          <td>${getSucursal(pedido.id_sucursal)}</td>
          <td>${getCliente(pedido.id_cliente)}</td>
          <td>${getEmpleado(pedido.id_empleado)}</td>
          <td>${pedido.tipo_pedido}</td>
          <td>${money(pedido.total)}</td>
          <td><span class="badge ${badgeClass(pedido.estado)}">${pedido.estado}</span></td>
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
      const vendidos = productos.map(producto => {
        const cantidad = detallePedido.filter(detalle => detalle.id_producto === producto.id_producto).reduce((total, detalle) => total + detalle.cantidad, 0);
        return { ...producto, cantidad };
      }).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);

      topProductsList.innerHTML = vendidos.map((producto, index) => `
        <div class="top-product mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span>${producto.nombre}</span>
            <span class="text-warning">${producto.cantidad} vendidos</span>
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
          <p class="product-desc">Disponible para detalle_pedido con precio unitario simulado.</p>
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
    showToast('sp_agregar_producto_pedido simulado: producto agregado al detalle.');
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
    showToast('Producto eliminado del detalle_pedido simulado.');
  }

  function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartCount = document.getElementById('cartCount');
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
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
    const subtotal = carrito.reduce((total, item) => total + item.subtotal, 0);
    const promo = promociones.find(item => item.vigente && carrito.some(detalle => item.productos.includes(detalle.id_producto)));
    descuentoAplicado = promo ? Math.min(subtotal * (promo.porcentaje / 100), subtotal) : 0;
    renderCart();
    showToast(promo ? `sp_aplicar_promocion simulado: ${promo.nombre}` : 'No hay promoción aplicable para estos productos.');
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (!carrito.length) return;
    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0) - descuentoAplicado;
    const branch = document.getElementById('branchSelect')?.value;
    const employee = document.getElementById('employeeSelect')?.value;
    const type = document.getElementById('orderTypeSelect')?.value;
    carrito = [];
    descuentoAplicado = 0;
    renderCart();
    showToast(`sp_nuevo_pedido simulado: pedido #129, sucursal ${branch}, empleado ${employee}, tipo ${type}, total ${money(total)}.`);
  });

  document.getElementById('productSearch')?.addEventListener('input', renderProducts);

  renderDashboard();
  fillSelects();
  renderCategories();
  renderProducts();
  renderCart();
});
