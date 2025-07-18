const carrito = [];

// Espera a que el DOM cargue
window.addEventListener('DOMContentLoaded', () => {
  // Selecciona todas las tarjetas de producto
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const nombre = card.querySelector('.product-name').textContent;
      const precio = card.querySelector('.product-price').textContent;
      
      // Buscar si el producto ya existe en el carrito
      const existingItem = carrito.find(item => item.nombre === nombre);
      
      if (existingItem) {
        existingItem.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }
      
      // Animación de confirmación
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
      }, 150);
      
      // Mostrar notificación
      showNotification(`${nombre} agregado al carrito`);
    });
  });

  // Modal del carrito
  const modal = document.getElementById('cartModal');
  const botonCarrito = document.querySelector('.nav-item.cart');
  const closeBtn = document.querySelector('.close');
  const confirmBtn = document.getElementById('confirmOrder');

  // Abrir modal
  botonCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
    updateCartDisplay();
  });

  // Cerrar modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Confirmar pedido
  confirmBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
      showNotification('El carrito está vacío');
      return;
    }

    let mensaje = "¡Hola! Quiero hacer un pedido:\n\n";
    let total = 0;
    
    carrito.forEach((item, index) => {
      const precioNumerico = parseFloat(item.precio.replace('$', ''));
      const subtotal = precioNumerico * item.cantidad;
      total += subtotal;
      
      mensaje += `${index + 1}. ${item.nombre}\n`;
      mensaje += `   Precio: ${item.precio} x ${item.cantidad} = $${subtotal.toFixed(2)}\n\n`;
    });
    
    mensaje += `💰 Total: $${total.toFixed(2)}`;

    const numeroWhatsApp = "7713439201"; // <- CAMBIA este número por el tuyo con código de país
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    // Opcional: limpiar carrito después del pedido
    // carrito.length = 0;
    // updateCartDisplay();
  });
});

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const totalPrice = document.getElementById('totalPrice');
  const confirmBtn = document.getElementById('confirmOrder');

  if (carrito.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío 😔</div>';
    totalPrice.textContent = '$0.00';
    confirmBtn.disabled = true;
    return;
  }

  let total = 0;
  let html = '';

  carrito.forEach((item, index) => {
    const precioNumerico = parseFloat(item.precio.replace('$', ''));
    const subtotal = precioNumerico * item.cantidad;
    total += subtotal;

    html += `
      <div class="cart-item">
        <div class="item-info">
          <div class="item-name">${item.nombre}</div>
          <div class="item-price">${item.precio} c/u</div>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
          <input type="number" class="quantity-input" value="${item.cantidad}" 
                 onchange="updateQuantity(${index}, this.value)" min="1">
          <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = html;
  totalPrice.textContent = `$${total.toFixed(2)}`;
  confirmBtn.disabled = false;
}

function increaseQuantity(index) {
  carrito[index].cantidad++;
  updateCartDisplay();
}

function decreaseQuantity(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }
  updateCartDisplay();
}

function updateQuantity(index, newQuantity) {
  const quantity = parseInt(newQuantity);
  if (quantity > 0) {
    carrito[index].cantidad = quantity;
  } else {
    carrito.splice(index, 1);
  }
  updateCartDisplay();
}

function showNotification(message) {
  // Crear notificación temporal
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #25D366;
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 3000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}