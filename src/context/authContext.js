import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  register as registerAPI,
  login as loginAPI,
  logout as logoutAPI,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    const token = Cookies.get("auth_token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const register = async (
    firstname,
    lastname,
    email,
    mobile_number,
    password,
    password_confirmation
  ) => {
    return await registerAPI(
      firstname,
      lastname,
      email,
      mobile_number,
      password,
      password_confirmation
    );
  };

  const login = async (emailormobile, password) => {
    const response = await loginAPI(emailormobile, password);
    const { token, user } = response.data;

    Cookies.set("auth_token", token, {
      expires: 7,
      secure: false,
      sameSite: "Strict",
    });
    Cookies.set("user", JSON.stringify(user), {
      expires: 7,
      secure: false,
      sameSite: "Strict",
    });

    setUser(user);
    return response;
  };

  const logout = async () => {
    const response = await logoutAPI();
    Cookies.remove("auth_token");
    Cookies.remove("user");
    setUser(null);
    return response;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
