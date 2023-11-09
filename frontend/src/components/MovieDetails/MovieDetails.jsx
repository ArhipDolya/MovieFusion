import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSubmit } from 'react-router-dom';

import './MovieDetails.css';
import { Rating } from 'react-simple-star-rating';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import apiConfig from '../../utils/apiConfig';
import { getMovieDetails, addToFavorites } from '../../api/MovieDetailsApi/movies';
import { addRating, getAverageRating } from '../../api/MovieDetailsApi/rating';

import { jwtDecode } from "jwt-decode";
import { deleteComment, getComments, createComment } from '../../api/MovieDetailsApi/comments';
import { likeComment, unlikeComment } from '../../api/MovieDetailsApi/likes';

import Comment from './comment/comment';


const tooltipArray = ["Terrible", "Terrible+", "Bad", "Bad+", "Average", "Average+", "Great", "Great+", "Awesome", "Awesome+"];
const fillColorArray = ["#f17a45", "#f17a45", "#f19745", "#f19745", "#f1a545", "#f1a545", "#f1b345", "#f1b345", "#f1d045", "#f1d045"];


const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [commentLikes, setCommentLikes] = useState({});

  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await getMovieDetails(id)
        const movieData = response.data;
        setMovie(movieData);

        const commentsResponse = await fetchCommentsForMovie(id);
        setComments(commentsResponse);

        setIsLoading(false);

        const storedRating = localStorage.getItem(`movieRating_${id}`)

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
      const response = await getAverageRating(id);
      setAverageRating(response.data.average_rating)
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  }

  const handleAddToFavorites = async () => {
    try {
      const storedAccessToken = localStorage.getItem('access_token');
      if (storedAccessToken) {
        const headers = apiConfig.createHeaders(storedAccessToken);
        await addToFavorites(movie.slug, headers);
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
        const ratingValue = newRating.toString();
        const storedAccessToken = localStorage.getItem('access_token');
        const headers = apiConfig.createHeaders(storedAccessToken)

        setRating(newRating)

        localStorage.setItem(`movieRating_${id}`, ratingValue)

        const response = await addRating(movie.slug, ratingValue, headers);

        console.log('Rating sent to the backend:', response.data);
      } catch (error) {
        console.error('Error sending rating to the backend:', error);
        if (error.response && error.response.status === 401) {
          navigate('/authentication')
        }
      }
  };

  const fetchCommentsForMovie = async (movieId) => {
    try {
      const response = await getComments(movieId)
      const commentsData = response.data

      const initialCommentLikes = {};
      commentsData.forEach((comment) => {
        initialCommentLikes[comment.id] = comment.likes;
      })

      setCommentLikes(initialCommentLikes)

      return commentsData;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreateComment = async () => {
    try {
      const storedAccessToken = localStorage.getItem('access_token')
      if (storedAccessToken) {       
        const decodedToken = jwtDecode(storedAccessToken)

        const userComment = {
          author: decodedToken.user_id,
          movie: movie.slug,
          text: newComment
        }

        const updatedComments = [...comments, userComment]
        setComments(updatedComments)

        const response = await createComment(storedAccessToken, userComment)

        console.log('Comment created:', response.data);
        setNewComment('');
      } else {
        navigate('/authentication')
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } 
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      
      // Update the comments state by filtering out the deleted comment
      const updatedComments = comments.filter((comment) => comment.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  const handleToggleLike = async (commentId) => {
    try {
      const storedAccessToken = localStorage.getItem('access_token');
      if (storedAccessToken) {
        if (commentLikes[commentId]) {
          // Unlike the comment
          const response = await unlikeComment(commentId, storedAccessToken);
          if (response.data.message === 'Comment unliked successfully') {
            setCommentLikes((prevLikes) => ({
              ...prevLikes,
              [commentId]: prevLikes[commentId] - 1,
            }));
          }
        } else {
          // Like the comment
          const response = await likeComment(commentId, storedAccessToken);
          if (response.data.message === 'Comment liked successfully') {
            setCommentLikes((prevLikes) => ({
              ...prevLikes,
              [commentId]: (prevLikes[commentId] || 0) + 1,
            }));
          }
        }
        // Reload the page to reflect the updated likes
        window.location.reload();
      } else {
        navigate('/authentication');
      }
    } catch (error) {
      console.error('Error liking/unliking comment:', error);
    }
  };
  
  

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
        <p className="movie-details-info mb-4">{movie.actors}</p>
          
        <div className="rating bg-gray-100 p-4 rounded-lg shadow-lg mb-4">

          <div className="average-rating">
            <h3 className="text-lg font-semibold text-gray-800">Average Rating: {averageRating}</h3>
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

      <div className="w-full bg-white rounded-lg border p-2 my-4 mt-20">
        <h3 className="font-bold">Comments</h3>
              
        {!isAuthenticated ? (
          <p className="mt-2">To add a comment, <Link to="/authentication" className="text-blue-500 hover:underline">Authorize</Link></p>
        ) : (
          <p></p>
        )}
      
      <div className="flex flex-col">
          {comments &&
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                commentLikes={commentLikes}
                handleToggleLike={handleToggleLike}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
        </div>
            
        <form onSubmit={handleCreateComment}>
          <div className="w-full px-3 my-2">
            <textarea
              className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
              name="body"
              placeholder="Type Your Comment"
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
            
          <div className="w-full flex justify-end px-3">
            <input
              type="submit"
              className="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500"
              value="Post Comment"
            />
          </div>
        </form>
            
      </div>

      </div>
    </div>
  );
};

export default MovieDetails;