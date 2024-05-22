import { fetchCartItems, submitOrder } from "./API.js";
import { createOrderMessage, renderCartItems } from "./dom.js";
import { LS_CART_ITEMS, LS_CART_PRODUCT_DETAILS } from "./vars.js";

const cartBtn = document.querySelector(".store__cart-btn");
const cartCounter = cartBtn.querySelector(".store__cart-cnt");
const modalOverlay = document.querySelector(".modal-overlay");
const cartItemsList = document.querySelector(".modal__cart-items");
const cartTotalPriceElement = document.querySelector(".modal__cart-total-price > span");
const cartForm = document.querySelector(".modal__cart-form");

export const calculateTotalPrice = (cartItems, products) =>
  cartItems.reduce((acc, item) => {
    const product = products.find((prod) => +prod.id === +item.id);
    return acc + product.price * item.count;
  }, 0);

const updateCartCounter = () => {
  const cartItems = JSON.parse(localStorage.getItem(LS_CART_ITEMS) || "[]");
  cartCounter.textContent = cartItems.length;
};

export const addToCart = (productId) => {
  const cartItems = JSON.parse(localStorage.getItem(LS_CART_ITEMS) || "[]");

  const existingItem = cartItems.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.count += 1;
  } else {
    cartItems.push({ id: productId, count: 1 });
  }

  localStorage.setItem(LS_CART_ITEMS, JSON.stringify(cartItems));
  updateCartCounter();
};

const updateCartItem = (productId, change) => {
  const cartItems = JSON.parse(localStorage.getItem(LS_CART_ITEMS) || "[]");
  const itemIndex = cartItems.findIndex((item) => +item.id === +productId);

  if (itemIndex !== -1) {
    cartItems[itemIndex].count += change;

    if (cartItems[itemIndex].count <= 0) {
      cartItems.splice(itemIndex, 1);
    }

    localStorage.setItem(LS_CART_ITEMS, JSON.stringify(cartItems));
    const products = JSON.parse(localStorage.getItem(LS_CART_PRODUCT_DETAILS) || "[]");
    
    updateCartCounter();
    renderCartItems(cartItemsList, cartItems, products);

    const totalPrice = calculateTotalPrice(cartItems, products);
    cartTotalPriceElement.textContent = totalPrice.toLocaleString();
  }
};

cartItemsList.addEventListener("click", ({ target }) => {
  if (target.classList.contains("modal__minus")) {
    const productId = +target.dataset.id;
    updateCartItem(productId, -1);
  }
  if (target.classList.contains("modal__plus")) {
    const productId = +target.dataset.id;
    updateCartItem(productId, 1);
  }
});

cartBtn.addEventListener("click", async (e) => {
  modalOverlay.style.display = "flex";

  const cartItems = JSON.parse(localStorage.getItem(LS_CART_ITEMS) || "[]");
  const ids = cartItems.map((item) => item.id);

  if (!ids.length) {
    cartItemsList.textContent = "";
    const listItem = document.createElement("li");
    listItem.innerHTML = `<h3 class="modal__cart-no-product">Корзина пуста...</h3>`;
    cartItemsList.append(listItem);
    return;
  }

  const products = await fetchCartItems(ids);
  localStorage.setItem(LS_CART_PRODUCT_DETAILS, JSON.stringify(products));
  renderCartItems(cartItemsList, cartItems, products);

  const totalPrice = calculateTotalPrice(cartItems, products);
  cartTotalPriceElement.textContent = totalPrice.toLocaleString();
});

modalOverlay.addEventListener("click", ({ target }) => {
  if (target === modalOverlay || target.closest(".modal-overlay__close-btn")) {
    modalOverlay.style.display = "none";
  }
});

cartForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const storeId = cartForm.store.value;
  const cartItems = JSON.parse(localStorage.getItem(LS_CART_ITEMS) || "[]");

  const products = cartItems.map((item) => ({
    id: item.id,
    quantity: item.count,
  }));

  const { orderId } = await submitOrder(storeId, products);

  localStorage.removeItem(LS_CART_ITEMS);
  localStorage.removeItem(LS_CART_PRODUCT_DETAILS);

  document.body.append(createOrderMessage(orderId));

  updateCartCounter();

  modalOverlay.style.display = "none";
  cartForm.reset();
});

updateCartCounter();
