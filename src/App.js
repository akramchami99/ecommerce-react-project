import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import ProductList from './Components/ProductList';
import ProductDetail from './Components/ProductDetail';
import Cart from './Components/Cart';
import Login from './Components/Login';
import { AuthProvider, AuthContext } from './Components/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Notification />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<ProtectedRoute component={Cart} />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ component: Component }) {
  const { user } = useContext(AuthContext);

  return user ? <Component /> : <div>Please log in to view this page.</div>;
}

function Notification() {
  const { notification } = useContext(AuthContext);
  
  return (
    notification ? (
      <div className="notification">
        {notification}
      </div>
    ) : null
  );
}

export default App;
