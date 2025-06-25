import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/auth/profile')
      .then((res) => setUser(res.data))
      .catch(() => alert('Unauthorized or token expired'));
  }, []);
    const handleLogout = () => {
    localStorage.removeItem("token");        // Remove token
    window.location.href = "/login";         // Redirect to login page
  };

  return user ? (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>logout</button>
    </div>
  ) : (
    <p>Loading...</p>
    
  );


}
