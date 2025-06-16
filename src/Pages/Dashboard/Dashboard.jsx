import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Layout from "../../Layout/Layout";
import { filterSearchProducts } from "../../services/productService";
import { getAllCategory } from "../../services/categoryService";
import { useCart } from "../../context/cartContext";
import { toast } from "react-toastify";
import { BsCartPlus } from "react-icons/bs";
import { useSearch } from "../../context/searchContext";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { cart, addToCart } = useCart();
  const { searchQuery } = useSearch();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await filterSearchProducts({
        categoryId: selectedCategory,
        search: searchQuery,
      });
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategory();
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleAddToCart = async (product) => {
    const isInCart = cart.some((item) => item.product.id === product.id);
    if (isInCart) {
      toast.error("Item already in cart");
      return;
    }

    setLoadingProductId(product.id);
    await addToCart(product);
    setLoadingProductId(null);
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Dashboard</h2>
        <select
          className="form-select w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "70vh" }}
        >
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-danger mt-5">No products available</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-sm-6 col-md-4 mb-4" key={product.id}>
              <div className="product-card card h-100 shadow-sm">
                <img
                  src={`${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${product.image}`}
                  className="card-img"
                  alt={product.name}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title m-0">{product.name}</h5>
                    {typeof product.stock === "number" && (
                      <span
                        className={`badge ${
                          product.stock >= 1
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {product.stock >= 1 ? "In Stock" : "Out of Stock"}
                      </span>
                    )}
                  </div>
                  <p className="card-text m-0 mb-1">{product.description}</p>
                  <div>
                    <p className="fw-semibold text-danger mb-1">
                      {formatPrice(product.price)}
                    </p>
                    <span className="badge text-bg-secondary mb-2">
                      {product.category?.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-warning btn-sm mt-auto"
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Adding...
                      </>
                    ) : (
                      <span className="d-flex justify-content-center align-items-center gap-2">
                        <BsCartPlus />
                        Add to cart
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
