import axios from "axios";
import apiConfig from "../../utils/apiConfig";

const BASE_API_URL = apiConfig.BASE_URL

export function getMovieDetails(slug) {
    return axios.get(`${BASE_API_URL}/movies/${slug}`);
}

export function addToFavorites(movie_slug, headers) {
    return axios.post(`${BASE_API_URL}/favorite-movies/`, { movie_slug: movie_slug }, { headers });
}