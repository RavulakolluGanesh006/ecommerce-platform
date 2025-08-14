import React, { useEffect, useState } from "react";
import API from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await API.put(`/orders/${id}/status`, { status: newStatus }); // <-- backend should handle this
      fetchOrders(); // refresh orders after update
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Admin Orders Dashboard</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Customer:</strong> {order.userId?.name} ({order.userId?.email})
            </p>
            <p><strong>Mobile:</strong> {order.address?.mobileNo}</p>
            <p>
              <strong>Address:</strong>{" "}
              {order.address?.houseNo}, {order.address?.area}, {order.address?.city},{" "}
              {order.address?.state} - {order.address?.pincode}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              <a href={order.address?.location} target="_blank" rel="noopener noreferrer">
                Google Maps
              </a>
            </p>
            <p><strong>Payment ID:</strong> {order.paymentId || "UPI (manual check)"}</p>
            <p><strong>Total:</strong> ₹{order.amount}</p>
            <p><strong>Status:</strong> {order.status}</p>

            <ul>
              {order.products.map((p, index) => {
                const product = p.productId;
                return (
                  <li key={index}>
                    {product && product.title ? (
                      <>
                        <strong>{product.title}</strong> – ₹{product.price} x {p.quantity}
                      </>
                    ) : (
                      <span>Product details not found</span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Accept Button */}
            <button
              onClick={() => updateOrderStatus(order._id, "Accepted")}
              disabled={order.status === "Accepted"}
              style={{
                backgroundColor: order.status === "Accepted" ? "#ccc" : "#28a745",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: order.status === "Accepted" ? "not-allowed" : "pointer",
                marginTop: "10px",
              }}
            >
              {order.status === "Accepted" ? "✅ Accepted" : "Accept Order"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
