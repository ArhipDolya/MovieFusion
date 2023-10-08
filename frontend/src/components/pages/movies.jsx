import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/movies.css'

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
    <div className="movies-container">
      <h1 className='movies'>Movie List</h1>
      <ul className="movie-list">
        {movies.map(movie => (
          <li key={movie.id} className="movie-card">
            <div className="movie-image-container">
              <img
                src={movie.image}
                alt={movie.title}
                className="movie-image"
              />
            </div>
            <div className="movie-details">
              <h2 className="movie-title">{movie.title}</h2>
              <p className="movie-info">Category: {movie.category && movie.category.name}</p>
              <p className="movie-info">Release Date: {movie.release_date}</p>
              <p className="movie-info">Director: {movie.director}</p>
              <p className="movie-info">Actors: {movie.actors}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

};