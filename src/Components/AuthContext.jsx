import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedCart = localStorage.getItem('cart');
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        fetchCart(parsedUser.id, storedToken);
      }
    }
  }, []);

  const loginUser = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    fetchCart(user.id, token);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    setCart([]);
  };

  const fetchCart = async (userId, token) => {
    try {
      const cartResponse = await fetch(`https://fakestoreapi.com/carts/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const cartData = await cartResponse.json();
      const products = cartData[0]?.products || [];

      const detailedProducts = await Promise.all(
        products.map(async (product) => {
          const productResponse = await fetch(`https://fakestoreapi.com/products/${product.productId}`);
          const productData = await productResponse.json();
          return {
            ...productData,
            quantity: product.quantity,
          };
        })
      );

      setCart(detailedProducts);
      localStorage.setItem('cart', JSON.stringify(detailedProducts));
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setNotification(`Added ${product.title} to the cart!`);
    setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
  };

  const updateQuantity = (productId, delta) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const emptyCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  return (
    <AuthContext.Provider value={{ user, cart, token, notification, loginUser, logoutUser, addToCart, updateQuantity, emptyCart }}>
      {children}
    </AuthContext.Provider>
  );
};
