import axios from "axios";
import apiConfig from "../../utils/apiConfig";


const BASE_API_URL = apiConfig.BASE_URL;

export function likeComment(commentId, storedAccessToken) {
    const headers = apiConfig.createHeaders(storedAccessToken)

    return axios.post(
        `${BASE_API_URL}/movie/comments/like-comment/${commentId}/`,
        null,
        {
          headers,
        }
    );
}


export function unlikeComment(commentId, storedAccessToken) {
    const headers = apiConfig.createHeaders(storedAccessToken);
  
    return axios.post(
      `${BASE_API_URL}/movie/comments/unlike-comment/${commentId}/`,
      null,
      {
        headers,
      }
    );
  }