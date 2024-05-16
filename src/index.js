export const API_URL = "https://jealous-inconclusive-flock.glitch.me";
export const LS_KEY = "cartItems";

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
  console.warn("Это не та страница...");
}

const categoryBtns = document.querySelectorAll(".store__category-btn");
const productList = document.querySelector(".store__list");
const cartBtn = document.querySelector(".store__cart-btn");
const cartCounter = cartBtn.querySelector(".store__cart-cnt");
const modalOverlay = document.querySelector(".modal-overlay");
const cartItemsList = document.querySelector(".modal__cart-items");

const storeTitle = document.querySelector(".store__title");

const productListController = () => {
  const createProductCard = ({ photoUrl, name, price }) => {
    const productCard = document.createElement("li");
    productCard.className = "store__item";
    productCard.innerHTML = `
      <article class="store__product product">
        <img class="product__image" src="${API_URL}${photoUrl}" alt="${name}" width="388" height="229">

        <h3 class="product__title">${name}</h3>

        <p class="product__price">${parseInt(price).toLocaleString()}&nbsp;₽</p>

        <button class="product__btn-add-cart button">Заказать</button>
      </article>
    `;

    return productCard;
  };

  const renderProducts = (products) => {
    productList.textContent = "";

    products.forEach((product) => {
      const productCard = createProductCard(product);
      productList.append(productCard);
    });
  };

  const fetchProductByCategory = async (category) => {
    try {
      const response = await fetch(`${API_URL}/api/products/category/${category}`);
      // console.log('response: ', await response.json());

      if (!response.ok) {
        throw new Error(response.status);
      }

      const products = await response.json();
      console.log("products: ", products);

      renderProducts(products);
    } catch (error) {
      console.error(`Ошибка запроса товаров: ${error}`);
    }
  };

  const changeCategory = ({ target }) => {
    const category = target.textContent;

    categoryBtns.forEach((btn) => {
      btn.classList.remove("store__category-btn_active");
    });

    target.classList.add("store__category-btn_active");

    fetchProductByCategory(category);
    storeTitle.textContent = category;
  };

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", changeCategory);

    if (btn.classList.contains("store__category-btn_active")) {
      fetchProductByCategory(btn.textContent);
    }
  });
};
productListController();

const cartController = () => {
  // ========================================================================================================================================================
  // Modal
  // ========================================================================================================================================================
  const renderCartItems = () => {
    cartItemsList.textContent = '';
    const cartItems = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    
    cartItems.forEach(item => {
      const listElem = document.createElement('li');
      listElem.textContent = item;
      cartItemsList.append(listElem);
    });
  };

  cartBtn.addEventListener("click", (e) => {
    renderCartItems();
    modalOverlay.style.display = "flex";
  });

  modalOverlay.addEventListener("click", ({ target }) => {
    if (target === modalOverlay || target.closest(".modal-overlay__close-btn")) {
      modalOverlay.style.display = "none";
    }
  });

  //========================================================================================================================================================
  // Cart
  //========================================================================================================================================================
  const updateCartCounter = () => {
    const cartItems = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    cartCounter.textContent = cartItems.length;
  };
  updateCartCounter();

  const addToCart = (productName) => {
    const cartItems = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    cartItems.push(productName);
    localStorage.setItem(LS_KEY, JSON.stringify(cartItems));
    updateCartCounter();
  };

  productList.addEventListener("click", ({ target }) => {
    if (target.closest(".product__btn-add-cart")) {
      const productCard = target.closest(".store__product");
      const productName = productCard.querySelector(".product__title").textContent;
      addToCart(productName);
    }
  });
};
cartController();
