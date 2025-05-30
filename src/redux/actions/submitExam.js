import instance from '../../services/instance';
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

// Helper function to extract error message
const getErrorMessage = (error) => (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    'An unexpected error occurred'
);

// Helper function to handle errors consistently
const handleError = (error, dispatch, failActionType, defaultMessage) => {
    const message = getErrorMessage(error);
    toast.error(message);
    ErrorHandler({ error });
    dispatch({
        type: failActionType,
        payload: message
    });
};

// Submit Exam Action
export const submitExam = (examData) => async (dispatch) => {
    try {
        if (!examData || Object.keys(examData).length === 0) {
            throw new Error('Exam data is required');
        }
        dispatch({ type: EXAM_SUBMIT_REQUEST });
        const { data } = await instance.post('/api/exam/submit', examData);
        toast.success(data?.message || 'Exam submitted successfully!');
        dispatch({ type: EXAM_SUBMIT_SUCCESS, payload: data });
        return data;
    } catch (error) {
        handleError(error, dispatch, EXAM_SUBMIT_FAIL, 'Failed to submit exam');
        throw error;
    }
};

// Get Submitted Exams Action
export const getSubmitted = () => async (dispatch) => {
    try {
        dispatch({ type: GET_SUBMIT_REQUEST });
        const { data } = await instance.get('/api/exam/submit');
        dispatch({ type: GET_SUBMIT_SUCCESS, payload: data });
        return data;
    } catch (error) {
        handleError(error, dispatch, GET_SUBMIT_FAIL, 'Failed to fetch submitted exams');
        throw error;
    }
};

// Get Specific Submitted Exam
export const getSubmittedExamById = (examId) => async (dispatch) => {
    try {
        if (!examId) throw new Error('Exam ID is required');
        const { data } = await instance.get(`/api/exam/submit/${examId}`);
        dispatch({ type: 'GET_SUBMITTED_EXAM_SUCCESS', payload: data });
        return data;
    } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        dispatch({ type: 'GET_SUBMITTED_EXAM_FAIL', payload: message });
        throw error;
    }
};

// Update Exam Submission (if allowed)
export const updateExamSubmission = (examId, updateData) => async (dispatch) => {
    try {
        if (!examId) throw new Error('Exam ID is required');
        const { data } = await instance.put(`/api/exam/submit/${examId}`, updateData);
        toast.success('Exam submission updated successfully!');
        dispatch({ type: 'UPDATE_EXAM_SUBMISSION_SUCCESS', payload: data });
        return data;
    } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        dispatch({ type: 'UPDATE_EXAM_SUBMISSION_FAIL', payload: message });
        throw error;
    }
};

// Delete Exam Submission
export const deleteExamSubmission = (examId) => async (dispatch) => {
    try {
        if (!examId) throw new Error('Exam ID is required');
        const { data } = await instance.delete(`/api/exam/submit/${examId}`);
        toast.success('Exam submission deleted successfully!');
        dispatch({ type: 'DELETE_EXAM_SUBMISSION_SUCCESS', payload: examId });
        return { examId, message: data?.message };
    } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        dispatch({ type: 'DELETE_EXAM_SUBMISSION_FAIL', payload: message });
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
        const { data } = await instance.post('/api/exam/auto-save', examData);
        dispatch({ type: 'AUTO_SAVE_SUCCESS', payload: data });
        return data;
    } catch (error) {
        dispatch({ type: 'AUTO_SAVE_FAIL', payload: getErrorMessage(error) });
    }
};

// Get Exam Statistics
export const getExamStatistics = () => async (dispatch) => {
    try {
        const { data } = await instance.get('/api/exam/statistics');
        dispatch({ type: 'GET_EXAM_STATS_SUCCESS', payload: data });
        return data;
    } catch (error) {
        const message = getErrorMessage(error);
        toast.error('Failed to load exam statistics');
        dispatch({ type: 'GET_EXAM_STATS_FAIL', payload: message });
        throw error;
    }
};