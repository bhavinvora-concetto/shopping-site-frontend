import React, { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";

export default function SignUp() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstname.trim()) newErrors.firstname = "First name is required";
    if (!form.lastname.trim()) newErrors.lastname = "Last name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile_number)) {
      newErrors.mobile_number = "Mobile number must be 10 digits";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const formValidationErrors = validateForm();
    if (Object.keys(formValidationErrors).length > 0) {
      setErrors(formValidationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await register(
        form.firstname,
        form.lastname,
        form.email,
        form.mobile_number,
        form.password,
        form.password_confirmation
      );

      setForm({
        firstname: "",
        lastname: "",
        email: "",
        mobile_number: "",
        password: "",
        password_confirmation: "",
      });

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.error || {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-secondary-subtle px-3">
      <div
        className="card p-3 p-md-4 shadow w-100 my-2 my-md-0"
        style={{ maxWidth: "600px" }}
      >
        <h3 className="text-center mb-3">Create your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="row mb-2">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${
                  errors.firstname ? "is-invalid" : ""
                }`}
                placeholder="Enter firstname"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.firstname && (
                <div className="invalid-feedback">{errors.firstname}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${
                  errors.lastname ? "is-invalid" : ""
                }`}
                placeholder="Enter lastname"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.lastname && (
                <div className="invalid-feedback">{errors.lastname}</div>
              )}
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-2">
            <label className="form-label">Mobile Number</label>
            <input
              type="number"
              className={`form-control ${
                errors.mobile_number ? "is-invalid" : ""
              }`}
              placeholder="Enter mobile number"
              name="mobile_number"
              value={form.mobile_number}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.mobile_number && (
              <div className="invalid-feedback">{errors.mobile_number}</div>
            )}
          </div>

          <div className="row mb-2">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Enter password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${
                  errors.password_confirmation ? "is-invalid" : ""
                }`}
                placeholder="Enter confirm password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password_confirmation && (
                <div className="invalid-feedback">
                  {errors.password_confirmation}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
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
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <div className="text-center mt-2">
            <p className="mb-0">
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
