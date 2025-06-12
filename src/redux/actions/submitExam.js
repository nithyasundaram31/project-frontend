import instance from '../../services/instance';
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler'

// Submit exam
const handleError = (error, dispatch, type) => {
    console.error('Error:', error);
    dispatch({ type, payload: error?.response?.data?.message || error.message });
    toast.error(error?.response?.data?.message || 'Something went wrong');
};


export const submitExam = (examData) => async (dispatch) => {
    try {
        
        
        const { data } = await instance.post('/api/exam/submit', examData);

        toast.success(data?.message || 'Submitted successfully');
        dispatch({ type: 'EXAM_SUBMIT_SUCCESS', payload: data });

        return data;

    } catch (error) {
        handleError(error, dispatch, 'EXAM_SUBMIT_FAIL');
    }
};


// /
export const getSubmitted = () => async (dispatch) => {
    try {
        const { data } = await instance.get('/api/exam/submit');
        dispatch({ type: 'GET_SUBMIT_SUCCESS', payload: data });
       
    } catch (error) {
        
        const status = error?.response?.status;
        if (status === 401) {
            toast.error("Session expired. Please login again.");
        } else {
            handleError(error, dispatch, 'GET_SUBMIT_FAIL');
        }
    }
};
