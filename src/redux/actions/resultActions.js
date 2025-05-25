// actions/examActions.js
import axios from 'axios';
import ErrorHandler from '../../components/ErrorHandler';

// Base configuration for Axios
const API = axios.create({
     baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/result`
});

// Add a request interceptor
API.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem('token'); // Adjust based on where you store your token

        if (token) {
            // Add the headers
            req.headers['Content-Type'] = 'application/json'; // Set content type
            req.headers['Authorization'] = `Bearer ${token}`; // Pass JWT token in header
        }
        return req; // Return the modified request
    },
    (error) => {
        // Handle any error that occurs before the request is sent
        return Promise.reject(error);
    }
);

//get single student result
export const getStudentResult = (id) => async (dispatch) => {
    try {
        const { data } = await API.get(`/${id}`);        
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
        // <ErrorHandler error={error} />
// Fixed: Call ErrorHandler as a function, not JSX
        ErrorHandler({ error });
    }
};

// actions/resultActions.js
// import axios from 'axios';
// import ErrorHandler from '../../components/ErrorHandler';

// // Base configuration for Axios
// const API = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL || 'https://project-backend-om0o.onrender.com/api/result'
// });

// // Add a request interceptor
// API.interceptors.request.use(
//     (req) => {
//         const token = localStorage.getItem('token');
        
//         if (token) {
//             req.headers['Content-Type'] = 'application/json';
//             req.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return req;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Get single student result
// export const getStudentResult = (id) => async (dispatch) => {
//     try {
//         const { data } = await API.get(`/${id}`);
        
//         dispatch({
//             type: 'GET_RESULT_SUCCESS',
//             payload: data,
//         });
        
//     } catch (error) {
//         dispatch({
//             type: 'GET_RESULT_FAIL',
//             payload: error.response && error.response.data.message
//                 ? error.response.data.message
//                 : error.message,
//         });
        
//         // Fixed: Call ErrorHandler as a function, not JSX
//         ErrorHandler({ error });
//     }
// };