import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details
        const response = await Axios.get(`http://localhost:8000/movie/${id}`);
        setMovie(response.data);

        // Fetch movie rating
        const ratingResponse = await Axios.get(`http://localhost:8000/ratings/?movie=${id}`)
        if (ratingResponse.data.length > 0){
          // Find the rating for the current movie in the response
          const movieRating = ratingResponse.data.find(rating => rating.movie.id === parseInt(id))
          if (movieRating) {
            setRating(movieRating.rating)
          } else {
            setRating('N/A')
          }
        } else {
          setRating('N/A')
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <div></div>;
    }

  return (
    <div className="movie-details-container">
      <p>Category: {movie.categories.map(category => category.name).join(', ')}</p>
      <p>Release Date: {movie.release_date}</p>
      <p>Director: {movie.director}</p>
      <p>Actors: {movie.actors}</p>
      <p>Rating: {rating}</p>
      <img
        src={movie.image}
        alt={movie.title}
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
};

export default MovieDetails;