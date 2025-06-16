import { Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { useState } from "react";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import { useSearch } from "../../context/searchContext";

const Navbar = ({ onToggleSidebar }) => {
  // const [searchQuery, setSearchQuery] = useState("");
  const { searchQuery, setSearchQuery } = useSearch();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="navbar-container shadow-sm bg-white sticky-top px-3 py-2 d-flex justify-content-between align-items-center">
      <FaBars
        className="navbar-toggle d-lg-none cursor-pointer"
        onClick={onToggleSidebar}
      />

      <form
        className="d-flex align-items-center"
        onSubmit={(e) => e.preventDefault()}
        style={{ maxWidth: "250px", width: "100%" }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <Link to="/cart" className="position-relative text-decoration-none me-4">
        <FaShoppingCart size={26} />
        {cartCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default Navbar;
