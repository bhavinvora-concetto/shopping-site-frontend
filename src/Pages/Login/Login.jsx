import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import loginBanner from "../../assets/images/login-banner.png";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({
    emailormobile: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const validate = () => {
    const errors = {};
    if (!form.emailormobile.trim())
      errors.emailormobile = "Email or mobile is required";
    if (!form.password.trim()) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await login(form.emailormobile, form.password);
      setForm({ emailormobile: "", password: "" });
      setFormErrors({});
      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-secondary-subtle">
      <div
        className="row w-100 shadow rounded overflow-hidden bg-white"
        style={{ maxWidth: "900px" }}
      >
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src={loginBanner}
            alt="Login Banner"
            className="img-fluid h-100 w-100 object-fit-cover"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="col-12 col-md-6 p-4 d-flex flex-column justify-content-center">
          <h2 className="mb-2 text-center text-primary">Welcome Back</h2>
          <p className="text-center text-muted mb-4">
            Sign in to continue shopping
          </p>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-2">
              <label htmlFor="emailormobile" className="form-label">
                Email or Mobile
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.emailormobile ? "is-invalid" : ""
                }`}
                id="emailormobile"
                name="emailormobile"
                placeholder="Enter your email or mobile number"
                value={form.emailormobile}
                onChange={handleChange}
                disabled={loading}
              />
              {formErrors.emailormobile && (
                <div className="invalid-feedback">
                  {formErrors.emailormobile}
                </div>
              )}
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  formErrors.password ? "is-invalid" : ""
                }`}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
              {formErrors.password && (
                <div className="invalid-feedback">{formErrors.password}</div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <p className="text-center mb-0">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
