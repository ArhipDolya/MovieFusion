import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

import 'tailwindcss/tailwind.css';

import FavoriteMovieItem from "./favoriteMovieItem";


const FavoriteMovies = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/favorite-movies/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setFavoriteMovies(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(`Error fetching favorite movies: ${error}`);
        setIsLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [localStorage.getItem("access_token")]);

  const removeFavoriteMovie = (movieSlug) => {
    setFavoriteMovies(favoriteMovies.filter(movie => movie.movie.slug !== movieSlug));
  }

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-semibold text-white text-center custom-background p-3" style={{ marginTop: '-20px', backgroundColor: '#333333' }}>
        Favorite Movies
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      ) : favoriteMovies.length === 0 ? (
        <div className="text-center text-gray-500 text-2xl mt-5">No favorite movies found.</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteMovies.map((favoriteMovie) => (
            <FavoriteMovieItem
              key={favoriteMovie.movie.id}
              movie={favoriteMovie}
              onRemoveFavorite={removeFavoriteMovie}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteMovies;
