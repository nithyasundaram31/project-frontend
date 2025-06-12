
import instance from '../../services/instance';
import { toast } from 'react-toastify';

// Helper for error handling
const handleError = (error, dispatch, failType = null) => {
    const message = error?.response?.data?.message || error.message || 'Some error';
    toast.error(message);
    if (failType) {
        dispatch({ type: failType, payload: message });
    }
};

// Get all students
export const getAllStudents = () => async (dispatch) => {
    try {
        const { data } = await instance.get('/api/students/');
        dispatch({ type: 'GET_ALL_STUDENTS', payload: data });
    } catch (error) {
        handleError(error, dispatch, 'GET_ALL_STUDENTS_FAIL');
    }
};

// Delete a student
export const deleteStudent = (id) => async (dispatch) => {
    try {
        const { data } = await instance.delete(`/api/students/${id}`);
        toast.success(data?.message || 'Deleted successfully');
        dispatch({ type: 'DELETE_STUDENT', payload: id });
    } catch (error) {
        handleError(error, dispatch, 'DELETE_STUDENT_FAIL');
    }
};

// Update exam permission
export const updateExamPermission = (id, permission) => async (dispatch) => {
    try {
        const { data } = await instance.put(`/api/students/permission/${id}`, { examPermission: permission });
        toast.success(data?.message || 'Permission updated successfully');
        dispatch({ type: 'UPDATE_EXAM_PERMISSION', payload: { id, permission } });
    } catch (error) {
        handleError(error, dispatch, 'UPDATE_EXAM_PERMISSION_FAIL');
    }
};

// Create student activity
export const createStudentsActivity = (activityData) => async (dispatch) => {
    try {
        const { data } = await instance.post('/api/students/activity', activityData);
        dispatch({ type: 'CREATE_STUDENTS_ACTIVITY', payload: data });
    } catch (error) {
        handleError(error, dispatch, 'CREATE_STUDENTS_ACTIVITY_FAIL');
    }
};

// Get student activity
export const getStudentsActivity = () => async (dispatch) => {
    try {
        const { data } = await instance.get('/api/students/activity');
        dispatch({ type: 'GET_STUDENTS_ACTIVITY', payload: data });
    } catch (error) {
        handleError(error, dispatch, 'GET_STUDENTS_ACTIVITY_FAIL');
    }
};

// Create proctor incident
export const createProctor = (proctorData) => async (dispatch) => {
    try {
        const { data } = await instance.post('/api/students/proctor', proctorData);
        dispatch({ type: 'CREATE_PROCTOR_INCIDENT', payload: data });
    } catch (error) {
        handleError(error, dispatch, 'CREATE_PROCTOR_FAIL');
    }
};

// Get proctor incident
export const getProctor = (id) => async (dispatch) => {
    try {
        const { data } = await instance.get(`/api/students/proctor/${id}`);
        dispatch({ type: 'GET_PROCTOR_INCIDENT', payload: data?.proctor || [] });
    } catch (error) {
        handleError(error, dispatch, 'GET_PROCTOR_ERROR');
    }
};

// Update student role
export const updateRole = (role, id) => async (dispatch) => {
    try {
        const { data } = await instance.put(`/api/students/role/${id}`, role);
        toast.success(data?.message || 'Role updated successfully');
        dispatch({ type: 'UPDATE_ROLE', payload: { id, role: role.role } });
    } catch (error) {
        handleError(error, dispatch, 'UPDATE_ROLE_ERROR');
    }
};