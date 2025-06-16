import api from "./axiosInstance";

export const placeOrder = async (orderData) => {
  return await api.post("/order/placeOrder", orderData);
};

export const getUserOrders = async () => {
  return await api.get("/order/getAll");
};
