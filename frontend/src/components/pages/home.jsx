import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/home.css";
import { Link } from "react-router-dom";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moviesToShow, setMoviesToShow] = useState(9);
  const [visibleMovies, setVisibleMovies] = useState([]);

  useEffect(() => {
    // Fetch Movies
    axios
      .get("http://localhost:8000/api/v1/movies/")
      .then((res) => {
        setMovies(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Update the visible movies when moviesToShow changes
    setVisibleMovies(movies.slice(0, moviesToShow));
  }, [moviesToShow, movies])

  const loadMoreMovies = () => {
    // Increase the number of movies to show
    setMoviesToShow((prevCount) => prevCount + 9)
  }

  if (isLoading) {
    return (
      <div className="loading-spinner"> 
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="movie-world">Welcome to Movie World</h1>


      <section>
        <div className="movie-list">
          <div className="scrolling-container">
            {visibleMovies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <Link to={`/movie/${movie.slug}/`}>
                  <img src={movie.image} alt={movie.title} />
                </Link>
                <p className="movie-title">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {moviesToShow < movies.length && (
        <button className="show-more-button" onClick={loadMoreMovies}>
          Show More
        </button>
      )}
    </div>
  );
};