import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => {
      setProducts(res.data);
    }).catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await API.delete(`/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div>
      <h2>📋 Admin Dashboard</h2>
      <Link to="/add-product">➕ Add New Product</Link>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <strong>{product.title}</strong> - ₹{product.price}
            {" "}
            <Link to={`/edit-product/${product._id}`}>✏️ Edit</Link>
            {" "}
            <button onClick={() => handleDelete(product._id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
