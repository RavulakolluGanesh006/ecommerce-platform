import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import './Login.css'; // Assuming you have a CSS file for styling

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      alert('Login success!');
      navigate('/profile');
    } catch (err) {
      alert("not success");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">  {/* ✅ Add the container */}
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">LOGIN</button>
      </form>
    </div>
  );
}
