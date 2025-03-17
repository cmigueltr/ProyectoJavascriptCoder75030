// Lista de productos disponibles (reemplazar con las rutas de tus imágenes)
const products = [
    { id: 1, name: "Pink Cookie", price: 2300, imgSrc: "../images/cookies1.jpg" },
    { id: 2, name: "Bizzco Cookie", price: 2000, imgSrc: "../images/cookies2.jpg" },
    { id: 3, name: "Dubai Cookie", price: 3500, imgSrc: "../images/cookies3.jpg" },
    { id: 4, name: "Caramel Cookie", price: 2800, imgSrc: "../images/cookies4.jpg"},
  ];
  
  // Referencias al DOM
  const productsContainer = document.getElementById("products");
  const cartItemsContainer = document.getElementById("cart-items");
  const clearCartButton = document.getElementById("clear-cart");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const totalPriceElement = document.getElementById("total-price");
  
  // Función para cargar los productos en el DOM
  function loadProducts() {
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
  }
  
  // Función para obtener el carrito del localStorage
  function getCartFromStorage() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return cart ? cart : [];
  }
  
  // Función para guardar el carrito en el localStorage
  function saveCartToStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  // Función para calcular el total del carrito
  function calculateTotal() {
    const cart = getCartFromStorage();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  
  // Función para mostrar el carrito
  function displayCart() {
    const cart = getCartFromStorage();
    cartItemsContainer.innerHTML = ""; // Limpiar el carrito antes de renderizar
  
    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
    } else {
      emptyCartMessage.style.display = "none";
    }
  
    cart.forEach(item => {
      const itemElement = document.createElement("li");
      itemElement.innerHTML = `
        ${item.name} - $${item.price} x${item.quantity}
        <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  
    totalPriceElement.textContent = `Total: $${calculateTotal()}`;
  }
  
  // Función para agregar un producto al carrito
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cart = getCartFromStorage();
  
    // Verificar si el producto ya está en el carrito
    const productInCart = cart.find(item => item.id === product.id);
    if (productInCart) {
      productInCart.quantity += 1;  // Aumentar la cantidad
    } else {
      cart.push({...product, quantity: 1});
    }
  
    saveCartToStorage(cart);
    displayCart();
  }
  
  // Función para eliminar un producto del carrito
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
  }
  
  // Event listeners para agregar productos al carrito
  productsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
      const productId = parseInt(event.target.getAttribute("data-id"));
      addToCart(productId);
    }
  });
  
  // Event listener para vaciar el carrito
  clearCartButton.addEventListener("click", clearCart);
  
  // Event listener para eliminar productos del carrito
  cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
      const productId = parseInt(event.target.getAttribute("data-id"));
      removeFromCart(productId);
    }
  });
  
  // Inicialización de la aplicación
  function init() {
    loadProducts();
    displayCart(); // Mostrar el carrito cuando la página se carga
  }
  
  init();