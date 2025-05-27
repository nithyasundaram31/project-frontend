import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CREATE_EXAM, GET_EXAMS,
  CREATE_EXAM_FAIL,
  GET_EXAM_FAIL, DELETE_EXAM_FAIL,
  DELETE_EXAM, EDIT_EXAM_FAILURE,
  EDIT_EXAM_SUCCESS,
  GET_EXAM_BY_ID
} from '../../constants/examConstants';

// Base configuration for Axios
const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/exam`
});

// Add a request interceptor
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers['Content-Type'] = 'application/json';
      req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//create exams
export const createExam = (examData) => async (dispatch) => {
  try {
    const { data } = await API.post('/exams', examData);
    
    // Success toast without JSX
    toast.success(data?.message || 'Exam created successfully!');
    
    dispatch({ type: CREATE_EXAM, payload: data });
    return data;
  } catch (error) {
    console.error('Create exam error:', error);
    
    // Error toast without JSX
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

//get exams
export const getExams = (id) => async (dispatch) => {
  try {
    const { data } = await API.get(`/`);
    dispatch({ type: GET_EXAMS, payload: data });
    return data;
  } catch (error) {
    console.error('Get exams error:', error);
    
    // Error toast without JSX
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

// Get exam by ID
export const getExamById = (id) => async (dispatch) => {
  try {
    const { data } = await API.get(`/exams/${id}`);
    dispatch({ type: GET_EXAM_BY_ID, payload: data });
    return data;
  } catch (error) {
    console.error('Get exam by ID error:', error);
    
    // Different error messages based on status code
    let errorMessage = "Failed to load exam. Please try again.";
    
    if (error?.response?.status === 404) {
      errorMessage = "Exam not found. The exam you're looking for doesn't exist.";
    } else if (error?.response?.status === 403) {
      errorMessage = "Access denied. You don't have permission to view this exam.";
    } else if (error?.response?.status >= 500) {
      errorMessage = "Server error. Something went wrong on our end. Please try again.";
    }
    
    // Error toast without JSX
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

//update exam
export const updateExam = (id, examData) => async (dispatch) => {
  try {
    const { data } = await API.put(`/exams/${id}`, examData);
    
    // Success toast without JSX
    toast.success(data?.message || 'Exam updated successfully!');
    
    dispatch({ type: EDIT_EXAM_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error('Update exam error:', error);
    
    // Error toast without JSX
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

//delete exam
export const deleteExam = (id) => async (dispatch) => {
  try {
    const { data } = await API.delete(`/exams/${id}`);
    
    // Success toast without JSX
    toast.success(data?.message || 'Exam deleted successfully!');
    
    dispatch({ type: DELETE_EXAM, payload: id });
    return data;
  } catch (error) {
    console.error('Delete exam error:', error);
    
    // Error toast without JSX
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

// import axios from 'axios';
// import { toast } from 'react-toastify';
// import {
//   CREATE_EXAM, GET_EXAMS,
//   CREATE_EXAM_FAIL,
//   GET_EXAM_FAIL, DELETE_EXAM_FAIL,
//   DELETE_EXAM, EDIT_EXAM_FAILURE,
//   EDIT_EXAM_SUCCESS,
//   GET_EXAM_BY_ID
// } from '../../constants/examConstants';

// // Base configuration for Axios
// const API = axios.create({
//   baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/exam`
// });

// // Add a request interceptor
// API.interceptors.request.use(
//   (req) => {
//     const token = localStorage.getItem('token');
//     console.log("=== API REQUEST DEBUG ===");
//     console.log("Request URL:", req.url);
//     console.log("Full URL:", `${req.baseURL}${req.url}`);
//     console.log("Token:", token ? "Present" : "Missing");
    
//     if (token) {
//       req.headers['Content-Type'] = 'application/json';
//       req.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return req;
//   },
//   (error) => {
//     console.error("Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for better error handling
// API.interceptors.response.use(
//   (response) => {
//     console.log("=== API RESPONSE DEBUG ===");
//     console.log("Response status:", response.status);
//     console.log("Response data:", response.data);
//     return response;
//   },
//   (error) => {
//     console.error("=== API ERROR DEBUG ===");
//     console.error("Error status:", error.response?.status);
//     console.error("Error data:", error.response?.data);
//     console.error("Full error:", error);
//     return Promise.reject(error);
//   }
// );

// //create exams
// export const createExam = (examData) => async (dispatch) => {
//   try {
//     // Changed from '/exams' to '/' if your backend route is /api/exam/ for POST
//     const { data } = await API.post('/', examData);
    
//     toast.success(data?.message || 'Exam created successfully!');
//     dispatch({ type: CREATE_EXAM, payload: data });
//     return data;
//   } catch (error) {
//     console.error('Create exam error:', error);
//     toast.error(error?.response?.data?.message || 'Failed to create exam. Please try again.');
    
//     dispatch({ 
//       type: CREATE_EXAM_FAIL, 
//       payload: {
//         message: error.response?.data?.message || 'Failed to create exam',
//         error: error
//       }
//     });
    
//     throw error;
//   }
// };

// //get exams - FIXED
// export const getExams = () => async (dispatch) => {
//   try {
//     console.log("=== GET EXAMS DEBUG ===");
//     console.log("Making request to get exams...");
    
//     // This will call GET /api/exam/ (base URL + '/')
//     const { data } = await API.get('/');
    
//     console.log("Get exams success:", data);
//     dispatch({ type: GET_EXAMS, payload: data });
//     return data;
//   } catch (error) {
//     console.error('Get exams error:', error);
    
//     // Better error handling
//     let errorMessage = 'Failed to load exams. Please check your connection and try again.';
    
//     if (error?.response?.status === 401) {
//       errorMessage = 'Please login again. Your session has expired.';
//     } else if (error?.response?.status === 403) {
//       errorMessage = 'You do not have permission to view exams.';
//     } else if (error?.response?.status === 404) {
//       errorMessage = 'Exam service not found. Please contact admin.';
//     }
    
//     toast.error(error?.response?.data?.message || errorMessage);
    
//     dispatch({ 
//       type: GET_EXAM_FAIL, 
//       payload: {
//         message: error?.response?.data?.message || errorMessage,
//         statusCode: error?.response?.status,
//         error: error
//       }
//     });
    
//     throw error;
//   }
// };

// // Get exam by ID - FIXED
// export const getExamById = (id) => async (dispatch) => {
//   try {
//     console.log("=== GET EXAM BY ID DEBUG ===");
//     console.log("Exam ID:", id);
    
//     // This will call GET /api/exam/exams/123
//     const { data } = await API.get(`/exams/${id}`);
    
//     console.log("Get exam by ID success:", data);
//     dispatch({ type: GET_EXAM_BY_ID, payload: data });
//     return data;
//   } catch (error) {
//     console.error('Get exam by ID error:', error);
    
//     let errorMessage = "Failed to load exam. Please try again.";
    
//     if (error?.response?.status === 404) {
//       errorMessage = "Exam not found. The exam you're looking for doesn't exist.";
//     } else if (error?.response?.status === 403) {
//       errorMessage = "Access denied. You don't have permission to view this exam.";
//     } else if (error?.response?.status >= 500) {
//       errorMessage = "Server error. Something went wrong on our end. Please try again.";
//     }
    
//     toast.error(error?.response?.data?.message || errorMessage);
    
//     dispatch({ 
//       type: GET_EXAM_FAIL, 
//       payload: {
//         message: error?.response?.data?.message || errorMessage,
//         statusCode: error?.response?.status,
//         error: error
//       }
//     });
    
//     throw error;
//   }
// };

// //update exam - FIXED
// export const updateExam = (id, examData) => async (dispatch) => {
//   try {
//     // This will call PUT /api/exam/exams/123
//     const { data } = await API.put(`/exams/${id}`, examData);
    
//     toast.success(data?.message || 'Exam updated successfully!');
//     dispatch({ type: EDIT_EXAM_SUCCESS, payload: data });
//     return data;
//   } catch (error) {
//     console.error('Update exam error:', error);
//     toast.error(error?.response?.data?.message || 'Failed to update exam. Please try again.');
    
//     dispatch({ 
//       type: EDIT_EXAM_FAILURE, 
//       payload: {
//         message: error?.response?.data?.message || 'Failed to update exam',
//         error: error
//       }
//     });
    
//     throw error;
//   }
// };

// //delete exam - FIXED
// export const deleteExam = (id) => async (dispatch) => {
//   try {
//     // This will call DELETE /api/exam/exams/123
//     const { data } = await API.delete(`/exams/${id}`);
    
//     toast.success(data?.message || 'Exam deleted successfully!');
//     dispatch({ type: DELETE_EXAM, payload: id });
//     return data;
//   } catch (error) {
//     console.error('Delete exam error:', error);
//     toast.error(error?.response?.data?.message || 'Failed to delete exam. Please try again.');
    
//     dispatch({ 
//       type: DELETE_EXAM_FAIL, 
//       payload: {
//         message: error?.response?.data?.message || 'Failed to delete exam',
//         error: error
//       }
//     });
    
//     throw error;
//   }
// };