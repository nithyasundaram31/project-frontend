import instance from '../../services/instance';
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler';

import { CREATE_QUESTION, DELETE_QUESTION, GET_QUESTIONS, UPDATE_QUESTION } from '../../constants/questions';

// Create Question
export const createQuestion = (questionData) => async (dispatch) => {
     console.log("Sending Question Data to backend:", questionData);
    try {
        const response = await instance.post('/api/questions/add', questionData);
        toast.success(response?.data?.message || 'Question created successfully!');
        dispatch({ type: CREATE_QUESTION, payload: response.data });
    } catch (error) {
        toast.error(`Error creating question: ${error.response?.data?.message || error.message}`);
       
    }
};

// Get Questions
export const getQuestions = () => async (dispatch) => {
    try {
        const response = await instance.get('/api/questions/');
        dispatch({ type: GET_QUESTIONS, payload: response?.data });
    } catch (error) {
        toast.error(`Error fetching questions: ${error.response?.data?.message || error.message}`);
      
    }
};

// Update Question
export const updateQuestion = (id, questionData) => async (dispatch) => {
    try {
        const response = await instance.put(`/api/questions/${id}`, questionData);
        dispatch({ type: UPDATE_QUESTION, payload: response.data });
        toast.success('Question updated successfully!');
    } catch (error) {
        toast.error(`Error updating question: ${error.response?.data?.message || error.message}`);
       
    }
};

// Delete Question
export const deleteQuestion = (id) => async (dispatch) => {
    try {
        await instance.delete(`/api/questions/${id}`);
        toast.success('Question deleted successfully!');
        dispatch({ type: DELETE_QUESTION, payload: id });
    } catch (error) {
        toast.error(`Error deleting question: ${error.response?.data?.message || error.message}`);
      
    }
};