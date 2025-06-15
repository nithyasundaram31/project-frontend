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
    return null;
  }
};


export const login = (userData) => async (dispatch) => {
  try {
    const response = await instance.post('/api/auth/login', userData);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Login failed');
    dispatch({ type: 'LOGIN_FAIL', payload: error?.response?.data });
    return null;
  }
};


export const logout = () => (dispatch) => {
  toast.success('Logout successful');
  setTimeout(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('submitedData');
    dispatch({ type: 'LOGOUT' });
  }, 300);
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
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    const response = await instance.put(`/api/auth/profile/${userData.id}`, userData);
    toast.success(response?.data?.message || 'Profile updated successfully');
    dispatch({ type: 'PROFILE_UPDATE_SUCCESS', payload: response.data });
    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.error || 'Failed to update profile';
    dispatch({
      type: 'PROFILE_UPDATE_FAIL',
      payload: error?.response?.data || error.message,
    });
    toast.error(errorMessage);
  }
};