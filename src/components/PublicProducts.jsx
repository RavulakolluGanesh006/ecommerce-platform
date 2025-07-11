import React, { useEffect, useState } from "react";
import API from "../api";

export default function PublicProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>🛍️ All Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id} style={{ marginBottom: "10px" }}>
            <strong>{product.title}</strong> <br />
            ₹{product.price} <br />
            <img src={product.image} alt={product.title} width="150" /><br/>
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
