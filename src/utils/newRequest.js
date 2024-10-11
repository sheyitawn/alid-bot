import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL =  'http://192.168.1.205';

const newRequest = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

newRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'API Error'}`);
      console.error('API Error:', error.response);
    } else if (error.request) {
      toast.error('No response received from server');
      console.error('Network Error:', error.request);
    } else {
      toast.error('Unexpected Error');
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default newRequest;
