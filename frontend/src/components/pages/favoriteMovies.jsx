import React, { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import 'tailwindcss/tailwind.css';
import { Link } from "react-router-dom";
import { deleteFavoriteMovie, fetchFavoriteMovies } from "../../api/moviesApi/movies";
import { getAccessToken } from "../../api/authApi/get_access_token";


const baseImageUrl = "http://localhost:8000";


const FavoriteMovies = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteMoviesAsync = async () => {
      const accessToken = getAccessToken();
      const favoriteMovies = await fetchFavoriteMovies(accessToken);
      setFavoriteMovies(favoriteMovies);
      setIsLoading(false);
    };
  
    fetchFavoriteMoviesAsync();
  }, [getAccessToken()]);

  const removeFavoriteMovie = async (movieSlug) => {
    const accessToken = getAccessToken();
    await deleteFavoriteMovie(accessToken, movieSlug);
  
    // Remove the deleted movie from the list
    setFavoriteMovies(favoriteMovies.filter(movie => movie.movie.slug !== movieSlug));
  };

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-semibold text-white text-center custom-background p-3" style={{marginTop: '-20px', backgroundColor: '#333333'}}>
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
          {favoriteMovies.map((favoriteMovie, index) => (
            <li key={index} className="bg-white flex flex-col p-4 rounded-md w-full h-auto shadow-md">
              <Link to={`/movie/${favoriteMovie.movie.slug}/`}>
              <div className="movie-image-container">
                  <img
                    src={`${baseImageUrl}${favoriteMovie.movie.image}`}
                    alt={favoriteMovie.movie.title}
                    className="object-cover h-40 w-full"
                  />
              </div>
              </Link>
              <div className="movie-details">
              <h3 className="text-gray-700 text-lg mt-2 font-semibold hover:text-red-500">
                {favoriteMovie.movie.title}
              </h3>
                <p className="text-gray-700 text-sm mt-2">
                  {favoriteMovie.movie.description}
                </p>
                <button
                  onClick={() => removeFavoriteMovie(favoriteMovie.movie.slug)}
                  className="bg-red-500 text-white rounded px-2 py-1 cursor-pointer mt-2"
                >
                  Remove from Favorites
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteMovies;