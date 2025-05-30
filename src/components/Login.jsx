import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { login } from '../redux/actions/authActions';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = { email: email, password: password };
        try {
            const response = await dispatch(login(formData));
            if (response && response.user) {
                // You already store user/token in localStorage inside authActions/login
                // No need to duplicate here, but keeping for safety:
                localStorage.setItem('token', response.token);
                localStorage.setItem('userType', response.user.role);
                localStorage.setItem('userId', response.user.id);

                toast.success("Login successful!");
                setTimeout(() => {
                    if (response.user.role === 'student') {
                        navigate('/student/dashboard');
                    } else if (response.user.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/'); // fallback
                    }
                }, 1000);
            } else {
                toast.error("Invalid credentials. Please try again.");
            }
        } catch (error) {
            // This will catch errors thrown in authActions/login
            toast.error("Login failed, please try again.");
        }
    };

    return (
        <div className='flex justify-center items-center flex-col sm:flex-col md:flex-row lg:flex-row bg-gray min-h-screen'>
            <div className='p-4'>
                <h2 className="text-4xl font-bold text-blue-500">Online Assessment Platform</h2>
            </div>
            <form onSubmit={handleLogin} className='w-96 p-6 bg-white rounded'>
                <h2 className='mb-8 text-4xl font-bold text-blue-500'>Login</h2>
                <input type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='border border-blue-500 rounded w-full p-2 mb-4' />
                <input type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='border border-blue-500 rounded w-full p-2 mb-4' />
                <button className='bg-blue-500 border-none rounded text-white p-2 w-full'>Login</button>
                <div className='mt-4'>
                    <p>Don't have an account?
                        <Link to="/register" className='ml-4 underline text-blue-500'>Register</Link>
                    </p>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;