// CONFIGURACIÓN
const CONFIG = {
  WHATSAPP_NUMBER: '5217713188735',
};

// DATOS DE PRODUCTOS
const PRODUCTOS = [
  { id: 1, nombre: 'Gelatina de Bombón', precio: 300, imagen: 'Images/1.png' },
  { id: 2, nombre: 'Gelatina frutal', precio: 400, imagen: 'Images/2.png' },
  { id: 3, nombre: 'Gelatina de mango (mus)', precio: 350, imagen: 'Images/3.png' },
  { id: 4, nombre: 'Gelatina de mosaico', precio: 350, imagen: 'Images/4.png' },
  { id: 5, nombre: 'Gelatina flotante azul', precio: 350, imagen: 'Images/5.png' },
  { id: 6, nombre: 'Gelatina tres chocolates', precio: 450, imagen: 'Images/6.png' },
  { id: 7, nombre: 'Gelatina de zanahoria', precio: 350, imagen: 'Images/7.png' },
  { id: 8, nombre: 'Gelatina de mango clásica', precio: 300, imagen: 'Images/9.png' },
  { id: 9, nombre: 'Gelatina decorada (personaje)', precio: 380, imagen: 'Images/10.png' },
  { id: 10, nombre: 'Gelatinas artísticas individual', precio: 35, imagen: 'Images/11.png' },
  { id: 11, nombre: 'Gelatina de fresas', precio: 350, imagen: 'Images/12.png' },
  { id: 12, nombre: 'Gelatina temática (bebidas)', precio: 350, imagen: 'Images/13.png' }
];

let carrito = [];

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
  renderizarProductos();
  configurarEventListeners();
  actualizarContadorCarrito();
});

// RENDERIZAR PRODUCTOS
function renderizarProductos() {
  const grid = document.getElementById('productsGrid');
  let html = '';
  for (let i = 0; i < PRODUCTOS.length; i++) {
    const p = PRODUCTOS[i];
    html += '<div class="product-card" onclick="agregarAlCarrito(' + p.id + ')">'
      + '<img src="' + p.imagen + '" alt="' + p.nombre + '" class="product-image" loading="lazy" />'
      + '<h3 class="product-name">' + p.nombre + '</h3>'
      + '<div class="product-price">$' + p.precio.toFixed(2) + '<span class="price-currency">MXN</span></div>'
      + '</div>';
  }
  grid.innerHTML = html;
}

// CARRITO
function agregarAlCarrito(productoId) {
  const producto = PRODUCTOS.find(p => p.id === productoId);
  if (!producto) return;
  const itemExistente = carrito.find(item => item.id === productoId);
  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarContadorCarrito();
  mostrarToast(producto.nombre + ' agregado');
  animarBotonCarrito();
}

function eliminarDelCarrito(productoId) {
  carrito = carrito.filter(item => item.id !== productoId);
  actualizarCarrito();
  actualizarContadorCarrito();
}

function actualizarCantidad(productoId, nuevaCantidad) {
  const cantidad = parseInt(nuevaCantidad);
  if (cantidad <= 0) {
    eliminarDelCarrito(productoId);
    return;
  }
  const item = carrito.find(item => item.id === productoId);
  if (item) {
    item.cantidad = cantidad;
    actualizarCarrito();
  }
}

function aumentarCantidad(productoId) {
  const item = carrito.find(item => item.id === productoId);
  if (item) {
    item.cantidad++;
    actualizarCarrito();
  }
}

function disminuirCantidad(productoId) {
  const item = carrito.find(item => item.id === productoId);
  if (item) {
    if (item.cantidad > 1) {
      item.cantidad--;
      actualizarCarrito();
    } else {
      eliminarDelCarrito(productoId);
    }
  }
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('cartCount');
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  contador.textContent = total;
}

function actualizarCarrito() {
  const cartItems = document.getElementById('cartItems');
  const totalAmount = document.getElementById('totalAmount');
  const confirmButton = document.getElementById('confirmButton');
  if (carrito.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart"><div class="empty-cart-icon">🛒</div><p>Tu carrito está vacío</p></div>';
    totalAmount.textContent = '$0.00 MXN';
    confirmButton.disabled = true;
    return;
  }
  let total = 0;
  let html = '';
  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += '<div class="cart-item">'
      + '<div class="item-info"><div class="item-name">' + item.nombre + '</div>'
      + '<div class="item-price">$' + item.precio.toFixed(2) + ' MXN c/u</div></div>'
      + '<div class="quantity-controls">'
      + '<button class="quantity-btn" onclick="disminuirCantidad(' + item.id + ')">−</button>'
      + '<input type="number" class="quantity-input" value="' + item.cantidad + '" min="1" onchange="actualizarCantidad(' + item.id + ', this.value)" />'
      + '<button class="quantity-btn" onclick="aumentarCantidad(' + item.id + ')">+</button>'
      + '</div></div>';
  }
  cartItems.innerHTML = html;
  totalAmount.textContent = '$' + total.toFixed(2) + ' MXN';
  confirmButton.disabled = false;
  actualizarContadorCarrito();
}

// MODAL
function abrirCarrito() {
  const modal = document.getElementById('cartModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  actualizarCarrito();
}

function cerrarCarrito() {
  const modal = document.getElementById('cartModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// WHATSAPP
function confirmarPedido() {
  if (carrito.length === 0) {
    mostrarToast('El carrito está vacío');
    return;
  }
  const customerName = document.getElementById('customerName').value.trim();
  if (!customerName) {
    mostrarToast('Agrega tu nombre');
    return;
  }
  const deliveryDateTime = document.getElementById('deliveryDateTime').value;
  if (!deliveryDateTime) {
    mostrarToast('Agrega fecha y hora de entrega');
    return;
  }
  const fecha = new Date(deliveryDateTime);
  const fechaFormateada = fecha.toLocaleString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  let mensaje = '¡Hola! Soy ' + customerName + '\n\n';
  mensaje += 'Me gustaría ordenar:\n\n';
  
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje +=  item.nombre + '\n';
    mensaje += '   $' + item.precio.toFixed(2) + ' × ' + item.cantidad + ' = $' + subtotal.toFixed(2) + '\n\n';
  }
  mensaje += '───────────────\n';
  mensaje += 'Total: $' + total.toFixed(2) + ' MXN\n\n';
  mensaje += 'Fecha deseada: ' + fechaFormateada + '\n¿Tienen disponibilidad?';

  const url = 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER + '?text=' + encodeURIComponent(mensaje);
  window.open(url, '_blank');
  mostrarToast('Abriendo WhatsApp...');
  setTimeout(function() {
    carrito = [];
    document.getElementById('customerName').value = '';
    document.getElementById('deliveryDateTime').value = '';
    actualizarContadorCarrito();
    cerrarCarrito();
  }, 2000);
}

// UTILIDADES
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.add('show');
  setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

function animarBotonCarrito() {
  const btn = document.getElementById('cartButton');
  btn.style.transform = 'scale(1.1)';
  setTimeout(function() {
    btn.style.transform = 'scale(1)';
  }, 200);
}

// EVENT LISTENERS
function configurarEventListeners() {
  document.getElementById('cartButton').addEventListener('click', abrirCarrito);
  document.getElementById('closeModal').addEventListener('click', cerrarCarrito);
  document.getElementById('modalOverlay').addEventListener('click', cerrarCarrito);
  document.getElementById('confirmButton').addEventListener('click', confirmarPedido);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') cerrarCarrito();
  });
}

// EXPONER FUNCIONES
window.agregarAlCarrito = agregarAlCarrito;
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.actualizarCantidad = actualizarCantidad;
