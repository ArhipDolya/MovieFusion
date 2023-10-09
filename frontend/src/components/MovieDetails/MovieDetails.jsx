import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details
        const response = await Axios.get(`http://localhost:8000/movie/${id}`);
        setMovie(response.data);

        // Fetch movie rating
        const ratingResponse = await axios.get(`http://localhost:8000/ratings/?movie=${id}`)
        if (ratingResponse.data.length > 0){
          setRating(ratingResponse.data[0].rating)
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <div></div>;
    }

  return (
    <div className="movie-details-container">
        <p>Category: {movie.categories.map(category => category.name).join(', ')}</p>
        <p>Release Date: {movie.release_date}</p>
        <p>Director: {movie.director}</p>
        <p>Actors: {movie.actors}</p>
        <p>Rating: {rating ? rating : 'N/A'}</p>
        <img
          src={movie.image}
          alt={movie.title}
          style={{ maxWidth: "100%" }}
        />
    </div>
  );
};

export default MovieDetails;