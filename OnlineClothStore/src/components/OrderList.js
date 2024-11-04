import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Call the API to fetch the orders
                const response = await axios.get('/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // If you're using token-based authentication
                    }
                });
                setOrders(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <p>Order ID: {order.id}</p>
                            <p>Order Date: {order.date}</p>
                            <p>Total: ${order.total}</p>
                            {/* Add more order details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderList;