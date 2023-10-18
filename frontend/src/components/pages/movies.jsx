import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/movies.css'
import { Link } from 'react-router-dom';

export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSeachResults] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/movies/')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movie data:', error);
      });
  }, []);


  useEffect(() => {
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSeachResults(filteredMovies);
  }, [searchQuery, movies])

  return (
    <div className="movies-container">
      <h1 className="movies">Movie List</h1>
  
      <input
        type="text"
        placeholder="Search by movie title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
  
      <ul className={`movie-list ${searchQuery ? 'list-with-animation' : ''}`}>
        {searchResults.map((movie) => (
          <li key={movie.id} className={`movie-card ${searchQuery ? 'visible' : ''}`}>
            <div className="movie-image-container">
              <Link to={`/movie/${movie.slug}/`}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="movie-image"
                />
              </Link>
            </div>
            <div className="movie-details">
              <h2 className="movie-title">{movie.title}</h2>
              <p className="movie-info">Categories: {movie.categories.map(category => category.name).join(', ')}</p>
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