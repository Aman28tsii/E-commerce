import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KidsClothing = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const category = 'Kid';

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

    const handleDetailsClick = (product) => {
        setSelectedProduct(product);
    };

    const handleBackClick = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{category} Clothing</h1>
            {selectedProduct ? (
                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
                    {selectedProduct.image && (
                        <img
                            src={`http://localhost:3000/${selectedProduct.image}`}
                            alt={selectedProduct.name}
                            className="w-56 h-70 object-cover mb-4 rounded"
                        />
                    )}
                    <strong className="text-lg mb-2">{selectedProduct.name}</strong>
                    <span className="text-gray-700 mb-4">Price: ${selectedProduct.price}</span>
                    <p className="text-gray-800 mb-4">{selectedProduct.description}</p>
                    
                    {/* Flex container for buttons */}
                    <div className="flex space-x-4 mt-4">
                        <button 
                            onClick={() => addToCart(selectedProduct)} 
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                        >
                            🛒 Add to Cart
                        </button>
                        <button 
                            onClick={handleBackClick} 
                            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div 
                                key={product.id} 
                                className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transform transition-transform duration-200 hover:bg-orange-300 hover:text-white hover:scale-105"
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
                                    onClick={() => handleDetailsClick(product)} 
                                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
                                >
                                    Details
                                </button>
                                <button 
                                    onClick={() => addToCart(product)} 
                                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                                >
                                    🛒 Add to Cart
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No products found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default KidsClothing;