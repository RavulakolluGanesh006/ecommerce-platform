import React, { useEffect, useState } from "react";
import API from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Admin Orders Dashboard</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}
          >
            <p><strong>Customer:</strong> {order.userId?.name} ({order.userId?.email})</p>
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
          </div>
        ))
      )}
    </div>
  );
}
