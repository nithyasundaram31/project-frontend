import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler';

// Action Types Constants
export const EXAM_SUBMIT_REQUEST = 'EXAM_SUBMIT_REQUEST';
export const EXAM_SUBMIT_SUCCESS = 'EXAM_SUBMIT_SUCCESS';
export const EXAM_SUBMIT_FAIL = 'EXAM_SUBMIT_FAIL';
export const GET_SUBMIT_REQUEST = 'GET_SUBMIT_REQUEST';
export const GET_SUBMIT_SUCCESS = 'GET_SUBMIT_SUCCESS';
export const GET_SUBMIT_FAIL = 'GET_SUBMIT_FAIL';
export const CLEAR_EXAM_ERRORS = 'CLEAR_EXAM_ERRORS';

// Base configuration for Axios
const API = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/exam`,
    timeout: 15000, // 15 second timeout for exam submissions
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
            localStorage.removeItem('token');
            toast.error('Session expired. Please login again.');
        } else if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
            toast.error('Request timeout. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

// Helper function to extract error message
const getErrorMessage = (error) => {
    return error.response?.data?.message || 
           error.response?.data?.error || 
           error.message || 
           'An unexpected error occurred';
};

// Helper function to handle errors consistently
const handleError = (error, dispatch, failActionType, defaultMessage) => {
    const message = getErrorMessage(error);
    
    toast.error(message);
    ErrorHandler({ error }); // Fixed: Call as function
    console.error('API Error:', error);
    
    dispatch({
        type: failActionType,
        payload: message
    });
};

// Submit Exam Action
export const submitExam = (examData) => async (dispatch) => {
    try {
        // Validate exam data
        if (!examData || Object.keys(examData).length === 0) {
            throw new Error('Exam data is required');
        }

        // Dispatch loading state
        dispatch({ type: EXAM_SUBMIT_REQUEST });

        const { data } = await API.post('/submit', examData);
        
        const message = data?.message || 'Exam submitted successfully!';
        toast.success(message);
        
        dispatch({
            type: EXAM_SUBMIT_SUCCESS,
            payload: data
        });

        return data; // Return data for component use
    } catch (error) {
        handleError(error, dispatch, EXAM_SUBMIT_FAIL, 'Failed to submit exam');
        throw error; // Re-throw for component error handling
    }
};

// Get Submitted Exams Action
export const getSubmitted = () => async (dispatch) => {
    try {
        // Dispatch loading state
        dispatch({ type: GET_SUBMIT_REQUEST });

        const { data } = await API.get('/submit');
        
        dispatch({
            type: GET_SUBMIT_SUCCESS,
            payload: data
        });

        return data;
    } catch (error) {
        handleError(error, dispatch, GET_SUBMIT_FAIL, 'Failed to fetch submitted exams');
        throw error;
    }
};

// Get Specific Submitted Exam
export const getSubmittedExamById = (examId) => async (dispatch) => {
    try {
        if (!examId) {
            throw new Error('Exam ID is required');
        }

        const { data } = await API.get(`/submit/${examId}`);
        
        dispatch({
            type: 'GET_SUBMITTED_EXAM_SUCCESS',
            payload: data
        });

        return data;
    } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        
        dispatch({
            type: 'GET_SUBMITTED_EXAM_FAIL',
            payload: message
        });
        
        throw error;
    }
};

// Update Exam Submission (if allowed)
export const updateExamSubmission = (examId, updateData) => async (dispatch) => {
    try {
        if (!examId) {
            throw new Error('Exam ID is required');
        }

        const { data } = await API.put(`/submit/${examId}`, updateData);
        
        toast.success('Exam submission updated successfully!');
        
        dispatch({
            type: 'UPDATE_EXAM_SUBMISSION_SUCCESS',
            payload: data
        });

        return data;
    } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        
        dispatch({
            type: 'UPDATE_EXAM_SUBMISSION_FAIL',
            payload: message
        });
        
        throw error;
    }
};

// Delete Exam Submission
export const deleteExamSubmission = (examId) => async (dispatch) => {
    try {
        if (!examId) {
            throw new Error('Exam ID is required');
        }

        const { data } = await API.delete(`/submit/${examId}`);
        
        toast.success('Exam submission deleted successfully!');
        
        dispatch({
            type: 'DELETE_EXAM_SUBMISSION_SUCCESS',
            payload: examId
        });

        return { examId, message: data?.message };
    } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        
        dispatch({
            type: 'DELETE_EXAM_SUBMISSION_FAIL',
            payload: message
        });
        
        throw error;
    }
};

// Clear Exam Errors
export const clearExamErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_EXAM_ERRORS });
};

// Auto-save functionality for exam progress
export const autoSaveExamProgress = (examData) => async (dispatch) => {
    try {
        // Silent auto-save without user notification
        const { data } = await API.post('/auto-save', examData);
        
        dispatch({
            type: 'AUTO_SAVE_SUCCESS',
            payload: data
        });

        return data;
    } catch (error) {
        // Log error but don't show toast for auto-save failures
        console.warn('Auto-save failed:', error);
        
        dispatch({
            type: 'AUTO_SAVE_FAIL',
            payload: getErrorMessage(error)
        });
    }
};

// Get Exam Statistics
export const getExamStatistics = () => async (dispatch) => {
    try {
        const { data } = await API.get('/statistics');
        
        dispatch({
            type: 'GET_EXAM_STATS_SUCCESS',
            payload: data
        });

        return data;
    } catch (error) {
        const message = getErrorMessage(error);
        toast.error('Failed to load exam statistics');
        
        dispatch({
            type: 'GET_EXAM_STATS_FAIL',
            payload: message
        });
        
        throw error;
    }
};

export default API;