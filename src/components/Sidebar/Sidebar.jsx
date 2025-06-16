import { useState } from "react";
import {
  FaTimes,
  FaHome,
  FaTags,
  FaClipboardList,
  FaShoppingCart,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../context/authContext";

const Sidebar = ({ onLinkClick, onClose, onLogoutClick }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
  };

  const capitalize = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  };

  const linkStyle = ({ isActive }) =>
    `sidebar-link nav-link d-flex align-items-center gap-3 px-3 py-2 ${
      isActive ? "active" : "text-dark"
    }`;

  return (
    <div className="sidebar-container shadow px-2">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-primary fw-bold text-center m-0">ShopEasy</h4>
        <FaTimes
          onClick={onClose}
          className="text-secondary sidebar-close-icon d-lg-none"
        />
      </div>
      <hr />

      <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
        <li>
          <NavLink to="/dashboard" className={linkStyle} onClick={onLinkClick}>
            <FaHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" className={linkStyle} onClick={onLinkClick}>
            <FaTags /> Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-orders" className={linkStyle} onClick={onLinkClick}>
            <FaClipboardList /> My Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={linkStyle} onClick={onLinkClick}>
            <FaShoppingCart /> Cart
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-account-section mt-auto p-3 border-top position-relative">
        <div
          className="sidebar-profile-toggle d-flex justify-content-between align-items-center cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="d-flex align-items-center gap-2">
            <div className="sidebar-user-initials">
              {user ? getInitials(`${user.firstname} ${user.lastname}`) : ""}
            </div>
            <p className="fw-bolder m-0">
              {user
                ? `${capitalize(user.firstname)} ${capitalize(user.lastname)}`
                : "Guest User"}
            </p>
          </span>
          <FaChevronDown
            className={`transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </div>

        {showDropdown && (
          <ul className="sidebar-dropdown-menu shadow px-2 py-1">
            <li
              className="sidebar-link py-2 px-3 d-flex align-items-center gap-2 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <FaUser /> Profile
            </li>
            <li
              className="sidebar-link py-2 px-3 d-flex align-items-center gap-2 cursor-pointer"
              onClick={() => navigate("/setting")}
            >
              <FaCog /> Settings
            </li>
            <li
              className="sidebar-link py-2 px-3 d-flex align-items-center gap-2 text-danger cursor-pointer"
              onClick={onLogoutClick}
            >
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
