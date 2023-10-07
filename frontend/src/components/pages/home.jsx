import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/home.css";
import { Link } from "react-router-dom";

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Movies
    axios
      .get("http://localhost:8000/movies/")
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  }, []);

  return (  
    <div className="home-container">
      <h1>Welcome to Movie World</h1>

      <section>
        <div className="movie-list">
          <div className="scrolling-container">
            {movies.map((movie) => (
                <li key={movie.id}>
                  <Link to={`/movie/${movie.id}/`}>{movie.title}
                    <img src={movie.image} alt={movie.title} />
                  </Link>
                </li>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};