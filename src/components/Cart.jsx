
import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
//import QRCode from "../assets/upi.jpg"; // Make sure this image exists
import OrderEmailSender from "../admin/EmailOrderDetails";
export default function Cart() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    country: "",
    fullName: "",
    mobileNo: "",
    location: "",
    houseNo: "",
    area: "",
    landmark: "",
    pincode: "",
    state: "",
    city: ""
  });

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
const [orderPlaced, setOrderPlaced] = useState(false);
const [isPlacingOrder, setIsPlacingOrder] = useState(false);
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

    API.get("/cart")
      .then((res) => {
        const items = res.data?.products || [];
        setCartItems(items);
        const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
        setTotal(total);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRemove = async (productId) => {
    try {
      await API.delete(`/cart/remove/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuantity = (productId, change) => {
    const updated = cartItems.map((item) => {
      if (item.productId._id === productId) {
        const newQty = item.quantity + change;
        if (newQty >= 1) item.quantity = newQty;
      }
      return item;
    });
    setCartItems([...updated]);
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }
  for (const key in form) {
    if (!form[key]) {
      alert(`Please fill in your ${key}`);
      return;
    }
  }
    const order = {
      address: form,
      products: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      amount: total,
      paymentId: "manual-upi-" + Date.now()
    };

  try {
    setIsPlacingOrder(true);
    await API.post("/orders", order);
    setOrderDetails(order);
    setOrderPlaced(true);
    alert("✅ Order placed successfully! Email will be sent to admin.");
    window.location.href = "/profile";
  } catch (err) {
    console.error(err);
    alert("❌ Failed to place order");
  } finally {
    setIsPlacingOrder(false);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.productId._id}>
              <strong>{item.productId.title}</strong> - ₹{item.productId.price} × {item.quantity}
              <button onClick={() => handleUpdateQuantity(item.productId._id, -1)}>-</button>
              <button onClick={() => handleUpdateQuantity(item.productId._id, 1)}>+</button>
              <button onClick={() => handleRemove(item.productId._id)}>❌ Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ₹{total}</h3>
      {cartItems.length > 0 && (
        <button onClick={() => setShowForm(true)}>Buy Now</button>
      )}

<div className="address-form">
  <h3>Shipping Address</h3>
  {[
    "country",
    "fullName",
    "mobileNo",
    "location",
    "houseNo",
    "area",
    "landmark",
    "pincode",
    "state",
    "city"
  ].map((field) => (
    <input
      key={field}
      name={field}
      placeholder={field}
      value={form[field]}
      onChange={handleChange}
      required
    />
  ))}

  <button
    className="place-order-btn"
    onClick={handlePlaceOrder}
    disabled={isPlacingOrder}
  >
    {isPlacingOrder ? "Processing..." : "✅ I've Paid – Place Order"}
  </button>
</div>


        {orderPlaced && orderDetails && (
          <OrderEmailSender orderDetails={orderDetails} />
        )}
      </div>

  );
}
