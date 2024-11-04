import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="list-none flex justify-between">
                <li className="mx-4">
                    <Link to="/order-management" className="text-white text-lg hover:text-blue-400">
                        Order Management
                    </Link>
                </li>
                <li className="mx-4">
                    <Link to="/product-management" className="text-white text-lg hover:text-blue-400">
                        Product Management
                    </Link>
                </li>
                <li className="mx-4">
                    <Link to="/user-management" className="text-white text-lg hover:text-blue-400">
                        User Management
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;