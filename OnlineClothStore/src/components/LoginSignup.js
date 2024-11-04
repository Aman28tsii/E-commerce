import React, { useState } from 'react';
import axios from 'axios';

const LoginSignup = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validatePassword = (password) => {
        if (!password) {
            return 'Password cannot be empty.';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters long.';
        }
        return '';
    };

    const handleLogin = async () => {
        const passwordError = validatePassword(password);
        if (passwordError) {
            setErrorMessage(passwordError);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                username,
                password
            });
            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.token);
            onSuccess(); // Notify the Cart component of success
        } catch (error) {
            console.error('Authentication failed:', error.response ? error.response.data.message : error.message);
            setErrorMessage(error.response?.data.message || 'Authentication failed. Please try again.');
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/signup', {
                username,
                email,
                password
            });
            
            console.log('Signup successful:', response.data);
            setSuccessMessage('User created successfully! You can now log in.');
            setErrorMessage('');
        } catch (error) {
            console.error('Signup failed:', error.message);
            
            const message = error.response?.data?.message || 'Signup failed. Please try again.';
            setErrorMessage(message);
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setUsername('');
        setEmail('');
        setPassword('');
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div className="container mx-auto p-6 max-w-md bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">{isLoginMode ? 'Login' : 'Sign Up'}</h2>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />
            {!isLoginMode && (
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
            )}
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />
            {isLoginMode ? (
                <button 
                    className="buttonForSignup bg-blue-600 text-white rounded-lg p-2 w-full hover:bg-blue-700 transition"
                    onClick={handleLogin}
                >
                    Login
                </button>
            ) : (
                <button 
                    className="buttonForSignup bg-blue-600 text-white rounded-lg p-2 w-full hover:bg-blue-700 transition"
                    onClick={handleSignup}
                >
                    Sign Up
                </button>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <button 
                className="buttonForSignup bg-gray-300 text-gray-800 rounded-lg p-2 w-full hover:bg-gray-400 transition mt-4"
                onClick={toggleMode}
            >
                {isLoginMode ? 'Switch to Sign Up' : 'Switch to Login'}
            </button>
        </div>
    );
}

export default LoginSignup;