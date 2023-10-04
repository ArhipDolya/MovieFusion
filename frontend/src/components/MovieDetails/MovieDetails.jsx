import React from 'react'
import './MovieDetails.css'


const MovieDetails = ({ movie }) => {
    return (
        <div>
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p>Category: {movie.category.name}</p>
            <p>Release Date: {movie.release_date}</p>
            <p>Director: {movie.director}</p>
            <p>Actors: {movie.actors}</p>
            <img
                src={movie.image}
                alt={movie.title}
                style={{ maxWidth: '100%' }}
            />
        </div>
    );
};


export default MovieDetails;