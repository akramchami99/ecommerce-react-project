import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchCart(parsedUser.id);
        }
    }, []);

    const loginUser = (user) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        fetchCart(user.id);
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        setCart([]);
    };

    const fetchCart = async (userId) => {
        try {
            const cartResponse = await fetch(`https://fakestoreapi.com/carts/user/${userId}`);
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
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    const addToCart = (product) => {
        const existingProduct = cart.find((item) => item.id === product.id);
        if (existingProduct) {
            setCart(cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, delta) => {
        setCart(cart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + delta } : item
        ).filter(item => item.quantity > 0));
    };

    const emptyCart = () => {
        setCart([]);
    };

    return (
        <AuthContext.Provider value={{ user, cart, loginUser, logoutUser, addToCart, updateQuantity, emptyCart }}>
            {children}
        </AuthContext.Provider>
    );
};