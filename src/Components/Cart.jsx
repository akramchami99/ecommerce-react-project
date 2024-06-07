import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Cart = () => {
    const { cart, updateQuantity, emptyCart, validatePurchase } = useContext(AuthContext);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    

    return (
        <div className='cart-main'>
            <h1>Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className='cart-content'>
                    {cart.map((item, index) => (
                        <div key={index} className="cart-item">
                            <h2>{item.title}</h2>
                            <p>${item.price} x {item.quantity}</p>
                            <div>
                                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                            </div>
                        </div>
                    ))}
                    <h2>Total: ${total.toFixed(2)}</h2>
                    <button onClick={emptyCart}>Empty Cart</button><br/>
                    <button onClick={validatePurchase}>Validate Purchase</button>
                </div>
            )}
        </div>
    );
};

export default Cart;