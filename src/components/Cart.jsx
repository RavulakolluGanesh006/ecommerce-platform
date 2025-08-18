import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

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
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD or UPI
  const [transactionId, setTransactionId] = useState("");

  const navigate = useNavigate();

  // ✅ Calculate total safely
  useEffect(() => {
    setTotal(
      cartItems.reduce(
        (sum, item) =>
          item.productId ? sum + item.productId.price * item.quantity : sum,
        0
      )
    );
  }, [cartItems]);

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setScreenshot(reader.result); // base64
    if (file) reader.readAsDataURL(file);
  };

  // Load cart items
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view your cart");
      navigate("/login");
      return;
    }

    API.get("/cart")
      .then((res) => {
        const items = res.data?.products || [];
        // ✅ filter out invalid items
        setCartItems(items.filter((item) => item.productId));
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  // Handle address form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Remove cart item
  const handleRemove = async (productId) => {
    try {
      await API.delete(`/cart/remove/${productId}`);
      setCartItems(cartItems.filter((item) => item.productId?._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  // Update quantity
const handleUpdateQuantity = (productId, change) => {
  setCartItems((prev) =>
    prev.map((item) => {
      if (item.productId?._id === productId) {
        const newQty = item.quantity + change;
        if (newQty >= 1) {
          return { ...item, quantity: newQty }; // ✅ return new object
        }
      }
      return item;
    })
  );
};


  // Place order
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

    // Validate form
    for (const key in form) {
      if (!form[key]) {
        alert(`Please fill in your ${key}`);
        return;
      }
    }

    // If UPI selected, require screenshot
    if (paymentMethod === "UPI" && !screenshot) {
      alert("Please upload UPI payment screenshot");
      return;
    }

    const order = {
      address: form,
      products: cartItems
        .filter((item) => item.productId) // ✅ filter valid items
        .map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
      amount: total,
      screenshot: paymentMethod === "UPI" ? screenshot : null,
      paymentMethod
    };

    try {
      setIsPlacingOrder(true);
      await API.post("/orders", order, {
        headers: { "Content-Type": "application/json" }
      });
      setOrderPlaced(true);
      alert("✅ Order placed successfully! ☕ Sit back and relax — we’ll call you soon 📞");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Connect to better network and try again");
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
      {cartItems.map((item, i) =>
        item.productId ? (
          <li key={item.productId._id || i}>
            {item.productId.title} - ₹{item.productId.price} × {item.quantity}

            <button onClick={() => handleUpdateQuantity(item.productId._id, -1)}>
              -
            </button>
            <button onClick={() => handleUpdateQuantity(item.productId._id, 1)}>
              +
            </button>
            <button onClick={() => handleRemove(item.productId._id)}>
              ❌ Remove
            </button>
          </li>
        ) : null
      )}
    </ul>
      )}
      <h3>Total: ₹{total}</h3>
      {cartItems.length > 0 && (
        <button onClick={() => setShowForm(true)}>Proceed to Checkout</button>
      )}

      {showForm && (
        <div className="address-form">
          <h3>Shipping Address</h3>
          {Object.keys(form).map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          ))}

          <label>
            Payment Method:
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
            </select>
          </label>
          {paymentMethod === "UPI" && (
            <>
              <label>
                Transaction ID:
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </label>
              <label>
                Upload Payment Screenshot:
                <input type="file" accept="image/*" onChange={handleScreenshotUpload} />
              </label>
              {screenshot && <img src={screenshot} alt="Preview" width="200" />}
            </>
          )}

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? "Processing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
