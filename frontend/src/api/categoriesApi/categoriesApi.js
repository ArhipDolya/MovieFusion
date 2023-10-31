import axios from "axios";
import apiConfig from "../../utils/apiConfig";

const BASE_API_URL = apiConfig.BASE_URL;

export function getCategories() {
  return axios.get(`${BASE_API_URL}/categories/`);
}