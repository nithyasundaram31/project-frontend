import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQuestion, getQuestions, updateQuestion, deleteQuestion } from '../redux/actions/questionActions';
import { getExams } from '../redux/actions/examActions';
import QuestionTable from '../components/QuestionTable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionBank = () => {
    const dispatch = useDispatch();
    const hasFetchedExams = useRef(false);

    const { questions = [] } = useSelector(state => state.question);
    const { exams = [] } = useSelector(state => state.exams);

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        difficulty: '',
        exam: '',
        questionType: '',
        examId: ""
    });
    const [editing, setEditing] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("");
    const [examType, setExamType] = useState("");
    const [filteredQuestions, setFilteredQuestions] = useState(questions);

    // Fetch exams and questions
    const fetchExams = useCallback(async () => {
        try {
            setIsLoading(true);
            await dispatch(getExams());
            await dispatch(getQuestions());
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

    useEffect(() => {
        setFilteredQuestions(questions);
    }, [questions]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('option')) {
            const index = Number(name.split('_')[1]);
            setFormData(prev => {
                const newOptions = [...prev.options];
                newOptions[index] = value;
                return { ...prev, options: newOptions };
            });
        } else if (name === "exam") {
            // Set exam name and examId
            const selectedOption = e.target.options[e.target.selectedIndex];
            const id = selectedOption?.id;
            setFormData(prev => ({
                ...prev,
                [name]: value,
                ...(id && { examId: id })
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle question type change
    const handleQuestionTypeChange = (e) => {
        setFormData(prev => ({
            ...prev,
            questionType: e.target.value,
            options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : ['', ''],
            correctAnswer: ''
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editing) {
                await dispatch(updateQuestion(editing, formData));
                setEditing(null);
            } else {
                await dispatch(createQuestion(formData));
            }
            await dispatch(getQuestions());
            setFormData({ question: '', options: ['', '', '', ''], correctAnswer: '', difficulty: '', exam: '', questionType: '', examId: "" });
        } catch (error) {
            console.error('Error submitting question:', error);
        }
        setIsLoading(false);
    };

    // Handle search and filters
    const filterQuestions = (search, type, difficulty, exam) => {
        const filtered = questions.filter((question) => {
            const matchesSearch = question.question.toLowerCase().includes(search.toLowerCase());
            const matchesType = type ? question.questionType === type : true;
            const matchesDifficulty = difficulty ? question.difficulty === difficulty : true;
            const matchesExam = exam ? question.exam === exam : true;
            return matchesSearch && matchesType && matchesDifficulty && matchesExam;
        });
        setFilteredQuestions(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        filterQuestions(e.target.value, questionType, difficultyLevel, examType);
    };
    const handleTypeChange = (e) => {
        setQuestionType(e.target.value);
        filterQuestions(searchQuery, e.target.value, difficultyLevel, examType);
    };
    const handleDifficultyChange = (e) => {
        setDifficultyLevel(e.target.value);
        filterQuestions(searchQuery, questionType, e.target.value, examType);
    };
    const handleExamChange = (e) => {
        setExamType(e.target.value);
        filterQuestions(searchQuery, questionType, difficultyLevel, e.target.value);
    };

    // Handle for edit the question
    const handleEdit = (question) => {
        setEditing(question._id);
        setFormData({
            ...question,
            options: question.options && question.options.length > 0
                ? question.options
                : ['', '', '', '']
        });
    };

    // Handle for delete
    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await dispatch(deleteQuestion(id));
            await dispatch(getQuestions());
        } catch (error) {
            console.error('Error deleting question:', error);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6 ">
            <ToastContainer />
            <h1 className="mb-4 text-center text-xl text-blue-500 font-bold">Question Bank</h1>
            <form
                onSubmit={handleSubmit}
                className="mb-6 flex flex-col items-center"
            >
                <input
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="Question"
                    required
                    className="border p-2 mb-4 w-3/4 md:w-1/2 lg:w-1/2 border-blue-500 rounded"
                />

                <div className="mb-4 w-3/4 md:w-1/2">
                    <label htmlFor="questionType" className="block text-gray-700">
                        Type:
                    </label>
                    <select
                        id="questionType"
                        name="questionType"
                        onChange={handleQuestionTypeChange}
                        value={formData.questionType}
                        className="mt-1 block w-full p-1 bg-white border border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Question Type</option>
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                    </select>
                </div>

                {formData.questionType === 'multiple-choice' && (
                    <>
                        <div className="flex flex-wrap mb-4 w-3/4 md:w-1/2">
                            {formData.options.map((option, index) => (
                                <input
                                    key={index}
                                    name={`option_${index}`}
                                    value={option}
                                    onChange={handleChange}
                                    placeholder={`Option ${index + 1}`}
                                    required
                                    className="border p-2 mb-2 w-full border-blue-500 rounded"
                                />
                            ))}
                        </div>
                        <input
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            placeholder="Correct Option (index or value)"
                            required
                            className="border p-2 mb-4 w-1/2 border-blue-500 rounded"
                        />
                    </>
                )}

                {formData.questionType === 'true-false' && (
                    <div className="mb-4">
                        <label className="block text-gray-700">Correct Answer:</label>
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="correctAnswer"
                                value="true"
                                checked={formData.correctAnswer === 'true'}
                                onChange={handleChange}
                            />
                            True
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="correctAnswer"
                                value="false"
                                checked={formData.correctAnswer === 'false'}
                                onChange={handleChange}
                            />
                            False
                        </label>
                    </div>
                )}

                <div className="mb-4 w-3/4 md:w-1/2">
                    <label htmlFor="difficulty-select" className="block text-gray-700">
                        Level:
                    </label>
                    <select
                        id="difficulty-select"
                        name="difficulty"
                        onChange={handleChange}
                        value={formData.difficulty}
                        className="mt-1 block w-full p-2 bg-white border border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Difficulty Level</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div className="mb-4 w-3/4 md:w-1/2">
                    <label htmlFor="exam-select" className="block text-gray-700">
                        Exam:
                    </label>
                    <select
                        id="exam-select"
                        name="exam"
                        onChange={handleChange}
                        value={formData.exam}
                        className="mt-1 block w-full p-2 bg-white border border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select an Exam</option>
                        {exams.map((exam) => (
                            <option key={exam._id} value={exam.name} id={exam._id}>
                                {exam.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 rounded text-white p-2 w-3/4 md:w-1/2">
                    {editing ? 'Update' : 'Add'} Question
                </button>
            </form>
            <hr />
            <div className="flex flex-col md:flex-row items-center justify-between w-full p-2">
                <div className="ml-4 flex-grow">
                    <h2 className="text-xl font-bold mb-4 md:mb-0">Questions :</h2>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-end w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                    <select
                        value={questionType}
                        onChange={handleTypeChange}
                        className="border p-1 rounded border-blue-500 w-3/4"
                    >
                        <option value="">All Types</option>
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                    </select>
                    <select
                        value={difficultyLevel}
                        onChange={handleDifficultyChange}
                        className="border p-1 rounded border-blue-500 w-3/4"
                    >
                        <option value="">All Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <select
                        value={examType}
                        onChange={handleExamChange}
                        className="border p-1 rounded border-blue-500 w-3/4"
                    >
                        <option value="">All Exams</option>
                        {exams.map((exam) => (
                            <option key={exam._id} value={exam.name} id={exam._id}>
                                {exam.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex flex-col justify-center w-3/4 md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search questions by name..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border p-1 rounded border-blue-500"
                        />
                    </div>
                </div>
            </div>
            <QuestionTable
                questions={filteredQuestions}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default QuestionBank;