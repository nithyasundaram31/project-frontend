import instance from '../../services/instance';
import ErrorHandler from '../../components/ErrorHandler';

// get single student result
export const getStudentResult = (id) => async (dispatch) => {
    try {
        const { data } = await instance.get(`/api/result/${id}`);
        dispatch({
            type: 'GET_RESULT_SUCCESS',
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: 'GET_RESULT_FAIL',
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });

        console.error(error)
       toast.error(error?.response?.data?.message || 'Some error');
    }
};