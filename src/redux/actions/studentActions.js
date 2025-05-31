import instance from '../../services/instance';
import { toast } from 'react-toastify';
import ErrorHandler from '../../components/ErrorHandler';

export const getAllStudents = () => async (dispatch) => {
    try {
        const { data } = await instance.get('/api/students/');
        dispatch({ type: 'GET_ALL_STUDENTS', payload: data });
    } catch (error) {
        console.error(error);
       toast.error(error?.response?.data?.message || 'Some error');
    }
};

export const deleteStudent = (id) => async (dispatch) => {
    try {
        const { data } = await instance.delete(`/api/students/${id}`);
        toast.success(data?.message || 'Deleted successfully');
        dispatch({ type: 'DELETE_STUDENT', payload: id });
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Some error');
    }
};

export const updateExamPermission = (id, permission) => async (dispatch) => {
    try {
        const { data } = await instance.put(`/api/students/permission/${id}`, { examPermission: permission });
        toast.success(data?.message || 'Permission updated successfully');
        dispatch({ type: 'UPDATE_EXAM_PERMISSION', payload: { id, permission } });
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Some error');
    }
};

// Create students activities
export const createStudentsActivity = (activityData) => async (dispatch) => {
    try {
        const { data } = await instance.post('/api/students/activity', activityData);
        dispatch({ type: 'CREATE_STUDENTS_ACTIVITY', payload: data });
    } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Some error');
    }
};

export const getStudentsActivity = () => async (dispatch) => {
    try {
        const { data } = await instance.get('/api/students/activity');
        dispatch({ type: 'GET_STUDENTS_ACTIVITY', payload: data });
    } catch (error) {
        console.error(error);
         toast.error(error?.response?.data?.message || 'Some error');
    }
};

export const createProctor = (proctorData) => async (dispatch) => {
    try {
        const { data } = await instance.post('/api/students/proctor', proctorData);
        dispatch({ type: 'CREATE_PROCTOR_INCIDENT', payload: data });
    } catch (error) {
        console.error(error);
       toast.error(error?.response?.data?.message || 'Some error');
    }
};

export const getProctor = (id) => async (dispatch) => {
    try {
        const { data } = await instance.get(`/api/students/proctor/${id}`);
        dispatch({ type: 'GET_PROCTOR_INCIDENT', payload: data.proctor });
    } catch (error) {
        dispatch({ type: 'GET_PROCTOR_ERROR', payload: error.response?.data });
        console.error(error);
      
    toast.error(error?.response?.data?.message || 'Some error');
    }
};

// Handle role change
export const updateRole = (role, id) => async (dispatch) => {
    try {
        const { data } = await instance.put(`/api/students/role/${id}`, role);
        toast.success(data?.message || 'Role updated successfully');
        dispatch({ type: 'UPDATE_ROLE', payload: { id, role: role.role } });
    } catch (error) {
        dispatch({ type: 'UPDATE_ROLE_ERROR', payload: error.response });
        console.error(error);
     
    toast.error(error?.response?.data?.message || 'Some error');
    }
};