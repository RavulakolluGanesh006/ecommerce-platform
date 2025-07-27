import React from "react";
import API from "../api";

export default function Checkout({ amount, form }) {
  const handlePayment = async () => {
    try {
      // 1. Create order on backend
      const { data: order } = await API.post("/payment/create-order", { amount });

      const options = {
        key: "rzp_test_13wbrY0yakzGX", // Replace with your Razorpay key
        amount: order.amount,
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          // 2. Handle success
          const orderData = {
            address: form, // User's shipping address
            amount: order.amount / 100, // Convert to rupees
            paymentId: response.razorpay_payment_id,
          };

          try {
            await API.post("/orders", orderData);
            alert("✅ Order placed successfully!");
            // optionally: navigate to success page
          } catch (err) {
            console.error("❌ Order save failed:", err);
            alert("Payment successful but order save failed.");
          }
        },
        prefill: {
          name: form.fullName || "",
          email: "example@gmail.com", // optional
          contact: form.mobile || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Razorpay order creation failed:", err);
      alert("Something went wrong during payment.");
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay ₹{amount / 100} with Razorpay
    </button>
  );
}
