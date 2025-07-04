
import React, { useState } from "react";
import API from "../api"; // your axios instance
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/add-product", form);
      alert("✅ Product added successfully!");
      navigate("/admin"); // Go back to Admin Dashboard
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Add New Product</h2>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      /><br/>
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      /><br/>
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      /><br/>
      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
      /><br/>
      <button type="submit">Add Product</button>
    </form>
  );
}
