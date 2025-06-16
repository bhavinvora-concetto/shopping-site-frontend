import api from "./axiosInstance";

export const getAllCartItem = async () => {
  return await api.get("/cart/getAll");
};

export const addCartItem = async (product_id) => {
  return await api.post("/cart/create", { product_id });
};

export const updateCartItem = async (cartId, quantity) => {
  return await api.put(`/cart/${cartId}`, { quantity });
};

export const deleteCartItem = async (cartId) => {
  return await api.delete(`/cart/${cartId}`);
};

export const clearCartItems = async () => {
  return await api.delete("/cart/clearCart");
};
