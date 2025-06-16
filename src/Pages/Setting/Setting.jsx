import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import { toast } from "react-toastify";
import { changePassword } from "../../services/authService";

const Setting = () => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.current_password.trim())
      newErrors.current_password = "Current password is required";

    if (!formData.new_password.trim())
      newErrors.new_password = "New password is required";
    else if (formData.new_password.length < 6)
      newErrors.new_password = "Password must be at least 6 characters";

    if (!formData.confirm_new_password.trim())
      newErrors.confirm_new_password = "Confirm password is required";
    else if (formData.new_password !== formData.confirm_new_password)
      newErrors.confirm_new_password = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await changePassword(
        formData.current_password,
        formData.new_password,
        formData.confirm_new_password
      );
      toast.success(response.data.message);
      setFormData({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 className="mb-3">Change Password</h2>
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="mb-3">
          <label htmlFor="current_password" className="form-label">
            Current Password
          </label>
          <input
            type="password"
            className={`form-control ${
              errors.current_password ? "is-invalid" : ""
            }`}
            id="current_password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
          />
          {errors.current_password && (
            <div className="invalid-feedback">{errors.current_password}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="new_password" className="form-label">
            New Password
          </label>
          <input
            type="password"
            className={`form-control ${
              errors.new_password ? "is-invalid" : ""
            }`}
            id="new_password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
          />
          {errors.new_password && (
            <div className="invalid-feedback">{errors.new_password}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirm_new_password" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            className={`form-control ${
              errors.confirm_new_password ? "is-invalid" : ""
            }`}
            id="confirm_new_password"
            name="confirm_new_password"
            value={formData.confirm_new_password}
            onChange={handleChange}
          />
          {errors.confirm_new_password && (
            <div className="invalid-feedback">
              {errors.confirm_new_password}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Setting;
