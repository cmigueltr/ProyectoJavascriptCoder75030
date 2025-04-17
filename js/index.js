// Cargar productos desde el archivo JSON
async function loadProducts() {
  try {
    const response = await fetch('../json/products.json');
    const products = await response.json();
    const productsContainer = document.getElementById("products");

    products.forEach(product => {
      const productElement = document.createElement("div");
      productElement.classList.add("product");

      productElement.innerHTML = `
        <img src="${product.imgSrc}" alt="${product.name}">
        <p>${product.name}</p>
        <p>$${product.price}</p>
        <button data-id="${product.id}" class="add-to-cart">Agregar al Carrito</button>
      `;
      
      productsContainer.appendChild(productElement);
    });

    // Agregar event listeners después de crear los productos
    addEventListeners();
  } catch (error) {
    console.error("Error cargando los productos:", error);
  }
}

// Función para agregar los event listeners
function addEventListeners() {
  // Event listener para agregar al carrito
  document.getElementById("products").addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
      const productId = parseInt(event.target.getAttribute("data-id"));
      addToCart(productId);
    }
  });

  // Event listener para vaciar el carrito
  document.getElementById("clear-cart").addEventListener("click", clearCart);

  // Event listener para finalizar compra
  document.getElementById("finalize-purchase").addEventListener("click", () => {
    document.getElementById("payment-form").style.display = "block";
  });

  // Event listener para eliminar productos individuales del carrito
  document.getElementById("cart-items").addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
      const productId = parseInt(event.target.getAttribute("data-id"));
      removeFromCart(productId);
    }
  });

  // Event listener para el tipo de entrega
  document.getElementById("delivery-type").addEventListener("change", (event) => {
    const addressContainer = document.getElementById("address-container");
    if (event.target.value === "delivery") {
      addressContainer.style.display = "block";
      // Mostrar confirmación del costo de envío
      Swal.fire({
        icon: 'info',
        title: 'Costo de envío',
        text: 'Se agregará un costo de $2,500 por el envío a domicilio',
        confirmButtonText: 'Entendido'
      });
    } else {
      addressContainer.style.display = "none";
    }
    displayCart(); // Actualizar el total
  });

  // Event listener para el método de pago
  document.getElementById("payment-method").addEventListener("change", (event) => {
    const cardDetails = document.getElementById("card-details");
    if (event.target.value === "card") {
      cardDetails.style.display = "block";
    } else {
      cardDetails.style.display = "none";
    }
  });

  // Event listener para el formulario de pago
  document.getElementById("paymentForm").addEventListener("submit", processPayment);
}

// Función para obtener el carrito del localStorage
function getCartFromStorage() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart;
}

// Función para guardar el carrito en el localStorage
function saveCartToStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para mostrar los productos en el carrito
function displayCart() {
  const cart = getCartFromStorage();
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const totalPriceElement = document.getElementById("total-price");

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
  } else {
    emptyCartMessage.style.display = "none";
    cart.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} - $${item.price} x${item.quantity}
        <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
      `;
      cartItemsContainer.appendChild(li);
    });
  }

  const total = calculateTotal();
  const deliveryType = document.getElementById("delivery-type")?.value;
  const deliveryCost = deliveryType === "delivery" ? 2500 : 0;
  
  totalPriceElement.innerHTML = `
    <p>Subtotal: $${total - deliveryCost}</p>
    ${deliveryType === "delivery" ? `<p>Costo de envío: $2,500</p>` : ''}
    <p>Total: $${total}</p>
  `;
}

// Función para calcular el total
function calculateTotal() {
  const cart = getCartFromStorage();
  let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Si se elige delivery, agregar costo de envío
  const deliveryType = document.getElementById("delivery-type")?.value;
  if (deliveryType === "delivery") {
    total += 2500;
  }

  return total;
}

// Función para agregar productos al carrito
function addToCart(productId) {
  const products = document.querySelectorAll(".product");
  const product = Array.from(products).find(p => 
    parseInt(p.querySelector(".add-to-cart").getAttribute("data-id")) === productId
  );

  if (product) {
    const name = product.querySelector("p").textContent;
    const price = parseInt(product.querySelector("p:nth-child(3)").textContent.replace("$", ""));
    
    const cart = getCartFromStorage();
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: name,
        price: price,
        quantity: 1
      });
    }

    saveCartToStorage(cart);
    displayCart();
    
    // Mostrar notificación
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado',
      text: `${name} ha sido agregado al carrito`,
      timer: 1500,
      showConfirmButton: false
    });
  }
}

// Función para eliminar productos del carrito
function removeFromCart(productId) {
  const cart = getCartFromStorage();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCartToStorage(updatedCart);
  displayCart();
}

// Función para vaciar el carrito
function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
  Swal.fire({
    icon: 'info',
    title: 'Carrito vaciado',
    text: 'Tu carrito ha sido vaciado exitosamente.',
  });
}

// Función para validar el número de tarjeta
function validateCardNumber(cardNumber) {
  // Eliminar espacios y guiones
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  // Verificar que sea un número válido (16 dígitos)
  return /^\d{16}$/.test(cleanNumber);
}

// Función para validar la fecha de vencimiento
function validateExpiryDate(expiryDate) {
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expiryMonth = parseInt(month);
  const expiryYear = parseInt(year);
  
  return expiryMonth >= 1 && expiryMonth <= 12 && 
         (expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentMonth));
}

// Función para validar el CVC
function validateCVC(cvc) {
  return /^\d{3,4}$/.test(cvc);
}

// Función para validar el número de teléfono
function validatePhoneNumber(phone) {
  // Eliminar espacios, guiones y paréntesis
  const cleanNumber = phone.replace(/[\s\-\(\)]/g, '');
  // Verificar que tenga entre 10 y 15 dígitos (incluyendo el código de país)
  return /^\+?\d{10,15}$/.test(cleanNumber);
}

// Función para procesar el pago
function processPayment(event) {
  event.preventDefault();
  
  const paymentMethod = document.getElementById("payment-method").value;
  const deliveryType = document.getElementById("delivery-type").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = deliveryType === "delivery" ? document.getElementById("address").value : "Retiro en tienda";
  
  // Validar teléfono de forma más flexible
  if (!validatePhoneNumber(phone)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor ingrese un número de teléfono válido',
    });
    return;
  }

  if (paymentMethod === "card") {
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("card-expiry").value;
    const cvc = document.getElementById("card-cvc").value;
    
    // Validar los campos de la tarjeta
    if (!validateCardNumber(cardNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese un número de tarjeta válido (16 dígitos)',
      });
      return;
    }
    
    if (!validateExpiryDate(expiryDate)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese una fecha de vencimiento válida',
      });
      return;
    }
    
    if (!validateCVC(cvc)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese un CVC válido (3 o 4 dígitos)',
      });
      return;
    }
  }

  // Mostrar resumen de la compra
  const total = calculateTotal();
  const deliveryCost = deliveryType === "delivery" ? 2500 : 0;
  
  Swal.fire({
    icon: 'success',
    title: '¡Pago exitoso!',
    html: `
      <p>Gracias por tu compra, ${name}.</p>
      <p>Método de entrega: ${deliveryType === "delivery" ? "Envío a domicilio" : "Retiro en tienda"}</p>
      ${deliveryType === "delivery" ? `<p>Costo de envío: $2,500</p>` : ''}
      <p>Total: $${total}</p>
      <p>Te enviaremos un correo de confirmación a ${email}</p>
    `,
  }).then(() => {
    clearCart();
    document.getElementById("payment-form").style.display = "none";
  });
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  displayCart();
});