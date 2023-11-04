import axios from "axios";
import apiConfig from "../../utils/apiConfig";

const BASE_API_URL = apiConfig.BASE_URL

export function getComments(movieId) {
    return axios.get(`${BASE_API_URL}/movie/comments/${movieId}/`)
}

export function deleteComment(commentId) {
    const storedAccessToken = localStorage.getItem('access_token');

    if (storedAccessToken) {
      const headers = apiConfig.createHeaders(storedAccessToken);
  
      return axios.delete(`${BASE_API_URL}/comments/${commentId}/`, {
        headers,
      });
      
    } else {
      // Handle the case where the access token is missing or invalid
      return Promise.reject(new Error('Access token is missing or invalid'));
    }
}

export const createComment = async (storedAccessToken, userComment) => {
  const headers = apiConfig.createHeaders(storedAccessToken);

  return axios.post(
    `${BASE_API_URL}/comments/`,
    userComment,
    {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      }
    }
  );
};