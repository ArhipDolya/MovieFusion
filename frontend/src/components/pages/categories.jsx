import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './css/categories.css'


export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/categories/')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    axios.get('http://localhost:8000/movies/')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredMovies = movies.filter((movie) => {
    if (!selectedCategory) {
        return [];
    }

    return movie.categories.some((category) => category.id === selectedCategory.id);
  });

  return (
    <div>
      <h2 className="custom-header">Categories</h2>
      <ul className="custom-list">
        {categories.map((category) => (
          <li key={category.id}>
            <button className="custom-button" onClick={() => handleCategoryClick(category)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
  
      {selectedCategory ? (
        <ul className="custom-movie-list">
          {filteredMovies.map((movie) => (
            <li key={movie.id} className="custom-movie-card">
              <div className="custom-movie-image-container">
                <Link to={`/movie/${movie.slug}/`}>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="custom-movie-image"
                  />
                </Link>
              </div>
              <div className="custom-movie-details">
                <h2 className="custom-movie-title">{movie.title}</h2>
                <p className="custom-movie-info">Categories: {movie.categories.map(category => category.name).join(', ')}</p>
                <p className="custom-movie-info">Release Date: {movie.release_date}</p>
                <p className="custom-movie-info">Director: {movie.director}</p>
                <p className="custom-movie-info">Actors: {movie.actors}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="custom-message">Select a category to see movies</p>
      )}
    </div>
  );
};