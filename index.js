"use strict";
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
document.addEventListener("DOMContentLoaded", (event) => {
  fetchProducts();
});
function fetchProducts() {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      console.log(data.products);
      displayProducts(data.products);
    })
    .catch((error) => console.error("Error fetching products:", error));
}
function displayProducts(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Clear previous content
  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" class="product-image"/>
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button onclick="viewProductDetails(${product.id})">View Details</button>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
    productContainer.appendChild(productElement);
  });
}
function viewProductDetails(productId) {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {
      const productDetails = document.getElementById("product-details");
      productDetails.innerHTML = `
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p>Price: $${product.price}</p>
        `;
    })
    .catch((error) => console.error("Error fetching product details:", error));
}
function addToCart(productId) {
  const product = cart.find((p) => p.id === productId);
  if (product) {
    product.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}
function updateCartDisplay() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";
  cart.forEach((item) => {
    const productElement = document.createElement("div");
    productElement.classList.add("cart-item");
    productElement.innerHTML = `
        <p>Product ID: ${item.id} - Quantity: ${item.quantity}</p>
        <button onclick="increaseQuantity(${item.id})">Increase</button>
        <button onclick="decreaseQuantity(${item.id})">Decrease</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      `;
    cartContainer.appendChild(productElement);
  });
}
function increaseQuantity(productId) {
  const product = cart.find((p) => p.id === productId);
  if (product) {
    product.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }
}
function decreaseQuantity(productId) {
  const product = cart.find((p) => p.id === productId);
  if (product && product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart = cart.filter((p) => p.id !== productId);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}
function removeFromCart(productId) {
  cart = cart.filter((p) => p.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}
function searchProducts() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const filteredProducts = data.products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );
      displayProducts(filteredProducts);
    })
    .catch((error) => console.error("Error searching products:", error));
}
function filterByType(category) {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const filteredProducts = data.products.filter(
        (product) => product.category === category
      );
      displayProducts(filteredProducts);
    })
    .catch((error) => console.error("Error filtering products:", error));
}
function sortByPrice(order) {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const sortedProducts = data.products.sort((a, b) => {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      });
      displayProducts(sortedProducts);
    })
    .catch((error) => console.error("Error sorting products:", error));
}
