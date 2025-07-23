import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});
export const addToCart = async (productId) => {
  const token = localStorage.getItem("token");
  return await API.post("/cart/add", { productId }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
