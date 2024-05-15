export const API_URL = "https://jealous-inconclusive-flock.glitch.me";

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

try {
  const categoryBtns = document.querySelectorAll(".store__category-btn");

  const changeActiveBtn = ({ target }) => {
    categoryBtns.forEach((btn) => {
      btn.classList.remove("store__category-btn_active");
    });

    target.classList.add("store__category-btn_active");
  };

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", changeActiveBtn);
  });
} catch (error) {
  console.error(error);
}

const renderProductList = () => {
  const productList = document.querySelector(".store__list");

  const createProductCard = (product) => {
    const productCard = document.createElement("li");
    productCard.className = "store__item";
    productCard.innerHTML = `
      <article class="store__product product">
        <img class="product__image" src="${API_URL}${product.photoUrl}" alt="${product.name}" width="388" height="229">

        <h3 class="product__title">${product.name}</h3>

        <p class="product__price">${parseInt(product.price).toLocaleString()}&nbsp;₽</p>

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

  fetchProductByCategory("Домики");
};

renderProductList();
