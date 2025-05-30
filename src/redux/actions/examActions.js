import instance from '../../services/instance'; // <-- Centralized axios instance
import { toast } from 'react-toastify';
import {
  CREATE_EXAM, GET_EXAMS,
  CREATE_EXAM_FAIL,
  GET_EXAM_FAIL, DELETE_EXAM_FAIL,
  DELETE_EXAM, EDIT_EXAM_FAILURE,
  EDIT_EXAM_SUCCESS,
  GET_EXAM_BY_ID
} from '../../constants/examConstants';

// Create Exam
export const createExam = (examData) => async (dispatch) => {
  try {
    const { data } = await instance.post('/api/exam/exams', examData);
    toast.success(data?.message || 'Exam created successfully!');
    dispatch({ type: CREATE_EXAM, payload: data });
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to create exam. Please try again.');
    dispatch({
      type: CREATE_EXAM_FAIL,
      payload: {
        message: error.response?.data?.message || 'Failed to create exam',
        error: error
      }
    });
    throw error;
  }
};

// Get All Exams
export const getExams = () => async (dispatch) => {
  try {
    const { data } = await instance.get('/api/exam/');
    dispatch({ type: GET_EXAMS, payload: data });
    return data;
  } catch (error) {
    toast.error('Failed to load exams. Please check your connection and try again.');
    dispatch({
      type: GET_EXAM_FAIL,
      payload: {
        message: error?.response?.data?.message || 'Failed to fetch exams',
        error: error
      }
    });
    throw error;
  }
};

// Get Exam By ID
export const getExamById = (id) => async (dispatch) => {
  try {
    const { data } = await instance.get(`/api/exam/exams/${id}`);
    dispatch({ type: GET_EXAM_BY_ID, payload: data });
    return data;
  } catch (error) {
    let errorMessage = "Failed to load exam. Please try again.";
    if (error?.response?.status === 404) {
      errorMessage = "Exam not found. The exam you're looking for doesn't exist.";
    } else if (error?.response?.status === 403) {
      errorMessage = "Access denied. You don't have permission to view this exam.";
    } else if (error?.response?.status >= 500) {
      errorMessage = "Server error. Something went wrong on our end. Please try again.";
    }
    toast.error(error?.response?.data?.message || errorMessage);
    dispatch({
      type: GET_EXAM_FAIL,
      payload: {
        message: error?.response?.data?.message || errorMessage,
        statusCode: error?.response?.status,
        error: error
      }
    });
    throw error;
  }
};

// Update Exam
export const updateExam = (id, examData) => async (dispatch) => {
  try {
    const { data } = await instance.put(`/api/exam/exams/${id}`, examData);
    toast.success(data?.message || 'Exam updated successfully!');
    dispatch({ type: EDIT_EXAM_SUCCESS, payload: data });
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to update exam. Please try again.');
    dispatch({
      type: EDIT_EXAM_FAILURE,
      payload: {
        message: error?.response?.data?.message || 'Failed to update exam',
        error: error
      }
    });
    throw error;
  }
};

// Delete Exam
export const deleteExam = (id) => async (dispatch) => {
  try {
    const { data } = await instance.delete(`/api/exam/exams/${id}`);
    toast.success(data?.message || 'Exam deleted successfully!');
    dispatch({ type: DELETE_EXAM, payload: id });
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to delete exam. Please try again.');
    dispatch({
      type: DELETE_EXAM_FAIL,
      payload: {
        message: error?.response?.data?.message || 'Failed to delete exam',
        error: error
      }
    });
    throw error;
  }
};