import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar" >
            <h2>Shop Online</h2>
            <ul ul id="navbar">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/most-looked">Most Looked Items</Link></li>
                <li><Link to="/og">Traditional cloth</Link></li>
                <li><Link to="/men">Men's</Link></li>
                <li><Link to="/kids">Kid's</Link></li>
                <li><Link to="/females">Female</Link></li>
              
                <li><Link to="/cart">Cart</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;