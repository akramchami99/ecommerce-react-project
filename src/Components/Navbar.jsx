import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/cart">Cart ({cart.length})</Link>
          <span>Hello, {user.username}</span>
          <Link to="/" onClick={handleLogout}>Logout</Link>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
