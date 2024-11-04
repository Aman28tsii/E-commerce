import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManagement.css'; // Import CSS styles

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const categories = ['Female', 'Kid', 'Man', 'Traditional', 'MostLooked'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/products'); // Changed to port 3000
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('http://localhost:3000/api/products', formData, { // Changed to port 3000
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchProducts(); // Refresh product list after adding
            resetForm(); // Clear form inputs
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/products/${id}`); // Changed to port 3000
            fetchProducts(); // Refresh product list after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setDescription('');
        setImage(null);
        setCategory('');
    };

    // Grouping products by categories
    const groupedProducts = products.reduce((acc, product) => {
        const cat = product.category || 'Uncategorized'; // Default category if none
        if (!acc[cat]) {
            acc[cat] = [];
        }
        acc[cat].push(product);
        return acc;
    }, {});

    return (
        <div className="product-management">
            <h1>Admin Dashboard</h1>
            {Object.keys(groupedProducts).map(category => (
                <div key={category} className="category-container">
                    <h2>{category}</h2>
                    <div className="flex-container">
                        {groupedProducts[category].map(product => (
                            <div key={product.id} className="product-card">
                                <strong>{product.name}</strong><br />
                                <span>Price: ${product.price}</span><br />
                                {product.image && (
                                    <img src={`http://localhost:3000/${product.image}`} alt={product.name} width="100" /> // Changed to port 3000
                                )}
                                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
                <input
                    type="text"
                    value={name}
                    placeholder="Product Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="number"
                    value={price}
                    placeholder="Product Price"
                    onChange={(e) => setPrice(e.target.value)}
                />
                <textarea
                    value={description}
                    placeholder="Product Description"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default ProductManagement;