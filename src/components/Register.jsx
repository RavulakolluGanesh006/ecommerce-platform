import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './Register.css';


export default function Register() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/auth/register`, form);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <h1>REGISTER</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder='Name' />
        <input name="email" onChange={handleChange} placeholder='Email' />
        <input name="password" onChange={handleChange} placeholder='Password' />
        <button type="submit">Register</button>
      </form>
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
}
