import instance from '../../services/instance';
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler';

// Thunk action to submit the exam
export const submitExam = (examData) => async (dispatch) => {
    try {
          console.log('Submitting Exam Data:', examData);
        const { data } = await instance.post('/api/exam/submit', examData);
        toast.success(data?.message || 'Submitted successfully');
        dispatch({
            type: 'EXAM_SUBMIT_SUCCESS',
            payload: data,
        });
        //  dispatch(getSubmitted()); 

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

// import instance from '../../services/instance';
// import { toast } from 'react-toastify';
// import ErrorHandler from '../../components/ErrorHandler';

// // Thunk action to submit the exam
// export const submitExam = (examData) => async (dispatch) => {
//     try {
//         console.log('Submitting Exam Data:', examData);
//         const { data } = await instance.post('/api/exam/submit', examData);
        
//         // Success case
//         toast.success(data?.message || 'Submitted successfully');
//         dispatch({
//             type: 'EXAM_SUBMIT_SUCCESS',
//             payload: data,
//         });
        
//         // Return success object for frontend handling
//         return { 
//             success: true, 
//             data: data 
//         };
        
//     } catch (error) {
//         const errorMessage = error.response?.data?.message || error.message || 'Some error';
        
//         dispatch({
//             type: 'EXAM_SUBMIT_FAIL',
//             payload: errorMessage,
//         });
        
//         console.error('Submit Exam Error:', error);
        
//         // Handle specific error cases
//         if (error.response?.status === 400 && errorMessage.includes('already submitted')) {
//             toast.error('You have already submitted this exam!');
//         } else {
//             toast.error(errorMessage);
//         }
        
//         // Return error object for frontend handling
//         return { 
//             error: true, 
//             message: errorMessage,
//             status: error.response?.status 
//         };
//     }
// };

// export const getSubmitted = () => async (dispatch) => {
//     try {
//         const { data } = await instance.get('/api/exam/submit');
//         dispatch({
//             type: 'GET_SUBMIT_SUCCESS',
//             payload: data,
//         });
        
//         return { success: true, data: data };
        
//     } catch (error) {
//         console.error('🔴 GET_SUBMITTED FAIL:', error);
//         const errorMessage = error.response?.data?.message || error.message || 'Some error';
        
//         dispatch({
//             type: 'GET_SUBMIT_FAIL',
//             payload: errorMessage,
//         });
        
//         // console.error('Get Submitted Error:', error);
//         toast.error(errorMessage);
        
//         return { error: true, message: errorMessage };
//     }
// };