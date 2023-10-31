import axios from "axios";
import apiConfig from "../../utils/apiConfig";


const BASE_API_URL = apiConfig.BASE_URL


export function registerUser(registrationData) {
    return axios.post(`${BASE_API_URL}/register/`, registrationData);
}
  
  
  
  
  