import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { useCart } from "../../context/cartContext";

const Order = () => {
  const { getUserOrders } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        setOrders(response.data.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className="order-page-container p-2">
        <h2 className="mb-3">My Orders</h2>

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "60vh" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-danger mt-5">No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card mb-4 p-3 border rounded">
              <h4>Order #{order.id}</h4>
              <p>
                <strong>Total:</strong> ₹{order.total_amount}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Shipping Method:</strong> {order.shipping_method}
              </p>

              {order.shipping_address && (
                <div className="mt-3">
                  <p>
                    <strong>Shipping Address: </strong>
                    {[
                      order.shipping_address.name,
                      order.shipping_address.street,
                      order.shipping_address.city,
                      order.shipping_address.state,
                      order.shipping_address.zip,
                      order.shipping_address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}

              <strong className="mt-3">Items:</strong>
              <ul className="mb-0">
                {order.order_items.map((item) => (
                  <li key={item.id}>
                    {item.product?.name || "Product removed"} — Qty:{" "}
                    {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Order;
