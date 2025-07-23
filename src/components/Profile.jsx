import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./Profile.css"; // if you use the CSS
import { addToCart } from "../api";
export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
     const token = localStorage.getItem("token");
  
  if (!token) {
    alert("Please login to add items to cart");
    return;
  }
    await API.delete(`/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };
  const handleAddToCart = async (id) => {
  try {
    await addToCart(id);
    alert("Product added to cart!");
  } catch (err) {
    alert("Failed to add to cart");
    console.error(err);
  }
};

  return (
    <div className="container">
      {/* <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p> */}

      <h3>All Products:</h3>

{user.isAdmin != true && (
  <Link to="/cart">🛒 View Cart</Link>
)}
     <ul className="product-grid">
  {products.map((product) => (
    <li key={product._id}>
      <div className="card">
        <img src={product.image} alt={product.title} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <div className="card-price">₹{product.price}</div>
          <p className="card-text">{product.description}</p>
          {/* <a href="#" className="btn-primary">Shop Now</a> */}
          <button className="btn-primary" onClick={() => handleAddToCart(product._id)}>🛒 Add to Cart</button>
          {user.isAdmin && (
            <div className="actions">
              <Link to={`/edit-product/${product._id}`}>✏️ Edit</Link>
              <button onClick={() => handleDelete(product._id)}>🗑️ Delete</button>
            </div>
          )}
        </div>
      </div>
    </li>
  ))}
</ul>

{user.isAdmin && (
  <Link to="/add-product" className="add-product">➕ Add New Product</Link>
)}

<button
  className="logout-btn"
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }}
>
  Logout
</button>

      
     

   {/* <button
  className="logout-btn"
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }}
>
  Logout
</button> */}
    </div>
  );
}
