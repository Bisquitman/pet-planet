import { API_URL } from "./vars.js";

const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) throw new Error(response.status);

    return await response.json();
  } catch (error) {
    console.error("Ошибка запроса: ", error);
  }
};

export const fetchProductsByCategory = (category) => fetchData(`/api/products/category/${category}`);

export const fetchCartItems = (ids) => fetchData(`/api/products/list/${ids.join(",")}`);

export const submitOrder = (storeId, products) =>
  fetchData(`/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storeId, products }),
  });
