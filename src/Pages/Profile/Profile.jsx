import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import { updateProfile } from "../../services/authService";
import Cookies from "js-cookie";

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile_number: user.mobile_number || "",
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname.trim())
      newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter valid email address";
    if (!formData.mobile_number.trim())
      newErrors.mobile_number = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile_number))
      newErrors.mobile_number = "Enter 10-digit mobile number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile_number: user.mobile_number || "",
      });
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await updateProfile(
        formData.firstname,
        formData.lastname,
        formData.email,
        formData.mobile_number
      );
      Cookies.set("user", JSON.stringify(response.data.user), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 className="mb-3">Your Profile</h2>
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          {errors.firstname && (
            <div className="invalid-feedback">{errors.firstname}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          {errors.lastname && (
            <div className="invalid-feedback">{errors.lastname}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.mobile_number ? "is-invalid" : ""
            }`}
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
          />
          {errors.mobile_number && (
            <div className="invalid-feedback">{errors.mobile_number}</div>
          )}
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
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
              "Update"
            )}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Profile;
