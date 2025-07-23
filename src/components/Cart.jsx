import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view cart");
      navigate("/login");
      return;
    }

   API.get("/cart", {
  headers: { Authorization: `Bearer ${token}` }
})
      .then((res) => setCartItems(res.data?.products || []))
      .catch((err) => console.error(err));
  };

  const handleRemove = async (productId) => {
    try {
      await API.delete(`/cart/remove/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuantity = async (productId, change) => {
    const updatedItems = cartItems.map((item) => {
      if (item.productId._id === productId) {
        const newQty = item.quantity + change;
        if (newQty >= 1) item.quantity = newQty;
      }
      return item;
    });
    setCartItems([...updatedItems]);
    // Optional: Save to backend if you add quantity update API
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.productId._id}>
              <strong>{item.productId.title}</strong> - ₹{item.productId.price} x {item.quantity}
              <button onClick={() => handleUpdateQuantity(item.productId._id, -1)}>-</button>
              <button onClick={() => handleUpdateQuantity(item.productId._id, 1)}>+</button>
              <button onClick={() => handleRemove(item.productId._id)}>❌ Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ₹{totalPrice}</h3>
    </div>
  );
}
