
import React, { useState } from 'react';
import StarRating from './components/StarRating';

const star = () => {
    const [rating, setRating] = useState(0);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(`New rating selected: ${newRating}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Rate this Product</h1>
            <StarRating 
                totalStars={5} 
                initialRating={rating} 
                onRatingChange={handleRatingChange} 
            />
            <p>Your Rating: {rating}</p>
        </div>
    );
};

export default star;