import {
  CREATE_EXAM, GET_EXAMS, CREATE_EXAM_FAIL, GET_EXAM_FAIL,
  DELETE_EXAM, DELETE_EXAM_FAIL, EDIT_EXAM_FAILURE, EDIT_EXAM_SUCCESS, GET_EXAM_BY_ID
} from '../../constants/examConstants';

const initialState = {
    exams: [],
    user: null,
    submittedData: [],
    examDetails: null,
    isLoading: false,
    error: null,
};

const examReducer = (state = initialState, action) => {
    switch (action.type) {
        // Loading states (if you have these constants)
        case 'GET_EXAMS_REQUEST':
        case 'CREATE_EXAM_REQUEST':
        case 'DELETE_EXAM_REQUEST':
        case 'GET_EXAM_BY_ID_REQUEST':
            return {
                ...state,
                isLoading: true,
                error: null
            };

        // Success cases
        case GET_EXAMS:
            return {
                ...state,
                isLoading: false,
                exams: action.payload.exams,
                submittedData: action.payload.submittedData,
                user: action.payload.user,
                error: null // Clear any previous errors
            };

        case GET_EXAM_BY_ID:
            return { 
                ...state, 
                isLoading: false,
                examDetails: action.payload,
                error: null
            };

        case CREATE_EXAM:
            return { 
                ...state, 
                isLoading: false,
                exams: [...state.exams, action.payload],
                error: null
            };

        case EDIT_EXAM_SUCCESS:
            return { 
                ...state, 
                isLoading: false,
                exams: action.payload,
                error: null
            };

        case DELETE_EXAM:
            return {
                ...state,
                isLoading: false,
                exams: state.exams.filter((exam) => exam._id !== action.payload),
                error: null
            };

        // Error cases
        case CREATE_EXAM_FAIL:
        case GET_EXAM_FAIL:
        case DELETE_EXAM_FAIL:
        case EDIT_EXAM_FAILURE:
            return { 
                ...state, 
                isLoading: false,
                error: action.payload 
            };

        // Clear error action (optional but useful)
        case 'CLEAR_EXAM_ERROR':
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

export default examReducer;



// import {
//   CREATE_EXAM, GET_EXAMS, CREATE_EXAM_FAIL, GET_EXAM_FAIL,
//   DELETE_EXAM, DELETE_EXAM_FAIL, EDIT_EXAM_FAILURE, EDIT_EXAM_SUCCESS, GET_EXAM_BY_ID
// } from '../../constants/examConstants';

// const initialState = {
//     exams: [],
//     user: null,
//     submittedData: [],
//     examDetails: null,
//     isLoading: false,
//     error: null,
// };

// const examReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case GET_EXAMS:
//             return {
//                 ...state,
//                 exams: action.payload.exams,
//                 submittedData: action.payload.submittedData,
//                 user: action.payload.user // <-- fixed
//             };
//         case GET_EXAM_BY_ID:
//             return { ...state, examDetails: action.payload }
//         case CREATE_EXAM:
//             return { ...state, exams: [...state.exams, action.payload] };
//         case CREATE_EXAM_FAIL:
//         case GET_EXAM_FAIL:
//         case DELETE_EXAM_FAIL:
//         case EDIT_EXAM_FAILURE:
//             return { ...state, error: action.payload };
//         case EDIT_EXAM_SUCCESS:
//             return { ...state, exams: action.payload };
//         case DELETE_EXAM:
//             return {
//                 ...state,
//                 exams: state.exams.filter((exam) => exam._id !== action.payload),
//             };
//         default:
//             return state;
//     }
// };
// export default examReducer;