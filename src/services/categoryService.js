import api from "./axiosInstance";

export const getAllCategory = async () => {
  return await api.get("/category/getAll");
};
