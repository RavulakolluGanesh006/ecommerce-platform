import React, { useState } from "react";
import API from "../api"; // Your Axios instance

export default function OrderEmailSender({ orderDetails }) {
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const response = await API.post("/email/send", {
        to: "ravulakolluganesh06@gmail.com", // ✅ Admin's email
        bcc: "sparrowgaming49@gmail.com", // Optional: your own
        subject: "📥 New Order Placed",
        message: `
New order received from ${orderDetails.address.fullName}.

🧾 Order Summary:
- Total Amount: ₹${orderDetails.amount}
- Payment ID: ${orderDetails.paymentId}

📍 Shipping Address:
${orderDetails.address.houseNo}, ${orderDetails.address.area},
${orderDetails.address.city}, ${orderDetails.address.state} - ${orderDetails.address.pincode},
${orderDetails.address.country}
📞 ${orderDetails.address.mobileNo}
📍 Location: ${orderDetails.address.location}

📦 Products:
${orderDetails.products.map(
  (p, i) => `  ${i + 1}. Product ID: ${p.productId}, Qty: ${p.quantity}`
).join("\n")}
        `,
      });

      if (response.status === 200) {
        setEmailStatus("✅ Email sent to admin.");
      } else {
        setEmailStatus("❌ Failed to send email.");
      }
    } catch (error) {
      console.error("Email send failed:", error);
      setEmailStatus("❌ Email send failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSendEmail} disabled={loading}>
        {loading ? "Sending Email..." : "Send Order Email"}
      </button>
      <p>{emailStatus}</p>
    </div>
  );
}
