import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function EditProduct() {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });

  // Fetch the product by ID when page loads
  useEffect(() => {
    API.get("/products") // Get all products
      .then((res) => {
        const product = res.data.find((p) => p._id === id);
        if (product) {
          setForm({
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image
          });
        } else {
          alert("Product not found");
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${id}`, form); // Call PUT API
      alert("Product updated");
      navigate("/admin"); // Redirect back to admin dashboard
    } catch (err) {
      console.error(err);
      alert("Error updating product");
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
