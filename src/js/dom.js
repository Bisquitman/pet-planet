import { calculateTotalPrice } from "./cart.js";
import { API_URL, LS_CART_ITEMS, LS_CART_PRODUCT_DETAILS } from "./vars.js";

export const createOrderMessage = (id) => {
  const orderMessageElement = document.createElement("div");
  orderMessageElement.className = "order-message";

  const orderMessageText = document.createElement("p");
  orderMessageText.className = "order-message__text";
  orderMessageText.innerHTML = `
    Ваш заказ оформлен.<br/>
    Номер заказа: <strong>${id}</strong>.<br/>
    Вы можете забрать его завтра после 12:00
  `;

  const orderMessageCloseBtn = document.createElement("button");
  orderMessageCloseBtn.className = "order-message__close-btn";
  orderMessageCloseBtn.type = "button";
  orderMessageCloseBtn.textContent = "Закрыть";
  orderMessageCloseBtn.addEventListener("click", () => orderMessageElement.remove());

  orderMessageElement.append(orderMessageText, orderMessageCloseBtn);

  return orderMessageElement;
};

const createProductCard = ({ id, photoUrl, name, price }) => {
  const productCard = document.createElement("li");
  productCard.className = "store__item";
  productCard.innerHTML = `
      <article class="store__product product">
        <img class="product__image" src="${API_URL}${photoUrl}" alt="${name}" height="229">

        <h3 class="product__title">${name}</h3>

        <p class="product__price">${parseInt(price).toLocaleString()}&nbsp;&#8381;</p>

        <button class="product__btn-add-cart button button_purple" data-id=${id}>Заказать</button>
      </article>
    `;

  return productCard;
};

export const renderProducts = (products, productList) => {
  productList.textContent = "";

  products.forEach((product) => {
    const productCard = createProductCard(product);
    productList.append(productCard);
  });
};

export const renderCartItems = (cartItemsList,cartItems,products) => {
  cartItemsList.textContent = "";

  products.forEach(({ id, photoUrl, name, price }) => {
    const cartItem = cartItems.find((item) => +item.id === +id);

    if (!cartItem) return;

    const listItem = document.createElement("li");
    listItem.className = "modal__cart-item";
    listItem.innerHTML = `
        <img class="modal__cart-item-image" src="${API_URL}${photoUrl}" alt="${name}">

        <h3 class="modal__cart-item-title">${name}</h3>

        <div class="modal__cart-item-counter">
          <button class="modal__counter-btn modal__minus" data-id=${id}>-</button>
          <span class="modal__count">${cartItem.count}</span>
          <button class="modal__counter-btn modal__plus" data-id=${id}>+</button>
        </div>

        <p class="modal__cart-item-price">${(price * cartItem.count).toLocaleString()}&nbsp;₽</p>
      `;

    cartItemsList.append(listItem);
  });

};
