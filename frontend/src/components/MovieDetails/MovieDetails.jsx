import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import MovieRating from './MovieRating';

import './MovieDetails.css';

const MovieDetails = () => {
  // Get the movie ID from the URL using useParams hook
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/movie/${id}`);
        
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    // Trigger the fetchMovieDetails function
    fetchMovieDetails();
  }, [id]); // Only re-fetch when ID changes

  // Conditionally render based on movie state
  if (!movie) {
    return <div></div>; // Show placeholder until movie data is fetched
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
        <MovieRating movieSlug={movie.slug} />

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