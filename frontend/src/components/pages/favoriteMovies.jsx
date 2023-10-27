import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

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

  const removeFavoriteMovie = async (movieSlug) => {
    try {
      await axios.delete("http://localhost:8000/api/v1/favorite-movies/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: {
          movie_slug: movieSlug,
        },
      });

      // Remove the deleted movie from the list
      setFavoriteMovies(favoriteMovies.filter(movie => movie.movie.slug !== movieSlug));
    } catch (error) {
      console.error(`Error removing favorite movie: ${error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <LoadingSpinner />
      </div>
    );
  }

  if (favoriteMovies.length === 0) {
    return <div className="no-movie-container">No favorite movies found.</div>;
  } else {
    return (
      <div>
        <h2>Favorite Movies</h2>
        <ul>
          {favoriteMovies.map((favoriteMovie, index) => (
            <li key={index}>
              {favoriteMovie.movie.title}
              <button onClick={() => removeFavoriteMovie(favoriteMovie.movie.slug)}>
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default FavoriteMovies;