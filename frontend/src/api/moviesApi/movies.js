import axios from "axios";
import apiConfig from "../../utils/apiConfig";

const BASE_API_URL = apiConfig.BASE_URL


export function getMovies() {
    return axios.get(`${BASE_API_URL}/movies/`)
}


export async function fetchFavoriteMovies(accessToken) {
    try {
      const response = await axios.get(`${BASE_API_URL}/favorite-movies/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching favorite movies: ${error}`);
      return [];
    }
}

export async function deleteFavoriteMovie(accessToken, movieSlug) {
    try {
      await axios.delete(`${BASE_API_URL}/favorite-movies/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          movie_slug: movieSlug,
        },
      });
    } catch (error) {
      console.error(`Error deleting favorite movie: ${error}`);
    }
}