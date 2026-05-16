document.addEventListener('DOMContentLoaded', () => {
  const sucursales = [
    { id_sucursal: 1, nombre: 'TacoSoft Centro', direccion: 'Av. Universidad 120', activa: true },
    { id_sucursal: 2, nombre: 'TacoSoft Norte', direccion: 'Blvd. Independencia 45', activa: true },
    { id_sucursal: 3, nombre: 'TacoSoft Sur', direccion: 'Calle Reforma 88', activa: true },
  ];

  const categorias = [
    { id_categoria: 1, nombre: 'Tacos' },
    { id_categoria: 2, nombre: 'Tortas' },
    { id_categoria: 3, nombre: 'Bebidas' },
    { id_categoria: 4, nombre: 'Complementos' },
  ];

  const productos = [
    { id_producto: 1, id_categoria: 1, nombre: 'Taco al Pastor', precio: 35, disponible: true, icon: 'bi-egg-fried' },
    { id_producto: 2, id_categoria: 1, nombre: 'Taco de Suadero', precio: 38, disponible: true, icon: 'bi-egg-fried' },
    { id_producto: 3, id_categoria: 1, nombre: 'Taco de Barbacoa', precio: 42, disponible: true, icon: 'bi-egg-fried' },
    { id_producto: 4, id_categoria: 2, nombre: 'Torta al Pastor', precio: 68, disponible: true, icon: 'bi-bread' },
    { id_producto: 5, id_categoria: 2, nombre: 'Torta de Suadero', precio: 72, disponible: true, icon: 'bi-bread' },
    { id_producto: 6, id_categoria: 3, nombre: 'Agua de Horchata', precio: 24, disponible: true, icon: 'bi-cup-straw' },
    { id_producto: 7, id_categoria: 3, nombre: 'Agua de Jamaica', precio: 24, disponible: true, icon: 'bi-cup-straw' },
    { id_producto: 8, id_categoria: 4, nombre: 'Orden de Guacamole', precio: 45, disponible: true, icon: 'bi-basket' },
    { id_producto: 9, id_categoria: 4, nombre: 'Frijoles Charros', precio: 40, disponible: true, icon: 'bi-bowl-hot' },
  ];

  const empleados = [
    { id_empleado: 1, id_sucursal: 1, nombre: 'Luis Herrera', puesto: 'Cajero' },
    { id_empleado: 2, id_sucursal: 1, nombre: 'Ana Martínez', puesto: 'Cajera' },
    { id_empleado: 3, id_sucursal: 2, nombre: 'Sofía Ramos', puesto: 'Cajera' },
    { id_empleado: 4, id_sucursal: 3, nombre: 'Diego Cruz', puesto: 'Cajero' },
  ];

  const clientes = [
    { id_cliente: null, nombre: 'Cliente general' },
    { id_cliente: 1, nombre: 'Carlos López' },
    { id_cliente: 2, nombre: 'María García' },
    { id_cliente: 3, nombre: 'Pedro Sánchez' },
  ];

  const promociones = [
    { id_promocion: 1, nombre: 'Combo Pastor', descuento: 30, vigente: true, productos: [1, 6] },
    { id_promocion: 2, nombre: 'Tortas Martes', descuento: 20, vigente: true, productos: [4, 5] },
    { id_promocion: 3, nombre: 'Bebida en Pedido Grande', descuento: 15, vigente: true, productos: [6, 7] },
    { id_promocion: 4, nombre: 'Cliente Frecuente', descuento: 25, vigente: true, productos: [1, 2, 3] },
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

  const money = (value) => `$${Number(value).toFixed(2)}`;
  const getSucursal = (id) => sucursales.find(item => item.id_sucursal === id)?.nombre || 'Sin sucursal';
  const getCliente = (id) => clientes.find(item => item.id_cliente === id)?.nombre || 'Cliente general';
  const getEmpleado = (id) => empleados.find(item => item.id_empleado === id)?.nombre || 'Sin empleado';
  const getCategoria = (id) => categorias.find(item => item.id_categoria === id)?.nombre || 'Sin categoría';

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
      const module = link.dataset.module;
      const procedureMap = {
        Productos: 'sp_crear_producto',
        Categorías: 'sp_crear_categoria',
        Sucursales: 'sp_crear_sucursal',
        Empleados: 'sp_crear_empleado',
        Clientes: 'tabla cliente',
        Pedidos: 'sp_nuevo_pedido / sp_cancelar_pedido',
        Promociones: 'sp_crear_promocion / sp_agregar_producto_promocion',
        Reportes: 'consultas sobre pedido y detalle_pedido',
      };
      document.querySelectorAll('.module-link').forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      showToast(`Módulo ${module}: navegación simulada para ${procedureMap[module]}.`);
    });
  });

  document.querySelectorAll('.simulate-sp').forEach(button => {
    button.addEventListener('click', () => showToast(`Procedimiento simulado: ${button.dataset.sp}`));
  });

  const viewPromoBtn = document.getElementById('viewPromoBtn');
  if (viewPromoBtn) {
    viewPromoBtn.addEventListener('click', () => showToast('Promoción simulada: sp_aplicar_promocion valida productos asociados.'));
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
          <td><span class="badge ${pedido.estado === 'Cancelado' ? 'bg-danger' : pedido.estado === 'Pendiente' ? 'bg-warning' : 'bg-success'}">${pedido.estado}</span></td>
        </tr>
      `).join('');
    };

    renderOrders();
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => renderOrders(statusFilter.value));
    }

    const dashboardSearch = document.getElementById('dashboardSearch');
    if (dashboardSearch) {
      dashboardSearch.addEventListener('input', () => {
        const q = dashboardSearch.value.toLowerCase();
        const rows = recentOrdersBody.querySelectorAll('tr');
        rows.forEach(row => row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none');
      });
    }

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
          <div class="progress" style="height: 7px;">
            <div class="progress-bar" style="width: ${Math.max(20, 100 - index * 16)}%"></div>
          </div>
        </div>
      `).join('');
    }

    if (branchesList) {
      branchesList.innerHTML = sucursales.map(sucursal => `
        <div class="mini-order-card">
          <div>
            <strong>${sucursal.nombre}</strong>
            <span class="text-muted small">${sucursal.direccion}</span>
          </div>
          <span class="badge bg-success">Activa</span>
        </div>
      `).join('');
    }

    if (promotionsList) {
      promotionsList.innerHTML = promociones.map(promo => `
        <div class="mini-order-card">
          <div>
            <strong>${promo.nombre}</strong>
            <span class="text-muted small">Descuento simulado: ${money(promo.descuento)}</span>
          </div>
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

    branchSelect.addEventListener('change', () => {
      renderEmployees();
      showToast('Sucursal seleccionada. Empleados filtrados por sucursal.');
    });
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
          <div class="product-visual">
            <span class="product-tag">${getCategoria(producto.id_categoria)}</span>
            <i class="bi ${producto.icon}"></i>
          </div>
          <div class="product-name">${producto.nombre}</div>
          <div class="product-category">producto.id_producto: ${producto.id_producto}</div>
          <p class="product-desc">Disponible para detalle_pedido con precio unitario simulado.</p>
          <div class="product-footer">
            <div class="product-price">${money(producto.precio)}</div>
            <button class="btn btn-add" data-product="${producto.id_producto}" type="button" title="Agregar producto">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('') : `<div class="col-12"><div class="card"><div class="card-body text-center text-muted">No hay productos disponibles.</div></div></div>`;

    productGrid.querySelectorAll('.btn-add').forEach(button => {
      button.addEventListener('click', () => addProduct(Number(button.dataset.product)));
    });
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
    if (item.cantidad <= 0) {
      carrito = carrito.filter(detalle => detalle.id_producto !== idProducto);
    } else {
      item.subtotal = item.cantidad * item.precio_unitario;
    }
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
        <div class="cart-item-info">
          <span class="cart-item-name">${item.nombre}</span>
          <span class="cart-item-price">${item.cantidad} x ${money(item.precio_unitario)} = ${money(item.subtotal)}</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-minus" data-product="${item.id_producto}" type="button">-</button>
          <span>${item.cantidad}</span>
          <button class="qty-plus" data-product="${item.id_producto}" type="button">+</button>
        </div>
        <button class="btn-remove" data-product="${item.id_producto}" type="button"><i class="bi bi-trash"></i></button>
      </div>
    `).join('');

    cartItems.querySelectorAll('.qty-minus').forEach(button => button.addEventListener('click', () => updateQuantity(Number(button.dataset.product), -1)));
    cartItems.querySelectorAll('.qty-plus').forEach(button => button.addEventListener('click', () => updateQuantity(Number(button.dataset.product), 1)));
    cartItems.querySelectorAll('.btn-remove').forEach(button => button.addEventListener('click', () => removeProduct(Number(button.dataset.product))));
  }

  const applyPromoBtn = document.getElementById('applyPromoBtn');
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const subtotal = carrito.reduce((total, item) => total + item.subtotal, 0);
      const promo = promociones.find(item => item.vigente && carrito.some(detalle => item.productos.includes(detalle.id_producto)));
      descuentoAplicado = promo ? Math.min(promo.descuento, subtotal) : 0;
      renderCart();
      showToast(promo ? `sp_aplicar_promocion simulado: ${promo.nombre}` : 'No hay promoción aplicable para estos productos.');
    });
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!carrito.length) return;
      const total = carrito.reduce((sum, item) => sum + item.subtotal, 0) - descuentoAplicado;
      const branch = document.getElementById('branchSelect')?.value;
      const employee = document.getElementById('employeeSelect')?.value;
      const type = document.getElementById('orderTypeSelect')?.value;
      const nuevoPedido = 129;
      carrito = [];
      descuentoAplicado = 0;
      renderCart();
      showToast(`sp_nuevo_pedido simulado: pedido #${nuevoPedido}, sucursal ${branch}, empleado ${employee}, tipo ${type}, total ${money(total)}.`);
    });
  }

  const productSearch = document.getElementById('productSearch');
  if (productSearch) productSearch.addEventListener('input', renderProducts);

  renderDashboard();
  fillSelects();
  renderCategories();
  renderProducts();
  renderCart();
});
