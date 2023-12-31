import React, { useState, useEffect } from 'react';
import MovieList from './movieList';
import Pagination from './pagination';
import { getMovies } from '../api/moviesApi/movies';

import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

import './css/movies.css';


export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const moviesPerPage = 9;


  useEffect(() => {
    getMovies()
      .then((response) => {
        setMovies(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie data:', error);
        setIsLoading(false);
      });
  }, []); // Empty dependency array to run the effect only once

  // useEffect hook to filter movies based on search query
  useEffect(() => {
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredMovies); // Update filtered results state
  }, [searchQuery, movies]); // Dependencies: searchQuery and movies

  // Function to handle page change
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber); // Update current page state
  };

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = Math.min(startIndex + moviesPerPage, searchResults.length);

  // Slice the filtered results to get the movies for the current page
  const currentMovies = searchResults.slice(startIndex, endIndex);

  // Generate an array of page numbers
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
      <h1 className="text-3xl font-semibold text-white text-center custom-background p-3 mt-0 -mb-1" style={{backgroundColor: '#333333'}}>
        Movie List
      </h1>
      
      <input
        type="text"
        placeholder="Search by movie title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar mt-3 mb-5 p-2 border border-gray-300 rounded-md text-sm"  
      />

      <MovieList movies={currentMovies} searchQuery={searchQuery} />
      <Pagination pageNumbers={pageNumbers} currentPage={currentPage} goToPage={goToPage} />
    </div>
  );
};