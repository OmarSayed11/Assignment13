interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
}

let cart: { id: number; quantity: number }[] = JSON.parse(
  localStorage.getItem("cart") || "[]"
);

document.addEventListener("DOMContentLoaded", (event) => {
  fetchProducts();
});

function fetchProducts(): void {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      displayProducts(data.products);
    })
    .catch((error) => console.error("Error fetching products:", error));
}

function displayProducts(products: Product[]): void {
  const productContainer = document.getElementById(
    "product-container"
  ) as HTMLElement;
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

function viewProductDetails(productId: number): void {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {
      const productDetails = document.getElementById(
        "product-details"
      ) as HTMLElement;
      productDetails.innerHTML = `
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p>Price: $${product.price}</p>
        `;
    })
    .catch((error) => console.error("Error fetching product details:", error));
}

function addToCart(productId: number): void {
  const product = cart.find((p) => p.id === productId);
  if (product) {
    product.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

function updateCartDisplay(): void {
  const cartContainer = document.getElementById(
    "cart-container"
  ) as HTMLElement;
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

function increaseQuantity(productId: number): void {
  const product = cart.find((p) => p.id === productId);
  if (product) {
    product.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }
}

function decreaseQuantity(productId: number): void {
  const product = cart.find((p) => p.id === productId);
  if (product && product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart = cart.filter((p) => p.id !== productId);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

function removeFromCart(productId: number): void {
  cart = cart.filter((p) => p.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

function searchProducts(): void {
  const searchTerm = (
    document.getElementById("search-input") as HTMLInputElement
  ).value.toLowerCase();
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const filteredProducts = data.products.filter((product: Product) =>
        product.title.toLowerCase().includes(searchTerm)
      );
      displayProducts(filteredProducts);
    })
    .catch((error) => console.error("Error searching products:", error));
}

function filterByType(category: string): void {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const filteredProducts = data.products.filter(
        (product: Product) => product.category === category
      );
      displayProducts(filteredProducts);
    })
    .catch((error) => console.error("Error filtering products:", error));
}

function sortByPrice(order: string): void {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const sortedProducts = data.products.sort((a: Product, b: Product) => {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      });
      displayProducts(sortedProducts);
    })
    .catch((error) => console.error("Error sorting products:", error));
}
