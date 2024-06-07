import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedCart = Cookies.get('cart');
    if (user && token) {
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        fetchCart(user.id, token);
      }
    }
  }, [user, token]);

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
      Cookies.set('cart', JSON.stringify(detailedProducts), { expires: 1 });
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
    Cookies.set('cart', JSON.stringify(updatedCart), { expires: 1 });
    setNotification(`Added ${product.title} to the cart!`);
    setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
  };

  const updateQuantity = (productId, delta) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
    Cookies.set('cart', JSON.stringify(updatedCart), { expires: 1 });
  };

  const emptyCart = () => {
    setCart([]);
    Cookies.set('cart', JSON.stringify([]), { expires: 1 });
  };

  const validatePurchase = () => {
    emptyCart();
    alert("Purchase Confirmed !!");
  };

  return (
    <CartContext.Provider value={{ cart, notification, addToCart, updateQuantity, emptyCart, validatePurchase }}>
      {children}
    </CartContext.Provider>
  );
};
