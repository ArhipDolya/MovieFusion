import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './css/categories.css'
import { getMovies } from '../../api/moviesApi/movies';
import { getCategories } from '../../api/categoriesApi/categoriesApi';


export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch categories from API on component mount
    getCategories()
      .then(response => {
        setCategories(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setIsLoading(false)
      });

    // Fetch movies from API on component mount
    getMovies()
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []); // Empty dependency array, runs only on mount

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Filter movies based on selected category
  const filteredMovies = movies.filter((movie) => {
    if (!selectedCategory) {
      return []; // Return empty array if no category selected
    }

    return movie.categories.some((category) => category.id === selectedCategory.id); // Filter movies by category ID
  });

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }

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