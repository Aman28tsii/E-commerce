import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginSignup from './LoginSignup';

const Cart = ({ cart, resetCart }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [errorMessage, setErrorMessage] = useState('');
    const [orderSuccessMessage, setOrderSuccessMessage] = useState('');
    const [orderHistory, setOrderHistory] = useState([]);
    const [showOrderHistory, setShowOrderHistory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingHistory, setFetchingHistory] = useState(false);
    
    // Use local state for cart to allow dynamic updating
    const [localCart, setLocalCart] = useState(cart);

    const totalPrice = localCart.reduce((total, item) => total + item.price * item.quantity, 0);

    useEffect(() => {
        setLocalCart(cart); // Initialize with the passed cart prop
    }, [cart]);

    useEffect(() => {
        const handleTokenChange = () => {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken);
        };

        window.addEventListener('storage', handleTokenChange);

        return () => window.removeEventListener('storage', handleTokenChange);
    }, []);

    const handleOrderConfirmation = () => {
        if (!token) {
            setModalOpen(true);
        } else {
            confirmOrder();
        }
    };

    const confirmOrder = async () => {
        setLoading(true);
        const orderData = {
            orderDetails: localCart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            totalPrice: totalPrice,
        };

        try {
            await axios.post('http://localhost:3000/api/orders', orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            resetCart(); // Reset cart in parent
            setOrderSuccessMessage('Your order has been placed successfully!');
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderHistory = async () => {
        setFetchingHistory(true);
        try {
            const response = await axios.get('http://localhost:3000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrderHistory(response.data.orders);
            setErrorMessage('');
        } catch (error) {
            handleError(error);
        } finally {
            setFetchingHistory(false);
        }
    };

    const handleToggleOrderHistory = () => {
        setShowOrderHistory(prev => !prev);
        if (!showOrderHistory) {
            fetchOrderHistory();
        }
    };

    const handleLoginSuccess = () => {
        setModalOpen(false);
        setToken(localStorage.getItem('token'));
        setErrorMessage('');
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setOrderHistory([]);
    };

    const handleError = (error) => {
        const message = error.response ? error.response.data.message : 'An error occurred. Please try again later.';
        setErrorMessage(message);
        resetCart();
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...localCart];
        updatedCart[index].quantity += 1;
        setLocalCart(updatedCart);
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...localCart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
            setLocalCart(updatedCart);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-xl bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Cart Items:</h2>
            <ul className="list-disc list-inside mb-4">
                {localCart.map((item, index) => (
                    <li key={index} className="mb-2 flex items-center">
                        {item.image && (
                            <img src={`http://localhost:3000/${item.image}`} alt={item.name} className="w-16 h-16 object-cover mr-3" />
                        )}
                        <div className="flex-grow">
                            {item.name} - Price: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => decreaseQuantity(index)} 
                                className="bg-gray-300 p-2 rounded hover:bg-gray-400 transition"
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                                onClick={() => increaseQuantity(index)} 
                                className="bg-gray-300 p-2 rounded hover:bg-gray-400 transition"
                            >
                                +
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <h3 className="text-xl font-medium mb-4">Total Price: ${(totalPrice).toFixed(2)}</h3>
            <div className="space-y-2">
                <button 
                    className={`w-full py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition duration-300`}
                    onClick={handleOrderConfirmation} 
                    disabled={loading}
                >
                    {loading ? 'Placing Order...' : 'Confirm Order'}
                </button>

                {token && (
                    <button 
                        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}
                <button 
                    className="w-full py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
                    onClick={handleToggleOrderHistory}
                >
                    {showOrderHistory ? 'Hide Order History' : 'Show Order History'}
                </button>
            </div>

            {orderSuccessMessage && <p className="text-green-600 mt-4">{orderSuccessMessage}</p>}
            {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}

            {showOrderHistory && (
                <div className="mt-4">
                    <h3 className="text-xl font-medium">Order History:</h3>
                    {fetchingHistory ? (
                        <p>Loading...</p>
                    ) : (
                        <ul className="list-disc list-inside">
                            {orderHistory.length > 0 ? orderHistory.map((order) => (
                                <li key={order.id} className="mb-4">
                                    <h4 className="text-lg font-semibold">Order ID: {order.id}</h4>
                                    <p>Total: ${order.totalPrice.toFixed(2)}</p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <h5 className="text-md font-semibold">Ordered Items:</h5>
                                    <ul className="list-decimal pl-5">
                                        {Array.isArray(order.orderDetails) ? order.orderDetails.map((item, index) => (
                                            <li key={index} className="flex items-center mb-2">
                                                {item.image && (
                                                    <img src={`http://localhost:3000/${item.image}`} alt={item.name} className="w-16 h-16 object-cover mr-3" />
                                                )}
                                                <div>
                                                    {item.name} - Quantity: {item.quantity} - Price: ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </li>
                                        )) : (
                                            <li>No items in this order.</li>
                                        )}
                                    </ul>
                                </li>
                            )) : (
                                <li>No orders found.</li>
                            )}
                        </ul>
                    )}
                </div>
            )}

            {isModalOpen && (
                <LoginSignup 
                    onSuccess={handleLoginSuccess}
                    onClose={() => setModalOpen(false)}
                    errorMessage={errorMessage}
                />
            )}
        </div>
    );
};

export default Cart;