import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await Axios.get(`http://localhost:8000/movie/${id}`);
        setMovie(response.data);
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
        <p>Category: {movie.category && movie.category.name}</p>
        <p>Release Date: {movie.release_date}</p>
        <p>Director: {movie.director}</p>
        <p>Actors: {movie.actors}</p>
        <img
          src={movie.image}
          alt={movie.title}
          style={{ maxWidth: "100%" }}
        />
    </div>
  );
};

export default MovieDetails;