import React, { useEffect, useState } from 'react';

const starRating = () => {
    // User Rating: This could be fetched from a database
    const userRating = 4; // Example static value representing user ratings from others

    // Your rating: The star rating set by the current user
    const [yourRating, setYourRating] = useState(0); // Initialize to zero or the user's previous rating

    const handleRatingChange = (newRating) => {
        setYourRating(newRating);
        console.log(`Your rating selected: ${newRating}`);
    };

    const StarRating = ({ totalStars = 5, initialRating }) => {
        const [rating, setRating] = useState(initialRating);

        // Update local rating based on yourRating changes
        useEffect(() => {
            setRating(yourRating);
        }, [yourRating]);

        const handleClick = (newRating) => {
            setRating(newRating);
            handleRatingChange(newRating);
        };

        return (
            <div style={{ display: 'flex', cursor: 'pointer' }}>
                {[...Array(totalStars)].map((_, index) => {
                    const starRating = index + 1;
                    return (
                        <span 
                            key={starRating}
                            onClick={() => handleClick(starRating)}
                            style={{
                                fontSize: '30px',
                                // Color stars based on rating and initial user rating
                                color: starRating <= (rating || initialRating) ? '#FFD700' : '#ccc',
                                padding: '4px',
                                transition: 'color 0.3s ease',
                            }}
                        >
                            ★
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Rate this Product</h1>
            <h2>User Rating: {userRating} Stars</h2>
            <StarRating 
                totalStars={5} 
                initialRating={userRating} // The average rating (coming from database or static)
            />
            <p>Your Rating: {yourRating}</p>
        </div>
    );
};

export default starRating;