import instance from '../../services/instance';
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler';

// Thunk action to submit the exam
export const submitExam = (examData) => async (dispatch) => {
    try {
        const { data } = await instance.post('/api/exam/submit', examData);
        toast.success(data?.message || 'Submitted successfully');
        dispatch({
            type: 'EXAM_SUBMIT_SUCCESS',
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: 'EXAM_SUBMIT_FAIL',
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
        console.error(error);
    toast.error(error?.response?.data?.message || 'Some error');
    }
};

export const getSubmitted = () => async (dispatch) => {
    try {
        const { data } = await instance.get('/api/exam/submit');
        dispatch({
            type: 'GET_SUBMIT_SUCCESS',
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: 'GET_SUBMIT_FAIL',
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
     
    console.error(error);
    toast.error(error?.response?.data?.message || 'Some error');
   
    }
};