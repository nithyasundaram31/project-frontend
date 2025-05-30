import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamById } from '../../redux/actions/examActions';
import GoBackButton from '../../components/GoBackButton';
import { submitExam } from '../../redux/actions/submitExam';
import { createProctor, createStudentsActivity } from '../../redux/actions/studentActions';

const ExamInterface = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hasFetchedExams = useRef(false);

    const { id } = useParams();
    const { examDetails } = useSelector(state => state.exams);
    const { examData = {}, questions = [] } = examDetails || {};
    const { user } = useSelector((state) => state.auth);

    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const webcamRef = useRef(null);
    const [warningCount, setWarningCount] = useState(0);
    const [examStatus, setExamStatus] = useState('started');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get exam details and set loading
    useEffect(() => {
        const fetchExam = async () => {
            setLoading(true);
            try {
                await dispatch(getExamById(id));
            } catch (err) {
                setError('Failed to fetch exam. Please try again.');
            }
            setLoading(false);
        };
        if (!hasFetchedExams.current) {
            fetchExam();
            hasFetchedExams.current = true;
        }
    }, [dispatch, id]);

    // When examData loads, initialize exam
    useEffect(() => {
        const initializeExam = async () => {
            if (!examData.duration) return;
            setTimeLeft(examData.duration * 60);

            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (err) {
                setError('Cannot access camera. Please allow webcam permissions.');
                return;
            }
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                setError('Fullscreen permission denied. Please allow fullscreen.');
            }
        };
        if (examData && examData.duration) {
            initializeExam();
        }
    }, [examData]);

    // Timer countdown logic
    useEffect(() => {
        if (examStatus === 'started' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && examStatus === 'started') {
            submitExams();
        }
    }, [timeLeft, examStatus]); // submitExams will be redeclared below

    // Submit exam logic
    const submitExams = useCallback(async () => {
        try {
            if (!user || !examData) return;
            setExamStatus('submitted');
            await dispatch(submitExam({ examId: id, answers, warningCount }));
            // Typo fixed: activityType
            await dispatch(createStudentsActivity({
                activityType: "submitted exam",
                examId: id,
                exam: examData.name,
                name: user.name,
                email: user.email,
                userId: user.id
            }));
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        } catch (error) {
            toast.error('Failed to submit exam.');
            setError('Failed to submit exam.');
        }
    }, [warningCount, id, examData, user, answers, dispatch]);

    // Suspicious activity (fullscreen exit, etc)
    const handleSuspiciousActivity = useCallback(async (type) => {
        try {
            if (!user || !examData) return;
            await dispatch(createProctor({
                type,
                timestamp: new Date(),
                examId: id,
                exam: examData.name,
                name: user.name,
                email: user.email,
                userId: user.id
            }));
            toast.warn(type);
            setWarningCount(prev => {
                const newCount = prev + 1;
                if (newCount >= 3) {
                    submitExams();
                }
                return newCount;
            });
        } catch (error) {
            toast.error('Proctoring error');
        }
    }, [id, examData, user, dispatch, submitExams]);

    // Monitor fullscreen
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && examStatus === 'started') {
                handleSuspiciousActivity("Left fullscreen mode");
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [examStatus, handleSuspiciousActivity]);

    // Screenshot proctoring every 30s
    useEffect(() => {
        if (examStatus === 'started') {
            const monitoring = setInterval(async () => {
                try {
                    const fullWindowScreenshot = await html2canvas(document.body).then(c => c.toDataURL("image/png"));
                    if (fullWindowScreenshot && user && examData) {
                        await dispatch(createProctor({
                            type: 'suspicious',
                            screenshot: fullWindowScreenshot,
                            timestamp: new Date(),
                            tabFocused: document.hasFocus(),
                            examId: id,
                            exam: examData.name,
                            name: user.name,
                            email: user.email,
                            userId: user.id
                        }));
                    }
                } catch (e) {
                    // ignore screenshot error
                }
            }, 30000);
            return () => clearInterval(monitoring);
        }
    }, [examStatus, dispatch, examData, user, id]);

    // Handle answer update
    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    // Exit fullscreen and go back
    const existFullscreen = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen().finally(() => navigate(-1));
        } else {
            navigate(-1);
        }
    }, [navigate]);

    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">{error}</p>
                <GoBackButton onClick={existFullscreen} />
            </div>
        );
    }

    if (loading || !examData.name) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading exam...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {examStatus === 'started' && (
                <div className="flex flex-col items-center">
                    <div className="fixed top-4 right-4 bg-white p-4 rounded shadow">
                        <div className="text-xl font-bold">
                            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-red-600">
                            Warnings: {warningCount}/3
                        </div>
                    </div>

                    {/* Webcam can be shown or hidden as per your proctoring policy */}
                    <div className="fixed top-4 left-4 w-48 opacity-20 pointer-events-none">
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            className="w-full rounded"
                        />
                    </div>

                    <div className="max-w-3xl mx-auto mt-20 bg-white p-6 rounded shadow">
                        <h1 className="text-2xl font-bold mb-6">{examData.name}</h1>
                        {questions.map((question, index) => (
                            <div key={question._id} className="mb-8">
                                <p className="font-semibold mb-4">
                                    {index + 1}. {question.question}
                                </p>
                                {question.questionType === "multiple-choice" ? (
                                    <div className="space-y-2">
                                        {question.options.map((option, optIndex) => (
                                            <label key={optIndex} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name={`question-${question._id}`}
                                                    value={option}
                                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                                    checked={answers[question._id] === option}
                                                    className="form-radio"
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                        <hr />
                                    </div>
                                ) : question.questionType === "true-false" ? (
                                    <div className="space-y-2">
                                        {['True', 'False'].map((option) => (
                                            <label key={option} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name={`question-${question._id}`}
                                                    value={option}
                                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                                    checked={answers[question._id] === option}
                                                    className="form-radio"
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                        <hr />
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        rows={4}
                                        value={answers[question._id] || ''}
                                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                        placeholder="Enter your answer here..."
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            onClick={submitExams}
                            className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 mb-8"
                        >
                            Submit Exam
                        </button>
                    </div>
                </div>
            )}

            {examStatus === 'submitted' && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-4">Exam Submitted Successfully</h2>
                        <p>Thank you for completing the exam.</p>
                    </div>
                    <GoBackButton path={"/student/dashboard/exams"} />
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ExamInterface;