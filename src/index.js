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
