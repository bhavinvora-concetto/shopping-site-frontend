import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = Cookies.get("auth_token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
