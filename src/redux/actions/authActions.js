import instance from '../../services/instance';
import { toast } from 'react-toastify';

export const register = (userData) => async (dispatch) => {
  try {
    const response = await instance.post('/api/auth/register', userData);
    toast.success(response.data?.message || 'Register successful');
    dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Registration failed');
    dispatch({ type: 'REGISTER_FAIL', payload: error?.response?.data });
    throw error;
  }
};

export const login = (userData) => async (dispatch) => {
  try {
    const response = await instance.post('/api/auth/login', userData);
    
    // Show toast only if skipToast is not true
    if (!userData.skipToast) {
      toast.success(response.data?.message || 'Login successful');
    }
    
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
    
    // Save user and token to localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
   
    if (!userData.skipToast) {
      toast.error(error?.response?.data?.message || 'Login failed');
    }
    dispatch({ type: 'LOGIN_FAIL', payload: error?.response?.data });
    throw error;
  }
};

export const logout = () => (dispatch) => {
  // Clear all localStorage items
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('submitedData');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  
  dispatch({ type: 'LOGOUT' });
  toast.success('Logout successful');
  
  return { message: 'Logout successful' };
};

export const getProfile = (id) => async (dispatch) => {
  try {
    const response = await instance.get(`/api/auth/profile/${id}`);
    dispatch({ type: 'PROFILE_GET_SUCCESS', payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: 'PROFILE_GET_FAIL', payload: error?.response?.data });
    toast.error(error?.response?.data?.error || 'Failed to fetch profile');
    throw error;
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    const response = await instance.put(`/api/auth/profile/${userData.id}`, userData);
    toast.success(response?.data?.message || 'Profile updated successfully');
    dispatch({ type: 'PROFILE_UPDATE_SUCCESS', payload: response.data });
    
    // Update localStorage user data if needed
    const updatedUser = response.data.user || response.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.error || 'Failed to update profile';
    dispatch({
      type: 'PROFILE_UPDATE_FAIL',
      payload: error?.response?.data || error.message,
    });
    toast.error(errorMessage);
    throw error;
  }
};