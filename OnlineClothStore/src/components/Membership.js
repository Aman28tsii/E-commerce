import React, { useState } from "react";
import axios from 'axios';

const Membership = () => {
    const [isLogin, setIsLogin] = useState(true); // Track if the user is viewing the login form
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // Used only for signup
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(""); // Only used for login
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/xxx/login', {
                username,
                password,
            });

            if (response.data.success) {
                setToken(response.data.token);
                setMessage("Login Successful!");
                // Optionally, redirect the user or perform other actions
            } else {
                setMessage("Incorrect username or password");
            }
        } catch (error) {
            console.error("An error occurred while logging in:", error);
            setMessage("An error occurred during login.");
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/xxx/signup', {
                username,
                email,
                password,
            });

            if (response.data.success) {
                setMessage("Registration Successful! Please log in.");
                setIsLogin(true); // Switch to login after successful signup
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("An error occurred while signing up:", error);
            setMessage("An error occurred during signup.");
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">{isLogin ? "Login" : "Signup"}</div>

            {!isLogin && (
                <input
                    type="text"
                    className="inputBox"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            )}
            <input
                type="text"
                className="inputBox"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                className="inputBox"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="inputButton" onClick={isLogin ? handleLogin : handleSignup}>
                {isLogin ? "Log In" : "Sign Up"}
            </button>

            <button className="toggleButton" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>

            {message && <p>{message}</p>} {/* Display messages for feedback */}
        </div>
    );
};

export default Membership;
