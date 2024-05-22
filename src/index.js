import { fetchProductsByCategory } from "./js/API.js";
import { addToCart } from "./js/cart.js";
import { renderProducts } from "./js/dom.js";

const submitInputController = () => {
  try {
    const input = document.querySelector(".subscribe__input");
    const button = document.querySelector(".subscribe__submit");

    input.addEventListener("focus", (e) => {
      input.dataset.placeholder = input.placeholder;
      input.placeholder = "";
    });

    input.addEventListener("blur", (e) => {
      input.placeholder = input.dataset.placeholder;
    });

    input.addEventListener("input", (e) => {
      button.disabled = !e.target.value.trim();
    });

    button.addEventListener("click", (e) => {
      e.preventDefault();
    });
  } catch (error) {
    console.warn("Это не главная страница...");
  }
};

const init = () => {
  submitInputController();
  
  const categoryBtns = document.querySelectorAll(".store__category-btn");
  const productList = document.querySelector(".store__list");

  const storeTitle = document.querySelector(".store__title");

  const changeCategory = async ({ target }) => {
    const category = target.textContent;

    categoryBtns.forEach((btn) => {
      btn.classList.remove("store__category-btn_active");
    });

    target.classList.add("store__category-btn_active");

    const products = await fetchProductsByCategory(category);
    renderProducts(products, productList);

    storeTitle.textContent = category;
  };

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", changeCategory);

    if (btn.classList.contains("store__category-btn_active")) {
      changeCategory({ target: btn });
    }
  });

  productList.addEventListener("click", ({ target }) => {
    if (target.closest(".product__btn-add-cart")) {
      const productId = target.dataset.id;
      addToCart(productId);
    }
  });
};
init();
