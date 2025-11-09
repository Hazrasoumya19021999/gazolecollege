import axios from 'axios';
import axiosRetry from 'axios-retry';

//Main URL
const BASE_URL = 'https://gmg.ac.in/api/api/';

// Configure Axios retry mechanism
axiosRetry(axios, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount) => {
        console.warn(`Retrying request, attempt #${retryCount}`);
        return retryCount * 1000; // Exponential backoff: 1s, 2s, 3s...
    },
    retryCondition: (error) => {
        // Retry only on network errors or 5xx server errors
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            error.response?.status >= 500
        );
    },
});  

// Function to make GET requests
export const getData = async (endpoint) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const response = await axios.get(url);

        // Ensure response data is not null or undefined
        if (!response.data || Object.keys(response.data).length === 0) {
            console.warn('Received empty or null response:', response.data);
            return null;
        }

        return response.data; // Return the parsed data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error for further handling
    }
};

// Function to make POST requests
export const postData = async (endpoint, body) => {
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, body, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000, // Optional timeout for the request
        });

        // Ensure response data is not null or undefined
        if (!response.data) {
            console.warn('Received empty response body');
            return null;
        }

        return response.data; // Return the parsed data
    } catch (error) {
        console.error('Error posting data:', error);
        throw error; // Re-throw the error for further handling
    }
};


