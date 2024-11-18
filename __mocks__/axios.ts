// src/__mocks__/axios.ts

// Create a mock Axios instance
const axios = jest.genMockFromModule('axios');

// Define the interceptors and configurations
axios.create = jest.fn(() => axios);

// Request interceptor
axios.interceptors.request.use(
  config => {
    config.headers['X-CUPIFY-APP'] = 'NEOCAFE';
    config.timeout = 12000; // Add timeout
    config.headers = {'content-type': 'application/json', ...config.headers}; // Add headers

    // Additional configurations if needed
    // config.baseURL = 'your_base_url';
    // config.timeout = 12000;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  },
);

export default axios;
