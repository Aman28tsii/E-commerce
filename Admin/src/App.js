import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminSignup from './components/AdminSignup';
import NavBar from './components/Navbar';
import OrderManagement from './components/OrderManagement';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';

const App = () => {
    const [token, setToken] = useState('');
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

    // If the user is authenticated, show the main application
    if (token) {
        return (
            <Router>
                <div className="App">
                    <h1 className="text-3xl font-bold text-center my-6">Admin Panel</h1>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Navigate to="/order-management" />} />
                        <Route path="/order-management" element={<OrderManagement />} />
                        <Route path="/product-management" element={<ProductManagement />} />
                        <Route path="/user-management" element={<UserManagement />} />
                    </Routes>
                </div>
            </Router>
        );
    }

    // If user is not authenticated, show Login and Signup forms with toggle button
    return (
        <Router>
            <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Admin Panel - Please Log In or Sign Up</h1>
                <div className="flex space-x-4 mb-4">
                    <button 
                        onClick={() => setIsLogin(true)} 
                        className={`py-2 px-4 rounded ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => setIsLogin(false)} 
                        className={`py-2 px-4 rounded ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                        Signup
                    </button>
                </div>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            isLogin ? (
                                <AdminLogin setToken={setToken} />
                            ) : (
                                <AdminSignup />
                            )
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;