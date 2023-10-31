import axios from "axios";
import apiConfig from "../../utils/apiConfig";


const BASE_API_URL = apiConfig.BASE_URL


export function getAverageRating(slug) {
    return axios.get(`${BASE_API_URL}/movies/${slug}/average-ratings/`);
}

export function addRating(movie_slug, ratingValue, headers) {
    return axios.post(`${BASE_API_URL}/ratings/`, {
            movie: movie_slug,
            rating: ratingValue,
        }, { headers })
}