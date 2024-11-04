import React, { useState, useEffect } from 'react';
import axios from 'axios';

const  MostLooked = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const category = 'MostLooked';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/products', {
                params: { category }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{category} Clothing</h1>
            <div className=" w-75 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div 
                            key={product.id} 
                            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transform transition-transform duration-200 hover:bg-orange-300 hover:text-white hover:scale-105" // Added scale effect
                        >
                            {product.image && (
                                <img
                                    src={`http://localhost:3000/${product.image}`} 
                                    alt={product.name} 
                                    className="w-56 h-70 object-cover mb-4 rounded"
                                />
                            )}
                            <strong className="text-lg mb-2">{product.name}</strong>
                            <span className="text-gray-700 mb-4">Price: ${product.price}</span>
                            <button 
                                onClick={() => addToCart(product)} 
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                            >
                                 🛒Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
         
        </div>
    );
};

export default  MostLooked;