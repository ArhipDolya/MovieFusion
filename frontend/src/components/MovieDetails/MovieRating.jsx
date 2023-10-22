import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieRating = ({ movieSlug }) => {
  const [rating, setRating] = useState('N/A');

  useEffect(() => {
    // Fetch the movie rating when the movieSlug prop changes
    const fetchRating = async () => {
      try {
        const ratingResponse = await axios.get(`http://localhost:8000/api/v1/ratings/`);

        // Check if there are any ratings
        if (ratingResponse.data.length > 0) {
          // Find the rating for the current movie based on the movieSlug
          const movieRating = ratingResponse.data.find(rating => rating.movie.slug === movieSlug);

          // If a matching rating is found, update the rating state
          if (movieRating) {
            setRating(movieRating.rating);
          }
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    fetchRating();
  }, [movieSlug]); // Only re-fetch when movieSlug changes

  return (
    <p className="movie-details-info">{rating}</p> // Render the movie rating
  );
};

export default MovieRating;