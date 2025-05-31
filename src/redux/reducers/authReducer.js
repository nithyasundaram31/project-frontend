// Fixed authReducer.js - localStorage values-ஐ initial state-ல load பண்ணுது

// Helper function to safely parse JSON
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

// Initial state with localStorage values
const initialState = {
  isAuthenticated: !!localStorage.getItem('token'), // token இருந்தா true, இல்லனா false
  user: getStoredUser(), // localStorage-ல இருந்து user data எடுக்குது
  token: localStorage.getItem('token') || null,
  error: null,
  userData: []
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { 
        ...state, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token || state.token,
        error: null 
      };
      
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: action.payload 
      };
      
    case 'PROFILE_GET_SUCCESS':
      return { 
        ...state, 
        isAuthenticated: true, 
        userData: action.payload, 
        user: action.payload,
        error: null
      };
      
    case 'PROFILE_GET_FAIL':
      return { 
        ...state, 
        error: action.payload 
      };
      
    case 'PROFILE_UPDATE_SUCCESS':
      // Update both user and userData, also update localStorage
      const updatedUser = action.payload;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { 
        ...state, 
        isAuthenticated: true, 
        userData: updatedUser, 
        user: updatedUser,
        error: null
      };
      
    case 'PROFILE_UPDATE_FAIL':
      return { 
        ...state, 
        error: action.payload 
      };
      
    case 'LOGOUT':
      // Clear localStorage on logout
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        error: null, 
        userData: [] 
      };
      
    default:
      return state;
  }
};

export default authReducer;