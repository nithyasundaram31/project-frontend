import instance from '../../services/instance'; // Centralized axios instance
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler';
import { 
    CREATE_QUESTION, 
    DELETE_QUESTION, 
    GET_QUESTIONS, 
    UPDATE_QUESTION 
} from '../../constants/questions';

// Helper function to handle errors consistently
const handleError = (error, defaultMessage) => {
    const message = error?.response?.data?.message || error?.message || defaultMessage;
    toast.error(message);
    ErrorHandler({ error });
    console.error('API Error:', error);
};

// Create Question
export const createQuestion = (questionData) => async (dispatch) => {
    try {
        const response = await instance.post('/api/questions/add', questionData);
        const message = response?.data?.message || 'Question created successfully!';
        toast.success(message);
        dispatch({ type: CREATE_QUESTION, payload: response.data });
        return response.data;
    } catch (error) {
        handleError(error, 'Error creating question');
        throw error;
    }
};

// Get Questions
export const getQuestions = () => async (dispatch) => {
    try {
        const response = await instance.get('/api/questions/');
        dispatch({ type: GET_QUESTIONS, payload: response.data });
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching questions');
        throw error;
    }
};

// Update Question
export const updateQuestion = (id, questionData) => async (dispatch) => {
    try {
        if (!id) throw new Error('Question ID is required');
        const response = await instance.put(`/api/questions/${id}`, questionData);
        dispatch({ type: UPDATE_QUESTION, payload: response.data });
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
        if (!id) throw new Error('Question ID is required');
        const response = await instance.delete(`/api/questions/${id}`);
        const message = response?.data?.message || 'Question deleted successfully!';
        toast.success(message);
        dispatch({ type: DELETE_QUESTION, payload: id });
        return { id, message };
    } catch (error) {
        handleError(error, 'Error deleting question');
        throw error;
    }
};

// Get Question By ID
export const getQuestionById = (id) => async () => {
    try {
        if (!id) throw new Error('Question ID is required');
        const response = await instance.get(`/api/questions/${id}`);
        return response.data;
    } catch (error) {
        handleError(error, 'Error fetching question');
        throw error;
    }
};

// Bulk Delete
export const deleteMultipleQuestions = (ids) => async (dispatch) => {
    try {
        if (!Array.isArray(ids) || ids.length === 0)
            throw new Error('Valid question IDs array is required');
        const response = await instance.post('/api/questions/bulk-delete', { ids });
        toast.success(`${ids.length} questions deleted successfully!`);
        ids.forEach(id => {
            dispatch({ type: DELETE_QUESTION, payload: id });
        });
        return response.data;
    } catch (error) {
        handleError(error, 'Error deleting questions');
        throw error;
    }
};