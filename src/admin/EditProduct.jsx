import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setForm({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          image: res.data.image
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading product");
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${id}`, form);
      alert("✅ Product updated successfully!");
      navigate("/admin"); // Back to dashboard
    } catch (err) {
      console.error(err);
      alert("❌ Error updating product");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Edit Product</h2>
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
      <button type="submit">Update Product</button>
    </form>
  );
}
