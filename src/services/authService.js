import api from "./axiosInstance";

export const register = async (
  firstname,
  lastname,
  email,
  mobile_number,
  password,
  password_confirmation
) => {
  return await api.post("/register", {
    firstname,
    lastname,
    email,
    mobile_number,
    password,
    password_confirmation,
  });
};

export const login = async (emailormobile, password) => {
  return await api.post("/login", { emailormobile, password });
};

export const logout = async () => {
  return await api.post("/logout");
};

export const updateProfile = async (
  firstname,
  lastname,
  email,
  mobile_number
) => {
  return await api.put("/user/updateProfile", {
    firstname,
    lastname,
    email,
    mobile_number,
  });
};

export const changePassword = async (
  current_password,
  new_password,
  new_password_confirmation
) => {
  return await api.post("/user/changePassword", {
    current_password,
    new_password,
    new_password_confirmation,
  });
};
