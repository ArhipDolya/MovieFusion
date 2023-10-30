import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import './MovieDetails.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import { Rating } from 'react-simple-star-rating';


const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/movies/${id}`);
        const movieData = response.data;
        setMovie(movieData);
        setIsLoading(false);

        const storedRating = localStorage.getItem(`movieRating_${id}`)
        console.log("Stored rating from localStorage:", storedRating);

        if (storedRating !== null) {
          setRating(Number(storedRating));
          console.log("Setting rating from localStorage:", Number(storedRating));
        } else {
          setRating(0);
          console.log("Setting rating to 0");
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setIsLoading(false);
      }
      fetchAverageRating();
    };

    fetchMovieDetails();
  }, [id]);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/movies/${id}/average-ratings/`);
      setAverageRating(response.data.average_rating)
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="loading-spinner"> 
        <LoadingSpinner />
      </div>
    );
  } else if (!movie) {
    return (
      <div className="no-movie-container">
        There is no movie
      </div>);
  }

  const handleAddToFavorites = async () => {
    try {
      const storedAccessToken = localStorage.getItem('access_token');
      if (storedAccessToken) {
        const config = {
          headers: {
            Authorization: `Bearer ${storedAccessToken}`,
          },
        };
        await axios.post(`http://localhost:8000/api/v1/favorite-movies/`, { movie_slug: movie.slug }, config);
        setIsFavorite(true);
      } else {
        // Redirect to the login page
        navigate('/authentication');
      }
    } catch (error) {
      console.error('Error adding movie to favorites:', error);
    }
  };

  const handleRatingChange = async (newRating) => {
  try {
      const ratingValue = newRating.toString(); // Convert rating to a string
      const storedAccessToken = localStorage.getItem('access_token');

      const headers = {
        Authorization: `Bearer ${storedAccessToken}`,
      }

      setRating(newRating)

      localStorage.setItem(`movieRating_${id}`, ratingValue)

      const response = await axios.post('http://localhost:8000/api/v1/ratings/', {
        movie: movie.slug,
        rating: ratingValue,
      }, { headers });

      console.log('Rating sent to the backend:', response.data);
    } catch (error) {
      console.error('Error sending rating to the backend:', error);
    }
  };


  const tooltipArray = [
    "Terrible",
    "Terrible+",
    "Bad",
    "Bad+",
    "Average",
    "Average+",
    "Great",
    "Great+",
    "Awesome",
    "Awesome+"
  ];

  const fillColorArray = [
    "#f17a45",
    "#f17a45",
    "#f19745",
    "#f19745",
    "#f1a545",
    "#f1a545",
    "#f1b345",
    "#f1b345",
    "#f1d045",
    "#f1d045"
  ];

  return (
    <div className="movie-details-container">
      <h1 className="movie-details-h1">{movie.title}</h1>
      <img className="movie-details-img" src={movie.image} alt={movie.title} />
      <div className="movie-details">
        <h3 className="movie-details-heading">Category:</h3>
        <p className="movie-details-info">{movie.categories.map(category => category.name).join(', ')}</p>

        <h3 className="movie-details-heading">Release Date:</h3>
        <p className="movie-details-info">{movie.release_date}</p>

        <h3 className="movie-details-heading">Director:</h3>
        <p className="movie-details-info">{movie.director}</p>

        <h3 className="movie-details-heading">Actors:</h3>
        <p className="movie-details-info">{movie.actors}</p>

        <div className="rating">
          <div className="average-rating">
            <h3 className="movie-details-heading">Average Rating: {averageRating}</h3>
          </div>
          
          <Rating
            initialValue={rating}
            onClick={handleRatingChange}
            size={50}
            transition
            allowFraction
            showTooltip
            tooltipArray={tooltipArray}
            fillColorArray={fillColorArray}
            SVGstyle={{ 'display': 'inline' }}
          />
        </div>

        <button
          onClick={handleAddToFavorites}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
          Add to Favorites 
        </button>

        {movie.youtube_trailer_url && (
          <div className="movie-trailer-container">
            <iframe
              width="515"
              height="300"
              className="movie-trailer-iframe"
              src={movie.youtube_trailer_url}
              allowFullScreen
              title={movie.title}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;