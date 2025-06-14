import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    const { id } = useParams();

    const { examDetails } = useSelector(state => state.exams);
    const { examData, questions, isSubmitted } = examDetails || {};
    const { user } = useSelector((state) => state.auth);

    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [warningCount, setWarningCount] = useState(0);
    const [examStatus, setExamStatus] = useState('loading');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const warningLockRef = useRef(false);
    const examInitializedRef = useRef(false);
    const submitLockRef = useRef(false);

    // Block browser back button when exam is active
    useEffect(() => {
        const handlePopState = (event) => {
            if (examStatus === 'started' && !isSubmitting) {
                event.preventDefault();
                window.history.pushState(null, '', window.location.pathname);
                toast.warning('Cannot go back during exam!');
                return false;
            }
        };

        if (examStatus === 'started') {
            window.history.pushState(null, '', window.location.pathname);
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [examStatus, isSubmitting]);

    const initializeExam = useCallback(async () => {
        if (examInitializedRef.current) return;

        try {
            let duration = examData.duration;
            setTimeLeft(duration * 60);
            setInitializing(true);
            await Promise.all([
                navigator.mediaDevices.getUserMedia({ video: true }),
                document.documentElement.requestFullscreen()
            ]);
            setInitializing(false);
            setExamStatus('started');
            examInitializedRef.current = true;
        } catch (error) {
            console.error('Failed to initialize exam:', error);
            setError('Failed to initialize exam. Please ensure camera access and try again.');
        }
    }, [examData]);

    // Load exam data
    useEffect(() => {
        const loadExam = async () => {
            try {
                setLoading(true);
                setError(null);
                await dispatch(getExamById(id));
            } catch (error) {
                setError('Failed to load exam');
                console.error('Error loading exam:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadExam();
        }
    }, [dispatch, id]);


    useEffect(() => {
        const checkExamStatus = async () => {
            if (!examData || loading) return;

            // Check if exam is already submitted
            if (isSubmitted) {
                setExamStatus('submitted');

                setTimeout(() => {
                    navigate('/student/dashboard/exams', { replace: true });
                }, 2000);
                return;
            }


            if (examStatus === 'loading' && !examInitializedRef.current) {
                await initializeExam();
            }
        };

        checkExamStatus();
    }, [examData, isSubmitted, examStatus, loading, initializeExam, navigate]);

    const submitExams = useCallback(async (currentWarningCount = warningCount) => {
        // check with ref to prevent  conditions
        if (submitLockRef.current || isSubmitting || examStatus === 'submitted') return;

        // Lock immediately to prevent duplicate calls
        submitLockRef.current = true;
        setExamStatus('submitted');
        setIsSubmitting(true);

        try {
            const submitData = {
                examId: id,
                answers,
                warningCount: currentWarningCount,
                userId: user?.id || user?._id
            };

            await dispatch(submitExam(submitData));
            await dispatch(createStudentsActivity({
                activityType: "submitted exam",
                examId: id,
                exam: examData.name,
                name: user.name,
                email: user.email,
                userId: user.id
            }));

            // Exit fullscreen
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }

            // Clear answers from state
            setAnswers({});

            // Redirect after 3 seconds with replace to prevent back navigation
            setTimeout(() => {
                navigate('/student/dashboard/exams', { replace: true });
            }, 3000);

        } catch (error) {
            console.error('Failed to submit exam:', error);
            toast.error('Failed to submit exam. Please try again.');
            // Reset status only on error
            setExamStatus('started');
            setIsSubmitting(false);
            submitLockRef.current = false;
        }
    }, [warningCount, id, examData, user, answers, dispatch, isSubmitting, examStatus, navigate]);

    useEffect(() => {
        if (examStatus === 'started' && timeLeft > 0 && !isSubmitting) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        submitExams();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, examStatus, submitExams, isSubmitting]);

    const handleSuspiciousActivity = useCallback(async (type) => {
        if (initializing || warningLockRef.current || examStatus !== 'started') return;
        warningLockRef.current = true;

        try {
            await dispatch(createProctor({
                type,
                timestamp: new Date(),
                examId: id,
                exam: examData?.name,
                name: user?.name,
                email: user?.email,
                userId: user?.id,
                tabFocused: false
            }));
        } catch (err) {
            console.error('Proctor saving failed:', err);
        }

        toast.warning(`Warning: ${type}`, { position: "top-right" });

        setWarningCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
                toast.error("Maximum warnings reached. Submitting exam...");
                setTimeout(() => submitExams(newCount), 1000);
            }
            return newCount;
        });

        setTimeout(() => { warningLockRef.current = false; }, 1500);
    }, [id, examData, user, dispatch, submitExams, initializing, examStatus]);

    useEffect(() => {
        const fullscreenHandler = () => {
            if (!document.fullscreenElement && examStatus === 'started' && !isSubmitting) {
                handleSuspiciousActivity("Left Fullscreen Mode");
            }
        };
        document.addEventListener('fullscreenchange', fullscreenHandler);
        return () => document.removeEventListener('fullscreenchange', fullscreenHandler);
    }, [handleSuspiciousActivity, examStatus, isSubmitting]);

    useEffect(() => {
        const visibilityHandler = () => {
            if (document.hidden && examStatus === 'started' && !isSubmitting) {
                handleSuspiciousActivity("Switched Tab");
            }
        };
        document.addEventListener('visibilitychange', visibilityHandler);
        return () => document.removeEventListener('visibilitychange', visibilityHandler);
    }, [handleSuspiciousActivity, examStatus, isSubmitting]);

    useEffect(() => {
        const blurHandler = () => {
            if (examStatus === 'started' && !isSubmitting) {
                handleSuspiciousActivity("Lost Window Focus");
            }
        };
        window.addEventListener('blur', blurHandler);
        return () => window.removeEventListener('blur', blurHandler);
    }, [handleSuspiciousActivity, examStatus, isSubmitting]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <GoBackButton path="/student/dashboard/exams" />
                </div>
            </div>
        );
    }

    // Show loading state
    if (loading || !examData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
                    <p>Loading exam...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 mt-10">
            <ToastContainer />

            {examStatus === 'started' && (
                <div className="flex flex-col items-center">
                    <div className="fixed top-14 right-4 bg-white p-4 rounded shadow z-50">
                        <div className="text-xl font-bold">
                            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-red-600">
                            Warnings: {warningCount}/3
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto mt-20 bg-white p-6 rounded shadow">
                        <h1 className="text-2xl font-bold mb-6">{examData.name}</h1>

                        {questions && questions.map((question, index) => (
                            <div key={question.id} className="mb-8">
                                <p className="font-semibold mb-4">
                                    {index + 1}. {question.question}
                                </p>

                                {question.questionType === "multiple-choice" ? (
                                    <div className="space-y-2">
                                        {question.options.map((option, optIndex) => (
                                            <label key={optIndex} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value={option}
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    checked={answers[question.id] === option}
                                                    className="form-radio"
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : question.questionType === "true-false" ? (
                                    <div className="space-y-2">
                                        {['True', 'False'].map((option) => (
                                            <label key={option} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value={option}
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    checked={answers[question.id] === option}
                                                    className="form-radio"
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        rows={4}
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder="Enter your answer here..."
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            onClick={() => submitExams()}
                            disabled={isSubmitting}
                            className={`px-8 py-3 rounded mb-8 text-white ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                        </button>
                    </div>
                </div>
            )}
            {examStatus === 'submitted' && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="text-center mb-6 bg-white p-8 rounded-lg shadow-lg">
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold mb-4 text-green-600">Exam Submitted Successfully!</h2>
                        <p className="text-gray-600 mb-4">Thank you for completing the exam.</p>
                        <p className="text-sm text-gray-500">Redirecting to exams page...</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ExamInterface;  

