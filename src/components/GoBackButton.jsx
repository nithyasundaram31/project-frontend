import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';

const GoBackButton = ({ path, onClick }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (onClick) {
            onClick();
        } else {
            // If 'path' is given, navigate to it. If not, go back one page.
            if (path) {
                navigate(path);
            } else {
                navigate(-1);
            }
        }
    };

    return (
        <button
            onClick={handleGoBack}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            type="button"
        >
            <FaArrowAltCircleLeft className="mr-2" />
            Go Back
        </button>
    );
};

GoBackButton.propTypes = {
    path: PropTypes.string,
    onClick: PropTypes.func,
};

export default GoBackButton;