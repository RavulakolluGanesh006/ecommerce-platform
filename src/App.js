
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import PrivateRoute from "./components/PrivateRoute";
import EditProduct from './admin/EditProduct';
import AdminRoute from "./admin/AdminRoute";
import AdminDashboard from './admin/AdminDashboard';
import AddProduct from './admin/AddProduct';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />


<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
<Route path="/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
<Route path="/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />

      </Routes>
    </Router>
  );
}
