import instance from '../../services/instance'; // Consistent axios instance usage
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler';

// Get student result - Fixed version
export const getStudentResult = (id) => async (dispatch) => {
    try {
        // Validation check
        if (!id) {
            throw new Error('Student ID is required');
        }

        // Use consistent instance instead of creating new API
        const { data } = await instance.get(`/api/result/${id}`);
        
        // Success toast message
        toast.success('Result loaded successfully');
        
        dispatch({
            type: 'GET_RESULT_SUCCESS',
            payload: data,
        });

        return data;
    } catch (error) {
        console.error('Get student result error:', error);
        
        // Better error message handling
        let errorMessage = 'Failed to load result. Please try again.';
        
        if (error?.response?.status === 404) {
            errorMessage = 'Result not found for this student.';
        } else if (error?.response?.status === 403) {
            errorMessage = 'Access denied. You don\'t have permission to view this result.';
        } else if (error?.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        toast.error(errorMessage);
        
        dispatch({
            type: 'GET_RESULT_FAIL',
            payload: errorMessage,
        });

        // Call ErrorHandler as function, not JSX
        ErrorHandler({ error });
        
        throw error;
    }
};

// Get all results (additional function)
export const getAllResults = () => async (dispatch) => {
    try {
        const { data } = await instance.get('/api/result/');
        
        dispatch({
            type: 'GET_ALL_RESULTS_SUCCESS',
            payload: data,
        });

        return data;
    } catch (error) {
        console.error('Get all results error:', error);
        
        const errorMessage = error?.response?.data?.message || 'Failed to load results';
        toast.error(errorMessage);
        
        dispatch({
            type: 'GET_ALL_RESULTS_FAIL',
            payload: errorMessage,
        });

        ErrorHandler({ error });
        throw error;
    }
};

// Create/Submit result
export const submitResult = (resultData) => async (dispatch) => {
    try {
        if (!resultData) {
            throw new Error('Result data is required');
        }

        const { data } = await instance.post('/api/result/', resultData);
        
        toast.success(data?.message || 'Result submitted successfully');
        
        dispatch({
            type: 'SUBMIT_RESULT_SUCCESS',
            payload: data,
        });

        return data;
    } catch (error) {
        console.error('Submit result error:', error);
        
        const errorMessage = error?.response?.data?.message || 'Failed to submit result';
        toast.error(errorMessage);
        
        dispatch({
            type: 'SUBMIT_RESULT_FAIL',
            payload: errorMessage,
        });

        ErrorHandler({ error });
        throw error;
    }
};