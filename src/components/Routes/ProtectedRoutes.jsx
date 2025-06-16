import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("auth_token");
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
