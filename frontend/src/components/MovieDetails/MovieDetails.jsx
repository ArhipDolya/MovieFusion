import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

import './MovieDetails.css';

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
        const ratingResponse = await Axios.get(`http://localhost:8000/ratings/`);
        if (ratingResponse.data.length > 0) {
          // Find the rating for the current movie based on the movie's slug
          const movieRating = ratingResponse.data.find(rating => rating.movie.slug === response.data.slug);
          if (movieRating) {
            setRating(movieRating.rating);
          } else {
            setRating('N/A');
          }
        } else {
          setRating('N/A');
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
      <h1 className="movie-details-h1">{movie.title}</h1>
      <img className="movie-details-img" src={movie.image} alt={movie.title} />
      <div className="movie-details">
        <h3 className="movie-details-heading">Category:</h3>
        <p className="movie-details-info">{movie.categories.map(category => category.name).join(', ')}</p>

        <h3 className="movie-details-heading">Release Date:</h3>
        <p className="movie-details-info">{movie.release_date}</p>

        <h3 className="movie-details-heading">Director:</h3>
        <p className="movie-details-info">{movie.director}</p>

        <h3 className="movie-details-heading">Actors:</h3>
        <p className="movie-details-info">{movie.actors}</p>

        <h3 className="movie-details-heading">Rating:</h3>
        <p className="movie-details-info">{rating}</p>

        {movie.youtube_trailer_url && (
          <div className="movie-trailer-container">
            <iframe
              width="515"
              height="300"
              className="movie-trailer-iframe"
              src={movie.youtube_trailer_url}
              allowFullScreen
              title={movie.title}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;