import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/movies.css';
import MovieList from './movieList';
import Pagination from './pagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const moviesPerPage = 9;

  useEffect(() => {
    axios
      .get('http://localhost:8000/movies/')
      .then((response) => {
        setMovies(response.data);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching movie data:', error);
        setIsLoading(false)
      });
  }, []);

  useEffect(() => {
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredMovies);
  }, [searchQuery, movies]);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = Math.min(startIndex + moviesPerPage, searchResults.length);
  const currentMovies = searchResults.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: Math.ceil(searchResults.length / moviesPerPage) }, (_, i) => i + 1);


  if (isLoading) {
    return (
      <div className="loading-spinner"> 
        <LoadingSpinner />
      </div>
    );
  }

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

      <MovieList movies={currentMovies} searchQuery={searchQuery} />
      <Pagination pageNumbers={pageNumbers} currentPage={currentPage} goToPage={goToPage} />

    </div>
  );
};