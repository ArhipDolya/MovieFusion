import React from "react";
import { Link } from "react-router-dom";

const MovieList = ({ movies, searchQuery }) => {
  return (
    <ul className={`movie-list ${searchQuery ? 'list-with-animation' : ''}`}>
      {movies.map((movie) => (
        <li key={movie.id} className={`movie-card ${searchQuery ? 'visible' : ''}`}>
          <div className="movie-image-container">
            <Link to={`/movie/${movie.slug}/`}>
              <img src={movie.image} alt={movie.title} className="movie-image" />
            </Link>
          </div>
          <div className="movie-details">
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-info">Categories: {movie.categories.map((category) => category.name).join(', ')}</p>
            <p className="movie-info">Release Date: {movie.release_date}</p>
            <p className="movie-info">Director: {movie.director}</p>
            <p className="movie-info">Actors: {movie.actors}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieList;