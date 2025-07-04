import React from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>

      {user.isAdmin && (
        <div>
          <h3>Admin Actions:</h3>
          <Link to="/admin">🔑 Go to Admin Dashboard</Link>
          <br />
          <Link to="/add-product">➕ Add New Product</Link>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

