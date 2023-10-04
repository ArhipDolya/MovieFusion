import React, { useState, useEffect } from 'react';
import MovieDetails from '../MovieDetails/MovieDetails';
import axios from 'axios';


export const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/movies/')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movie data:', error);
      });
  }, []);

  return (
    <div>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <MovieDetails movie={movie} />
          </li>
        ))}
      </ul>
    </div>
  );
};