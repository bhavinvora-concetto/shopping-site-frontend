import api from "./axiosInstance";

export const getAllProduct = async () => {
  return await api.get("/product/getAll");
};

export const filterSearchProducts = async ({
  categoryId = "all",
  search = "",
}) => {
  const params = {};

  if (categoryId !== "all") params.category_id = categoryId;
  if (search.trim() !== "") params.search = search.trim();

  return await api.get("/product/filter", { params });
};
