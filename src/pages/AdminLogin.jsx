import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/authActions';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await dispatch(login({ email, password }));
    if (res?.user?.role === 'admin') {
      navigate("/admin/dashboard");
    } else {
      toast.error("Only admin can login here");
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-tr from-orange-400 to-blue-300'>
      <form onSubmit={handleLogin} className='bg-white p-8 rounded shadow-lg w-96'>
        <h2 className='text-2xl mb-6 text-center'>Admin Login</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" className='w-full p-2 mb-4 border rounded' />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" className='w-full p-2 mb-4 border rounded' />
        <button className='w-full bg-blue-500 text-white p-2 rounded'>Login</button>
         <ToastContainer />
      </form>
    </div>
  );
};

export default AdminLogin;
