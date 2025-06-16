import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import { useCart } from "../../context/cartContext";
import "./Cart.css";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, increment, decrement, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [removingId, setRemovingId] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleRemove = async (id) => {
    setRemovingId(id);
    await removeFromCart(id);
    setRemovingId(null);
  };

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    navigate("/cart/order-summary");
  };

  return (
    <Layout>
      <div className="p-2">
        <h2 className="mb-3">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-danger text-center">No items in cart</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-borderless cart-table align-middle">
                <thead className="border-bottom">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.id} className="border-bottom">
                      <td>{index + 1}</td>
                      <td>{item.product.name}</td>
                      <td>{formatPrice(item.product.price)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <CiSquareMinus
                            size={26}
                            onClick={() => decrement(item.id)}
                            style={{ cursor: "pointer" }}
                          />
                          <span>{item.quantity}</span>
                          <CiSquarePlus
                            size={26}
                            onClick={() => increment(item.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </td>
                      <td>{formatPrice(item.product.price * item.quantity)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                        >
                          {removingId === item.id ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "Remove"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" className="text-end fw-semibold">
                      Total
                    </td>
                    <td colSpan="2" className="fw-semibold">
                      {formatPrice(total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-end mt-3">
              <button
                className="btn btn-primary"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Redirecting...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
