const initialState = {
  students: [],
  activity: [],
  proctor: [],
  error: null,
};

export const studentReducer = (state = initialState, action) => {
  //  Logging inside function where `action` is defined
  console.log("Action type:", action.type);
  console.log("Action payload:", action.payload);

  switch (action.type) {
    case 'GET_ALL_STUDENTS':
      return {
        ...state,
        students: Array.isArray(action.payload) ? [...action.payload] : [],
      };

    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter(
          (student) => student._id !== action.payload
        ),
      };

    case 'UPDATE_EXAM_PERMISSION':
      return {
        ...state,
        students: state.students.map((student) =>
          student._id === action.payload.id
            ? { ...student, examPermission: action.payload.permission }
            : student
        ),
      };

    case 'UPDATE_ROLE':
      return {
        ...state,
        students: state.students.map((student) =>
          student._id === action.payload.id
            ? { ...student, role: action.payload.role }
            : student
        ),
      };

    case 'CREATE_STUDENTS_ACTIVITY':
    case 'CREATE_STUDENTS_ACTIVITY':
case 'GET_STUDENTS_ACTIVITY':
  return {
    ...state,
    activity: Array.isArray(action.payload?.activities)
      ? [...action.payload.activities]
      : [],
  };


    case 'CREATE_PROCTOR_INCIDENT':
    case 'GET_PROCTOR_INCIDENT':
      return {
        ...state,
        proctor: Array.isArray(action.payload)
          ? [...action.payload]
          : action.payload
          ? [action.payload]
          : [],
      };

    case 'GET_PROCTOR_ERROR':
    case 'UPDATE_ROLE_ERROR':
      return {
        ...state,
        error: action.payload ?? 'Unknown error',
      };

    default:
      return state;
  }
};
