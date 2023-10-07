import React, { useState, useEffect } from 'react';
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
      <h1>Movie List</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <h2>{movie.title}</h2>
            <p>Category: {movie.category && movie.category.name}</p>
            <p>Release Date: {movie.release_date}</p>
            <p>Director: {movie.director}</p>
            <p>Actors: {movie.actors}</p>
            <img
              src={movie.image}
              alt={movie.title}
              style={{ maxWidth: "100%" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};