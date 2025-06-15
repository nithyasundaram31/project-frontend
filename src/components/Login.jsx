import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { login } from '../redux/actions/authActions';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        
        const formData = { email, password, isStudent: true };
        
        try {
            const response = await dispatch(login(formData));
            
            if (response && response.user) {
                // Store additional data in localStorage
                if (response.token) localStorage.setItem('token', response.token);
                if (response.user.role) localStorage.setItem('userType', response.user.role);
                if (response.user.id || response.user._id) {
                    localStorage.setItem('userId', response.user.id || response.user._id);
                }

                //  toast message  already in action
                // toast.success("Login successful!");
                
                setTimeout(() => {
                    if (response.user.role === 'student') {
                        navigate('/student/dashboard');
                    } else if (response.user.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/');
                    }
                }, 1500); // Increased timeout to see the toast message
            }
        } catch (error) {
            console.error('Login error:', error);
            // Error toast is already handled in the action
        }
    };

    return (
        <div className='flex justify-center items-center flex-col min-h-screen bg-gradient-to-tr from-blue-300 to-pink-300 px-4'>
            <div className='p-4'>
                <h2 className="text-3xl md:text-4xl text-center font-bold text-indigo-800">
                    Online Assessment Platform
                </h2>
            </div>

            <form onSubmit={handleLogin} className='mt-6 w-96 mb-10 p-6 border-1 bg-white bg-opacity-30 rounded'>
                <h2 className='mb-8 text-4xl font-bold text-gray-800'>Login</h2>

                <input
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='border border-blue-500 rounded w-full p-2 mb-4'
                    required
                />

                <input
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='border border-blue-500 rounded w-full p-2 mb-4'
                    required
                />

                <button 
                    className='bg-blue-500 border-none rounded text-white p-2 w-full' 
                    type="submit"
                >
                    Login
                </button>

                {/* register link */}
                <div className='mt-4'>
                    <p>Don't have an account?
                        <Link to="/register" className='ml-4 underline font-bold text-indigo-800'>
                            Register
                        </Link>
                    </p>
                </div>

                {/* New Admin Login link */}
                <div className='mt-2'>
                    <p>Are you an Admin?
                        <Link to="/admin/login" className='ml-2 underline text-red-700 font-semibold'>
                            Admin Login
                        </Link>
                    </p>
                </div>
            </form>

            <ToastContainer/>
        </div>
    );
};

export default Login;