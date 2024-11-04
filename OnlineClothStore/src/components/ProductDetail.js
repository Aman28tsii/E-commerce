import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = ({ productId, addToCart }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/product/${productId}`);
                setProduct(response.data);
            } catch (err) {
                setError(err.message || 'Error fetching product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>No product data found.</div>;
    }

    // Ensure price is a number
    const price = Number(product.price);
    const formattedPrice = !isNaN(price) ? price.toFixed(2) : 'N/A';

    return (
        <div className="product-detail">
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>${formattedPrice}</p>
            <p>{product.description}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
    );
};

export default ProductDetail;