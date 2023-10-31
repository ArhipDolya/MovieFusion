const API_BASE_URL = 'http://localhost:8000/api/v1'; 

const createHeaders = (accessToken) => {
    return {
        Authorization: `Bearer ${accessToken}`,
    }
}

export default {
    BASE_URL: API_BASE_URL,
    createHeaders,
}