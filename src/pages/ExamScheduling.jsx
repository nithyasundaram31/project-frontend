import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExam, deleteExam, getExams, updateExam } from '../redux/actions/examActions';
import { ToastContainer } from 'react-toastify';
import { formatDateToInput } from '../utils/dateUtils';
import ExamTable from '../components/ExamTable';
import { useNavigate } from 'react-router-dom';

const ExamScheduling = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hasFetchedExams = useRef(false);

    const { exams = [] } = useSelector(state => state.exams);
    const [examData, setExamData] = useState({ name: '', date: '', duration: '', totalMarks: '', totalQuestions: "", description: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [examId, setExamID] = useState("");
    const [searchQuery, setSearchQuery] = useState('');

    // Await getExams for reliable loading state
    const fetchExams = useCallback(async () => {
        try {
            setIsLoading(true);
            await dispatch(getExams());
        } catch (error) {
            console.error('Failed to fetch exams:', error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!hasFetchedExams.current) {
            fetchExams();
            hasFetchedExams.current = true;
        }
    }, [fetchExams]);

    const handleChange = (e) => {
        setExamData({ ...examData, [e.target.name]: e.target.value });
    };

    //handle view exam
    const handleView = (id) => {
        navigate(`/admin/dashboard/exams/${id}`);
    }

    // filtering editing exam
    const updateFun = (id) => {
        setExamID(id || "");
        if (exams && id) {
            const exam = exams.find((e) => e._id === id);
            if (exam) setExamData(exam);
        }
    }

    //delete the exam
    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const response = await dispatch(deleteExam(id));
            if (response) {
                await dispatch(getExams());
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
        setExamData({ name: '', date: '', duration: '', totalMarks: '', totalQuestions: "", description: "" });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (examId) {
                response = await dispatch(updateExam(examId, examData));
            } else {
                response = await dispatch(createExam(examData));
            }

            if (response) {
                await dispatch(getExams());
            }
            setExamID("");
            setExamData({ name: '', date: '', duration: '', totalMarks: '', totalQuestions: "", description: "" });
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    // Filter exams based on the search query
    const filteredExams = exams.filter((exam) => {
        return exam && exam.name && exam.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <h2 className="flex justify-center items-center text-xl text-blue-500 font-bold mb-4">Exam Management</h2>
            <form onSubmit={handleSubmit} className="mb-4 flex flex-col justify-center items-center space-y-4">
                {/* Exam Name and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-1/2 lg:w-1/2">
                    <div>
                        <label htmlFor="name" className="block text-gray-700">Exam:</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter Exam"
                            value={examData.name}
                            onChange={handleChange}
                            className="border-2 border-blue-500 rounded w-full focus:outline-none focus:ring focus:ring-blue-300 px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-gray-700">Date:</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={formatDateToInput(examData.date)}
                            onChange={handleChange}
                            className="border-2 border-blue-500 rounded w-full focus:outline-none focus:ring focus:ring-blue-300 px-3 py-2"
                            required
                        />
                    </div>
                </div>
                {/* Marks & Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-1/2 lg:w-1/2">
                    <div>
                        <label htmlFor="totalMarks" className="block text-gray-700">Total Marks:</label>
                        <input
                            type="number"
                            name="totalMarks"
                            id="totalMarks"
                            placeholder="Total Marks"
                            value={examData.totalMarks}
                            onChange={handleChange}
                            required
                            className="border-2 border-blue-500 rounded w-full focus:outline-none focus:ring focus:ring-blue-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="totalQuestions" className="block text-gray-700">Total Questions:</label>
                        <input
                            type="number"
                            name="totalQuestions"
                            id="totalQuestions"
                            placeholder="Total Questions"
                            value={examData.totalQuestions}
                            onChange={handleChange}
                            required
                            className="border-2 border-blue-500 rounded w-full focus:outline-none focus:ring focus:ring-blue-300 px-3 py-2"
                        />
                    </div>
                </div>
                {/* Duration */}
                <div className="w-full md:w-1/2 lg:w-1/2">
                    <label htmlFor="duration" className="block text-gray-700">Duration:</label>
                    <input
                        id="duration"
                        type="number"
                        name="duration"
                        placeholder="Duration (minutes)"
                        value={examData.duration}
                        onChange={handleChange}
                        className="border-2 border-blue-500 rounded w-full focus:outline-none focus:ring focus:ring-blue-300 px-3 py-2 h-12"
                        required
                    />
                </div>
                {/* Description */}
                <div className="w-full md:w-1/2 lg:w-1/2">
                    <label htmlFor="examDescription" className="block text-gray-700">Description:</label>
                    <textarea
                        name="description"
                        id="examDescription"
                        placeholder="Description"
                        value={examData.description}
                        onChange={handleChange}
                        required
                        className="border-2 border-blue-500 rounded w-full focus:outline-none focus:ring focus:ring-blue-300 px-3 py-2 h-16 resize-none"
                    />
                </div>
                <button type="submit" className="rounded bg-blue-500 text-white p-2 w-full md:w-1/2 lg:w-1/2">
                    {examId ? "Update Exam" : "Schedule Exam"}
                </button>
            </form>
            <hr />
            <div className="flex items-center justify-between w-full mb-2 p-3">
                <h2 className="text-xl font-bold ml-4">Scheduled Exams:</h2>
                <div className="flex flex-col justify-center w-1/3 mr-4">
                    <input
                        type="text"
                        placeholder="Search exams by name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border p-2 rounded border-blue-500"
                    />
                </div>
            </div>
            <ExamTable
                exams={filteredExams}
                isLoading={isLoading}
                onView={handleView}
                onDelete={handleDelete}
                onEdit={updateFun}
            />
        </div>
    );
};

export default ExamScheduling;