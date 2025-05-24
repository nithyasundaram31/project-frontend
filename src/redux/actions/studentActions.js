import axios from 'axios';
import { toast } from 'react-toastify';

// Base configuration for Axios
const API = axios.create({
     baseURL: import.meta.env.VITE_BACKEND_URL || 'https://project-backend-om0o.onrender.com/api/students'
});

// Add a request interceptor
API.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem('token');

        if (token) {
            req.headers['Content-Type'] = 'application/json';
            req.headers['Authorization'] = `Bearer ${token}`;
        }
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getAllStudents = () => async (dispatch) => {
    try {
        const { data } = await API.get('/');
        dispatch({ type: 'GET_ALL_STUDENTS', payload: data });
        return data;
    } catch (error) {
        console.error('Get all students error:', error);
        toast.error('Failed to load students. Please try again.');
        dispatch({ 
            type: 'GET_ALL_STUDENTS_FAIL', 
            payload: error?.response?.data?.message || 'Failed to fetch students'
        });
        throw error;
    }
};

export const deleteStudent = (id) => async (dispatch) => {
    try {
        const { data } = await API.delete(`/${id}`);
        toast.success(data?.message || 'Student deleted successfully');
        dispatch({ type: 'DELETE_STUDENT', payload: id });
        return data;
    } catch (error) {
        console.error('Delete student error:', error);
        toast.error(error?.response?.data?.message || 'Failed to delete student. Please try again.');
        dispatch({ 
            type: 'DELETE_STUDENT_FAIL', 
            payload: error?.response?.data?.message || 'Failed to delete student'
        });
        throw error;
    }
};

export const updateExamPermission = (id, permission) => async (dispatch) => {
    try {
        const { data } = await API.put(`/permission/${id}`, { examPermission: permission });
        toast.success(data?.message || 'Permission updated successfully');
        dispatch({ type: 'UPDATE_EXAM_PERMISSION', payload: { id, permission } });
        return data;
    } catch (error) {
        console.error('Update exam permission error:', error);
        toast.error(error?.response?.data?.message || 'Failed to update permission. Please try again.');
        dispatch({ 
            type: 'UPDATE_EXAM_PERMISSION_FAIL', 
            payload: error?.response?.data?.message || 'Failed to update permission'
        });
        throw error;
    }
};

//create students activities
export const createStudentsActivity = (activityData) => async (dispatch) => {
    try {
        const { data } = await API.post('/activity', activityData);
        dispatch({ type: 'CREATE_STUDENTS_ACTIVITY', payload: data });
        return data;
    } catch (error) {
        console.error('Create student activity error:', error);
        toast.error('Failed to record activity. Please try again.');
        dispatch({ 
            type: 'CREATE_STUDENTS_ACTIVITY_FAIL', 
            payload: error?.response?.data?.message || 'Failed to create activity'
        });
        throw error;
    }
};

export const getStudentsActivity = () => async (dispatch) => {
    try {
        const { data } = await API.get('/activity');
        dispatch({ type: 'GET_STUDENTS_ACTIVITY', payload: data });
        return data;
    } catch (error) {
        console.error('Get students activity error:', error);
        toast.error('Failed to load student activities. Please try again.');
        dispatch({ 
            type: 'GET_STUDENTS_ACTIVITY_FAIL', 
            payload: error?.response?.data?.message || 'Failed to fetch activities'
        });
        throw error;
    }
};

export const createProctor = (proctorData) => async (dispatch) => {
    try {
        const { data } = await API.post('/proctor', proctorData);
        dispatch({ type: 'CREATE_PROCTOR_INCIDENT', payload: data });
        return data;
    } catch (error) {
        console.error('Create proctor incident error:', error);
        toast.error('Failed to record proctoring incident. Please try again.');
        dispatch({ 
            type: 'CREATE_PROCTOR_INCIDENT_FAIL', 
            payload: error?.response?.data?.message || 'Failed to create proctor incident'
        });
        throw error;
    }
};

export const getProctor = (id) => async (dispatch) => {
    try {
        const { data } = await API.get(`/proctor/${id}`);
        dispatch({
            type: 'GET_PROCTOR_INCIDENT', 
            payload: data.proctor
        });
        return data;
    } catch (error) {
        console.error('Get proctor incident error:', error);
        
        let errorMessage = 'Failed to load proctoring data. Please try again.';
        if (error?.response?.status === 404) {
            errorMessage = 'No proctoring data found for this exam.';
        }
        
        toast.error(error?.response?.data?.message || errorMessage);
        dispatch({ 
            type: 'GET_PROCTOR_ERROR', 
            payload: error?.response?.data || { message: errorMessage }
        });
        throw error;
    }
};

//handle role change
export const updateRole = (role, id) => async (dispatch) => {
    try {
        const response = await API.put(`/role/${id}`, role);
        toast.success(response?.data?.message || 'Role updated successfully');
        dispatch({
            type: 'UPDATE_ROLE', 
            payload: { id, role: role.role }
        });
        return response.data;
    } catch (error) {
        console.error('Update role error:', error);
        toast.error(error?.response?.data?.message || 'Failed to update role. Please try again.');
        dispatch({ 
            type: 'UPDATE_ROLE_ERROR', 
            payload: error?.response?.data || { message: 'Failed to update role' }
        });
        throw error;
    }
};