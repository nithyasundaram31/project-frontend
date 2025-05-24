import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler';
import { 
    CREATE_QUESTION, 
    DELETE_QUESTION, 
    GET_QUESTIONS, 
    UPDATE_QUESTION 
} from '../../constants/questions';

// Base configuration for Axios
const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'https://project-backend-om0o.onrender.com/api/questions',
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor for better error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common HTTP errors
        if (error.response?.status === 401) {
            // Token might be expired
            localStorage.removeItem('token');
            toast.error('Session expired. Please login again.');
            // Optionally redirect to login page
            // window.location.href = '/login';
        } else if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        }
        return Promise.reject(error);
    }
);

// Helper function to handle errors consistently
const handleError = (error, defaultMessage) => {
    const message = error.response?.data?.message || error.message || defaultMessage;
    toast.error(message);
    ErrorHandler({ error }); // Fixed: ErrorHandler should be called as a function
    console.error('API Error:', error);
};

// Create Question
export const createQuestion = (questionData) => async (dispatch) => {
    try {
        const response = await API.post('/add', questionData);
        const message = response?.data?.message || 'Question created successfully!';
        
        toast.success(message);
        dispatch({ 
            type: CREATE_QUESTION, 
            payload: response.data 
        });
        
        return response.data; // Return data for component use
    } catch (error) {
        handleError(error, 'Error creating question');
        throw error; // Re-throw for component error handling
    }
};

// Get Questions
export const getQuestions = () => async (dispatch) => {
    try {
        const response = await API.get('/');
        
        dispatch({ 
            type: GET_QUESTIONS, 
            payload: response.data 
        });
        
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching questions');
        throw error;
    }
};

// Update Question
export const updateQuestion = (id, questionData) => async (dispatch) => {
    try {
        if (!id) {
            throw new Error('Question ID is required');
        }
        
        const response = await API.put(`/${id}`, questionData);
        
        dispatch({ 
            type: UPDATE_QUESTION, 
            payload: response.data 
        });
        
        toast.success('Question updated successfully!');
        return response.data;
    } catch (error) {
        handleError(error, 'Error updating question');
        throw error;
    }
};

// Delete Question
export const deleteQuestion = (id) => async (dispatch) => {
    try {
        if (!id) {
            throw new Error('Question ID is required');
        }
        
        const response = await API.delete(`/${id}`);
        const message = response?.data?.message || 'Question deleted successfully!';
        
        toast.success(message);
        dispatch({ 
            type: DELETE_QUESTION, 
            payload: id 
        });
        
        return { id, message };
    } catch (error) {
        handleError(error, 'Error deleting question');
        throw error;
    }
};

// Additional utility functions
export const getQuestionById = (id) => async () => {
    try {
        if (!id) {
            throw new Error('Question ID is required');
        }
        
        const response = await API.get(`/${id}`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching question');
        throw error;
    }
};

// Bulk operations
export const deleteMultipleQuestions = (ids) => async (dispatch) => {
    try {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error('Valid question IDs array is required');
        }
        
        const response = await API.post('/bulk-delete', { ids });
        
        toast.success(`${ids.length} questions deleted successfully!`);
        
        // Dispatch individual delete actions for each ID
        ids.forEach(id => {
            dispatch({ 
                type: DELETE_QUESTION, 
                payload: id 
            });
        });
        
        return response.data;
    } catch (error) {
        handleError(error, 'Error deleting questions');
        throw error;
    }
};

export default API;