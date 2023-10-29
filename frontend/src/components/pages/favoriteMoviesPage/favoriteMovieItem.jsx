import React from "react";
import axios from "axios";
import PropTypes from 'prop-types'

import { Link } from "react-router-dom";


const FavoriteMovieItem = ({ movie, onRemoveFavoriteMovie }) => {
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
            onRemoveFavoriteMovie(movieSlug) // Notify the parent component to remove the movie
        } catch(error) {
            console.error(`Error removing favorite movie: ${error}`)
        }
    }

    return (
        <li className="bg-white flex flex-col p-4 rounded-md w-full h-auto shadow-md">
          <Link to={`/movie/${movie.movie.slug}/`}>
            <div className="movie-image-container">
              <img
                src={`http://localhost:8000${movie.movie.image}`}
                alt={movie.movie.title}
                className="object-cover h-40 w-full"
              />
            </div>
          </Link>
          <div className="movie-details">
            <h3 className="text-gray-700 text-lg mt-2 font-semibold hover:text-red-500">
              {movie.movie.title}
            </h3>
            <p className="text-gray-700 text-sm mt-2">
              {movie.movie.description}
            </p>
            <button
              onClick={() => removeFavoriteMovie(movie.movie.slug)}
              className="bg-red-500 text-white rounded px-2 py-1 cursor-pointer mt-2"
            >
              Remove from Favorites
            </button>
          </div>
        </li>
      );
}


FavoriteMovieItem.propTypes = {
    movie: PropTypes.object.isRequired,
    onRemoveFavoriteMovie: PropTypes.func.isRequired,
}

export default FavoriteMovieItem;