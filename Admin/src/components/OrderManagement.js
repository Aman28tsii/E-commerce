import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);   // State to hold the list of orders
    const [error, setError] = useState(null);   // State to hold any error messages

    // Function to fetch orders
    const fetchOrders = async () => {
      try {
          const response = await axios.get('http://localhost:3000/api/order'); // Correct URL without 's'
          setOrders(response.data); // Set the orders data in state
      } catch (err) {
          console.error('Error fetching orders:', err);
          if (err.response) {
              setError(err.response.data.message || 'An error occurred while fetching orders.');
          } else {
              setError('Network error. Please try again later.');
          }
      }
  };

    // Fetch orders when the component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Order Management</h2>
            <p className="mb-6">Manage your orders here.</p>
            {error && <p className="text-red-500">{error}</p>} {/* Display error messages */}
            <h3 className="text-xl font-semibold mb-4">Order List</h3>
            {orders.length > 0 ? (
                <ul className="space-y-4">
                    {orders.map((order) => (
                        <li key={order.id} className="border rounded-lg p-4 shadow">
                            <div className="mb-2">
                                <span className="font-medium">Order ID:</span> {order.id}, 
                                <span className="font-medium"> Total Price:</span> ${order.totalPrice.toFixed(2)}, 
                                <span className="font-medium"> Created At:</span> {new Date(order.createdAt).toLocaleString()}
                            </div>
                            <h4 className="font-semibold mb-2">Order Details:</h4>
                            <ul className="pl-4 border-l border-gray-300">
                                {JSON.parse(order.orderDetails).map((item, index) => (
                                    <li key={index} className="flex items-center mb-2">
                                        {item.image && (
                                            <img
                                                src={`http://localhost:3000/${item.image}`}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover mr-3"
                                            />
                                        )}
                                        <div className="flex-grow">
                                            <strong>{item.name}</strong> - Quantity: {item.quantity} - Price: ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4">No orders found.</p> // Message if no orders are found
            )}
        </div>
    );
};

export default OrderManagement;