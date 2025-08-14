// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import API from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p style={styles.loading}>Loading your orders...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📦 My Orders</h2>
      {orders.length === 0 ? (
        <p style={styles.empty}>No orders found.</p>
      ) : (
        orders.map((order) => {
          const status = order.status || "Pending";
          return (
            <div key={order._id} style={styles.orderCard}>
              {/* Order Header */}
              <div style={styles.orderHeader}>
                <span><strong>Order ID:</strong> {order._id}</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>

              {/* Address */}
              {order.address && (
                <div style={styles.address}>
                  <strong>Delivery Address:</strong>
                  <p style={{ margin: "5px 0" }}>
                    {order.address.fullName}, {order.address.houseNo}, {order.address.area},<br />
                    {order.address.landmark}, {order.address.city}, {order.address.state} - {order.address.pincode},<br />
                    {order.address.country}<br />
                    📞 {order.address.mobileNo}
                  </p>
                </div>
              )}

              {/* Order Info */}
              <div style={styles.orderInfo}>
                <div>
                  <strong>Payment:</strong> {order.paymentMethod || "N/A"}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      ...styles.status,
                      background:
                        status === "Delivered"
                          ? "#d4edda"
                          : status === "Pending"
                          ? "#fff3cd"
                          : "#f8d7da",
                      color:
                        status === "Delivered"
                          ? "#155724"
                          : status === "Pending"
                          ? "#856404"
                          : "#721c24",
                    }}
                  >
                    {status}
                  </span>
                </div>
                <div>
                  <strong>Total:</strong> ₹{order.amount}
                </div>
              </div>

              {/* Products */}
              <div style={styles.products}>
                {order.products.map((p, index) => (
                  <div key={index} style={styles.productRow}>
                    {p.productId?.image && (
                      <img
                        src={p.productId.image}
                        alt={p.productId?.description}
                        style={styles.productImg}
                      />
                    )}
                    <div>
                      <p style={{ margin: 0 }}>{p.productId?.description}</p>
                      <small>₹{p.productId?.price} × {p.quantity}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "auto" },
  heading: { fontSize: "1.5rem", marginBottom: "20px" },
  empty: { textAlign: "center", color: "#666" },
  loading: { textAlign: "center", marginTop: "20px" },
  orderCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    background: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
    marginBottom: "10px",
    fontSize: "0.9rem",
    color: "#555",
  },
  address: {
    background: "#f9f9f9",
    padding: "8px",
    borderRadius: "5px",
    fontSize: "0.85rem",
    marginBottom: "10px",
    lineHeight: "1.4",
  },
  orderInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    flexWrap: "wrap",
    gap: "10px",
  },
  status: {
    padding: "4px 8px",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "0.85rem",
  },
  products: { borderTop: "1px solid #eee", paddingTop: "10px" },
  productRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    gap: "10px",
  },
  productImg: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "5px",
  },
};
