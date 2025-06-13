import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import { useDispatch, useSelector } from 'react-redux';
import { getExamById } from '../redux/actions/examActions';
import { FaSpinner } from 'react-icons/fa';

const ExamView = () => {
    const dispatch = useDispatch();
    const { examDetails } = useSelector(state => state.exams);

    const { id } = useParams();  // Get the exam ID from the URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the exam by ID when the component mounts
        const fetchExam = async () => {
            try {
                setLoading(true);  // Set loading true when fetching starts
                setError(null);    // Clear any previous error
                await dispatch(getExamById(id));
            } catch (err) {
                setError('Failed to load exam details.');
                 console.log(err); 
            } finally {
                setLoading(false);  // Set loading to false once fetch is complete
            }
        };

        fetchExam();
    }, [dispatch, id]);

    // Show loading spinner if still fetching the data
    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-gray-500" size={24} />
                <p className="text-gray-500 ml-2">Loading...</p>
            </div>
        );
    }

    // Show error message if there was a problem fetching the data
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-red-500 mb-4">{error}</p>
                <GoBackButton />
            </div>
        );
    }

    // Show a message if the exam data is not available (undefined or null)
    if (!examDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-center mb-4">Exam details not found.</p>
                <GoBackButton />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Exam Details */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mt-8 mb-2">
                    Exam: {examDetails?.examData?.name || 'N/A'}
                </h2>
                <p className="text-gray-600 mb-2">
                    Date: {examDetails?.examData?.date ? new Date(examDetails.examData.date).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-gray-600 mb-2">
                    Duration: {examDetails?.examData?.duration || 'N/A'} minutes
                </p>
                <p className="text-gray-600 mb-2">
                    Total Marks: {examDetails?.examData?.totalMarks || 'N/A'}
                </p>
                <p className="text-gray-600 mb-2">
                    Total Questions: {examDetails?.examData?.totalQuestions || 'N/A'}
                </p>
                <p className="text-gray-600">
                    Description: {examDetails?.examData?.description || 'No description available.'}
                </p>
            </div>

            {/* Questions List */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Questions</h3>
                {examDetails?.questions && examDetails.questions.length > 0 ? (
                    examDetails.questions.map((question, index) => (
                        <div key={question._id || question.id || index} className="border-b pb-4 mb-4">
                            <p className="font-medium">
                                Q{index + 1}: {question.question}
                            </p>
                            <p className="text-gray-600 mb-2">
                                Type: {question.questionType}
                            </p>
                            {question.questionType === 'multiple-choice' && question.options && (
                                <ul className="list-disc list-inside mb-2">
                                    {question.options.map((option, idx) => (
                                        <li key={idx} className="text-gray-700">
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <p className="text-gray-600">
                                Difficulty: {question.difficulty}
                            </p>
                            <p className="text-gray-600">
                                Correct Answer: <span className="font-semibold">{question.correctAnswer}</span>
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center">Questions have not yet been assigned.</p>
                )}
                <GoBackButton />
            </div>
        </div>
    );
};

export default ExamView;