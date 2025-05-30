import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { register } from '../redux/actions/authActions';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //handle register
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(register(formData));
            if (response) {
                toast.success("Registration successful! Please login.");
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } catch (error) {
            // This catches network/unexpected errors
            toast.error("Registration failed. Please try again.");
        }
    };

    return (
        <div className='flex justify-center items-center flex-col sm:flex-col md:flex-row lg:flex-row bg-gray min-h-screen'>
            <div className='p-4'>
                <h2 className="text-4xl font-bold text-blue-500">Online Assessment Platform</h2>
            </div>
            <form onSubmit={handleRegister} className='w-96 p-6 bg-white rounded'>
                <h2 className='mb-8 text-4xl font-bold text-blue-500'>Register</h2>
                <input type="text"
                    placeholder='Name'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='border border-blue-500 rounded w-full p-2 mb-4' />

                <input type="email"
                    placeholder='Email'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='border border-blue-500 rounded w-full p-2 mb-4' />

                <input type="password"
                    placeholder='Password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className='border border-blue-500 rounded w-full p-2 mb-4' />

                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className='border border-blue-500 rounded w-full p-2 mb-4'
                >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>
                <button className='bg-blue-500 border-none rounded text-white p-2 w-full'>Register</button>
                <div className='mt-4'>
                    <p>Already have an account?
                        <Link to="/login" className='ml-4 underline text-blue-500'>Login</Link>
                    </p>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Register;