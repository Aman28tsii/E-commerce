import React from 'react';

const ProductCard = ({ product, addToCart }) => {
  
  const addToCart = (product) => {
    setCart((prevCart) => {
        const existingProduct = prevCart.find(item => item.id === product.id);

        let newCart;
        if (existingProduct) {
            // If the product already exists, increase the quantity
            newCart = prevCart.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            );
        } else {
            // If the product does not exist, add it with quantity 1
            newCart = [...prevCart, { ...product, quantity: 1 }];
        }

        return newCart; // Make sure to return the new cart array
    });
};
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
