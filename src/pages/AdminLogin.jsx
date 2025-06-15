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

    try {
      // Call login action without showing default toast
      const res = await dispatch(login({ email, password, skipToast: true }));

      if (res?.user?.role === 'admin') {
        // Show admin-specific success message
        toast.success("Admin login successful!");

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } else if (res?.user) {

        toast.error("Only admin can login here");
      }
    } catch (error) {
      // Error is already handled in action, but show admin-specific error
      toast.error("Admin login failed. Please check your credentials.");
    }
  };

  return (
    <div className='mx-auto items-center h-screen bg-gradient-to-tr from-blue-600 to-yellow-200'>
      <div className='p-4'>
        <h2 className="text-4xl mt-8 font-bold text-center text-blue-900">
          Online Assessment Platform
        </h2>
      </div>

      <form onSubmit={handleLogin} className='bg-white mx-auto mt-10 p-8 rounded shadow-lg w-96'>
        <h2 className='text-3xl mb-6 font-bold text-center'>Admin Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
          className='w-full p-2 mb-4 border rounded'
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin Password"
          className='w-full p-2 mb-4 border rounded'
          required
        />

        <button
          type="submit"
          className='w-full bg-blue-500 text-white p-2 rounded'
        >
          Admin Login
        </button>

        <ToastContainer
        />
      </form>
    </div>
  );
};

export default AdminLogin;