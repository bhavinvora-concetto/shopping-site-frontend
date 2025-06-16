import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import { useCart } from "../../context/cartContext";
import { useNavigate } from "react-router-dom";
import "./OrderSummary.css";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const OrderSummary = () => {
  const { user } = useAuth();
  const { cart, placeOrder, fetchCart } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    customer_name: user?.firstname + " " + user?.lastname || "",
    customer_phone: user?.mobile_number || "",
    customer_email: user?.email || "",
  });

  const [shipping, setShipping] = useState({
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [billing, setBilling] = useState({
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleChange = (e, type) => {
    const { name, value } = e.target;

    if (type === "customer") {
      setCustomer((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (type === "shipping") {
      setShipping((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [`shipping_${name}`]: null }));
    }

    if (type === "billing") {
      setBilling((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [`billing_${name}`]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const isEmpty = (val) => !val || val.trim() === "";

    if (isEmpty(customer.customer_name))
      newErrors.customer_name = "customer name is required.";
    if (isEmpty(customer.customer_phone))
      newErrors.customer_phone = "customer_phone number is required.";
    if (isEmpty(customer.customer_email))
      newErrors.customer_email = "customer_email is required.";

    ["street", "area", "city", "state", "pincode"].forEach((field) => {
      if (isEmpty(shipping[field])) {
        newErrors[`shipping_${field}`] = `Shipping ${field} is required.`;
      }
      if (!sameAsShipping && isEmpty(billing[field])) {
        newErrors[`billing_${field}`] = `Billing ${field} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const orderInfo = {
        customer,
        shipping,
        billing: sameAsShipping ? shipping : billing,
        shippingMethod,
        items: cart,
        subtotal: total,
        shippingCost: shippingMethod === "express" ? 200 : 0,
        total: total + (shippingMethod === "express" ? 200 : 0),
      };

      const response = await placeOrder(orderInfo);
      toast.success(response.data.message);
      await fetchCart();
      navigate("/my-orders");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="order-summary">
        <h3 className="mb-4">Order Summary</h3>

        <div className="card mb-4 p-3">
          <h5 className="mb-3">Customer Info</h5>
          <div className="row gx-3 gy-2">
            <div className="col-md-6">
              <input
                type="text"
                name="customer_name"
                placeholder="Full Name *"
                className={`form-control ${
                  errors.customer_name ? "is-invalid" : ""
                }`}
                value={customer.customer_name}
                onChange={(e) => handleChange(e, "customer")}
              />
              {errors.customer_name && (
                <div className="invalid-feedback">{errors.customer_name}</div>
              )}
            </div>
            <div className="col-md-6">
              <input
                type="tel"
                name="customer_phone"
                placeholder="customer_phone *"
                className={`form-control ${
                  errors.customer_phone ? "is-invalid" : ""
                }`}
                value={customer.customer_phone}
                onChange={(e) => handleChange(e, "customer")}
              />
              {errors.customer_phone && (
                <div className="invalid-feedback">{errors.customer_phone}</div>
              )}
            </div>
            <div className="col-md-6">
              <input
                type="customer_email"
                name="customer_email"
                placeholder="customer_email *"
                className={`form-control ${
                  errors.customer_email ? "is-invalid" : ""
                }`}
                value={customer.customer_email}
                onChange={(e) => handleChange(e, "customer")}
              />
              {errors.customer_email && (
                <div className="invalid-feedback">{errors.customer_email}</div>
              )}
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                <option value="standard">Standard Shipping (Free)</option>
                <option value="express">Express Shipping (+₹200)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card mb-4 p-3">
          <h5 className="mb-3">Shipping Address</h5>
          <div className="row gx-3 gy-2">
            {["street", "area", "city", "state", "pincode"].map((field) => (
              <div key={field} className="col-md-6">
                <input
                  type="text"
                  name={field}
                  placeholder={`${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  } *`}
                  className={`form-control ${
                    errors[`shipping_${field}`] ? "is-invalid" : ""
                  }`}
                  value={shipping[field]}
                  onChange={(e) => handleChange(e, "shipping")}
                />
                {errors[`shipping_${field}`] && (
                  <div className="invalid-feedback">
                    {errors[`shipping_${field}`]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="form-check mt-3">
            <input
              type="checkbox"
              id="same"
              className="form-check-input"
              checked={sameAsShipping}
              onChange={() => setSameAsShipping((s) => !s)}
            />
            <label htmlFor="same" className="form-check-label">
              Billing address same as shipping
            </label>
          </div>

          {!sameAsShipping && (
            <>
              <h5 className="mt-4 mb-3">Billing Address</h5>
              <div className="row gx-3 gy-2">
                {["street", "area", "city", "state", "pincode"].map((field) => (
                  <div key={field} className="col-md-6">
                    <input
                      type="text"
                      name={field}
                      placeholder={`${
                        field.charAt(0).toUpperCase() + field.slice(1)
                      } *`}
                      className={`form-control ${
                        errors[`billing_${field}`] ? "is-invalid" : ""
                      }`}
                      value={billing[field]}
                      onChange={(e) => handleChange(e, "billing")}
                    />
                    {errors[`billing_${field}`] && (
                      <div className="invalid-feedback">
                        {errors[`billing_${field}`]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card mb-4 p-3">
          <h5 className="mb-3">Your Items</h5>
          {cart.map((item) => (
            <div
              key={item.id}
              className="order-item-card d-flex flex-column flex-md-row gap-3 mb-3 p-2 shadow-sm rounded bg-light"
            >
              <div className="text-center">
                <img
                  src={`${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${item.product.image}`}
                  alt={item.product.name}
                  className="item-image rounded"
                />
              </div>
              <div className="flex-grow-1">
                <div className="row gy-2">
                  <div className="col-6 col-sm-3">
                    <small className="text-muted">Product</small>
                    <div className="fw-semibold">{item.product.name}</div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <small className="text-muted">Unit Price</small>
                    <div>{formatPrice(item.product.price)}</div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <small className="text-muted">Quantity</small>
                    <div>{item.quantity}</div>
                  </div>
                  <div className="col-6 col-sm-3 text-sm-end">
                    <small className="text-muted">Total</small>
                    <div className="fw-bold">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card mb-4 p-3 price-summary-card">
          <h5 className="mb-3 border-bottom pb-2">Order Summary</h5>
          <div className="d-flex justify-content-between mb-2 small">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2 small">
            <span>Shipping Charges</span>
            <span>
              {shippingMethod === "express" ? formatPrice(200) : "Free"}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-2 small">
            <span>Delivery Type</span>
            <span>
              {shippingMethod === "express"
                ? "Express Delivery"
                : "Standard Delivery"}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-2 small">
            <span>Courier Company</span>
            <span>Delhivery / Bluedart</span>
          </div>
          <div className="d-flex justify-content-between mb-3 small">
            <span>Estimated Delivery</span>
            <span>
              {shippingMethod === "express" ? "2-4 Days" : "5-7 Days"}
            </span>
          </div>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Total</h6>
            <h5 className="mb-0">
              {formatPrice(total + (shippingMethod === "express" ? 200 : 0))}
            </h5>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/cart")}
          >
            <MdOutlineKeyboardBackspace /> Back to cart
          </button>
          <button
            className="btn btn-success"
            onClick={handleProceedToPayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processing...
              </>
            ) : (
              "Confirm Order"
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSummary;
