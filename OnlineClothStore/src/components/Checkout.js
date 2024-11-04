// src/components/Checkout.js
import React from 'react';

const Checkout = ({ cartItems }) => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        // Logic to handle checkout process
        alert('Proceeding to checkout...');
    };

    return (
        <div className="checkout" >
            <h1>Checkout</h1>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id}>
                        {item.name} - ${item.price} x {item.quantity}
                    </li>
                ))}
            </ul>
            <h2>Total: ${totalAmount}</h2>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Checkout;