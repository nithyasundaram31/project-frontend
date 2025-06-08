import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../redux/actions/authActions';
import { FaBars, FaTimes, FaBell, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Header = (props) => {
    const { toggle, isOpen } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const dropdownRef = useRef(null);

    // Profile Navigation - use absolute path (role-based)
    const handleProfileClick = () => {
        if (user?.role) {
            navigate(`/${user.role}/dashboard/profile`);
        } else {
            navigate('/profile');
        }
        setDropdownOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setDropdownOpen(false);
    };

    // Extract initials from the logged-in user's name
    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        return nameParts.map(part => part[0]).join('').toUpperCase();
    };

    useEffect(() => {
        setUserName(getInitials(user?.name));
    }, [user]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        // <header className="col-span-full flex justify-between items-center sticky top-0 p-2 text-white bg-gradient-to-l from-green-600 to-blue-600 ">
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-2 text-white bg-gradient-to-l from-green-600 to-blue-600 shadow-md">

            {/* Hamburger Icon for mobile */}
            <div className="lg:hidden">
                <button onClick={toggle} className="p-2 focus:outline-none">
                    {isOpen ? (
                        <FaTimes className="text-2xl" />
                    ) : (
                        <FaBars className="text-2xl" />
                    )}
                </button>
            </div>

            {/* Left Logo */}
            <div
                className="flex items-center text-sm font-bold p-2 rounded cursor-pointer"
                onClick={() => {
                    if (user?.role) {
                        navigate(`/${user.role}/dashboard`);
                    } else {
                        navigate('/');
                    }
                }}
            >
                <img src={logo} alt="logo" className="mr-2 rounded" width={28} />
                <h2>Assessment Platform</h2>
            </div>

            {/* Right Profile Section */}
            {user && (
                <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center justify-evenly">
                        <span className='mr-4 cursor-pointer hover:text-lg'><FaBell /></span>
                        <span className='mr-2'> {"Hi,  " + (user?.name || '').toUpperCase()}</span>
                        <span
                            className="flex items-center justify-center w-6 h-6 bg-white font-bold text-black rounded-full z-50"
                        > {userName}</span>
                        {/* Dropdown Toggle */}
                        <span
                            className='ml-4 cursor-pointer'
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {dropdownOpen ? (
                                <FaCaretUp className="text-xl" />
                            ) : (
                                <FaCaretDown className="text-xl" />
                            )}
                        </span>
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                            <div
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={handleProfileClick}
                            >
                                My Profile
                            </div>
                            <hr />
                            <div
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={handleLogout}
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;