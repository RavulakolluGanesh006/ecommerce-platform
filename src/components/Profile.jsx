import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { addToCart } from "../api";
import { FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import "./Profile.css";
import logo from "../assets/logo.jpg";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search input state

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleAddToCart = async (id) => {
    try {
      await addToCart(id);
      alert("Product added to cart!");
    } catch {
      alert("Failed to add to cart");
    }
  };

  // ✅ Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* ✅ Top Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="Mahadev Traders"
            className="logo"
            style={{ width: "179px", height: "auto" }}
          />
        </div>
        <div className="nav-right">
          {!user?.isAdmin && (
            <Link to="/my-orders" className="nav-link">
              <FaBoxOpen
                style={{ marginRight: "5px", width: "30px", height: "30px" }}
              />{" "}
              My Orders
            </Link>
          )}
        </div>
        <div className="nav-right">
          {!user?.isAdmin && (
            <Link to="/cart" className="nav-link">
              <FaShoppingCart
                style={{ marginRight: "5px", width: "30px", height: "30px" }}
              />{" "}
              My Cart
            </Link>
          )}
        </div>
      </nav>

      <div className="container">
        <h3>Mahadev Traders</h3>

        {/* ✅ Search Bar */}
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <ul className="product-grid">
          {filteredProducts.map((product) => (
            <li key={product._id}>
              <div className="card">
                <img
                  src={product.image}
                  alt={product.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <div className="card-price">₹{product.price}</div>
                  <p className="card-text">{product.description}</p>
                  <button
                    className="btn-primary"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    🛒 Add to Cart
                  </button>
                  {user?.isAdmin && (
                    <div className="actions">
                      <Link to={`/edit-product/${product._id}`}>✏️ Edit</Link>
                      <button onClick={() => handleDelete(product._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {user?.isAdmin && (
          <div>
            <Link to="/add-product" className="add-product">
              ➕ Add New Product
            </Link>
            <Link to="/admin-orders">📋 View Orders</Link>
          </div>
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
      </div>
    </div>
  );
}
