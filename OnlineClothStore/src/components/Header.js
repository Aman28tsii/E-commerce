import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, logout }) => {
  return (
    <header>
      <h1>Closet Store</h1>
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/cart">Cart</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;