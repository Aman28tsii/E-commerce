import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MostLooked from './components/MostLooked';
import MensClothing from './components/MenClothing';
import KidsClothing from './components/KidsClothing';
import FemalesClothing from './components/FemalesClothing';
import OGSection from './components/OGSection';
import Cart from './components/Cart';
import Login from './components/LoginSignup'; 
import Signup from './components/signup';
import { KidsDetail, MenDetail, FemalesDetail, MostLookedDetail, OGSectionDetail } from './data/Detail';
import './App.css';

const App = () => {
    const [cart, setCart] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [token, setToken] = useState(null); // State for authentication token

    const addToCart = (product) => {
        console.log("Adding product to cart:", product); // Debug
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            let newCart;

            if (existingProduct) {
                newCart = prevCart.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            } else {
                newCart = [...prevCart, { ...product, quantity: 1 }];
            }

            const newTotalValue = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalValue(newTotalValue);
            console.log("New cart:", newCart); // Debug
            return newCart;
        });

        alert(`${product.name} has been added to cart!`);
    };

    const resetCart = () => {
        setCart([]);
        setTotalValue(0);
    };

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path="/most-looked" element={<MostLooked products={MostLookedDetail} addToCart={addToCart} />} />
                    <Route path="/men" element={<MensClothing products={MenDetail} addToCart={addToCart} />} />
                    <Route path="/kids" element={<KidsClothing products={KidsDetail} addToCart={addToCart} />} />
                    <Route path="/females" element={<FemalesClothing products={FemalesDetail} addToCart={addToCart} />} />
                    <Route path="/og" element={<OGSection products={OGSectionDetail} addToCart={addToCart} />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/signup" element={<Signup setToken={setToken} />} />
                </Routes>
                <Cart cart={cart} totalValue={totalValue} token={token} setToken={setToken} resetCart={resetCart} />
            </div>
        </Router>
    );
};

export default App;