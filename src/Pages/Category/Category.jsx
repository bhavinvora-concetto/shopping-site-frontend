import React, { useEffect, useState } from "react";
import "./Category.css";
import { getAllCategory } from "../../services/categoryService";
import Layout from "../../Layout/Layout";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategory();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="category-container p-2">
        <h2 className="category-title mb-4">Categories</h2>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "60vh" }}
          >
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card d-flex justify-content-center align-items-center rounded shadow-sm text-center p-2"
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Category;
