import { useState } from "react";
import "./Layout.css";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../Pages/Footer/Footer";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="layout-container d-flex">
      <div className={`sidebar-container-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar
          onLinkClick={closeSidebar}
          onClose={closeSidebar}
          onLogoutClick={() => setShowLogoutModal(true)}
        />
      </div>

      <div className="layout-content">
        <Navbar onToggleSidebar={toggleSidebar} />
        <div className="layout-body p-3">{children}</div>
        <ConfirmModal
          isOpen={showLogoutModal}
          message="Are you sure you want to logout?"
          onConfirm={() => {
            setShowLogoutModal(false);
            handleLogout();
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
