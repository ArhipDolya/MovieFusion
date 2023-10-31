import axios from "axios";
import apiConfig from "../../utils/apiConfig";

const BASE_API_URL = apiConfig.BASE_URL


export function loginUser(loginData) {
    return axios.post(`${BASE_API_URL}/login/`, loginData)
}