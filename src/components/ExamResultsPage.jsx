import React from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale,LinearScale,Tooltip, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaSpinner } from 'react-icons/fa';

ChartJS.register( ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExamResultsPage = ({ recentSubmissions, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin h-12 w-12 text-gray-500" />
            </div>
        );
    }

    //  Filter submissions that have at least one question
    const validSubmissions = (recentSubmissions || []).filter(
        (sub) => sub.questions && sub.questions.length > 0
    );

    if (!validSubmissions.length) {
        return <div className="text-center text-gray-500 py-12 mt-8 ">No submissions found.</div>;
    }

    return (
        <div className="container mx-auto p-6 mt-12">
            {validSubmissions.map((submission, index) => {
                const questions = submission.questions;
                const correctAnswersCount = questions.filter(q => q.isCorrect).length;
                const totalQuestions = questions.length;

                const incorrectAnswersCount = totalQuestions - correctAnswersCount;
                const scorePercentage = totalQuestions > 0
                    ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2)
                    : 0;

                const doughnutData = {
                    labels: ['Correct', 'Incorrect'],
                    datasets: [{
                        data: [correctAnswersCount, incorrectAnswersCount],
                        backgroundColor: ['#4CAF50', '#FF6384'],
                        hoverBackgroundColor: ['#45A049', '#FF6384'],
                    }]
                };

                const doughnutOptions = { maintainAspectRatio: false };

                return (
                    <div key={submission._id || index} className="mb-10">
                        <header className="bg-gray-800 text-white p-4">
                            <h1 className="text-2xl">Exam Results: {submission.examName}</h1>
                            <p className="text-sm">Submitted on: {new Date(submission.submittedAt).toLocaleString()}</p>
                        </header>

                        <div className="flex items-center justify-between p-6 bg-white shadow rounded-lg mt-4">
                            <div>
                                <h2 className="text-lg font-medium">Overall Score</h2>
                                <p className="text-3xl font-bold">{scorePercentage}%</p>
                                <p className="text-sm">
                                    Grade: {scorePercentage >= 90 ? 'A' :
                                            scorePercentage >= 75 ? 'B' :
                                            scorePercentage >= 50 ? 'C' :
                                            scorePercentage >= 36 ? 'D' : 'Fail'}
                                </p>
                            </div>
                            <div className="w-48 h-48 flex items-center justify-center">
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium">Detailed Results</h3>
                            <table className="mt-4 w-full border shadow-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Sl No</th>
                                        <th className="p-2 border">Question</th>
                                        <th className="p-2 border">Your Answer</th>
                                        <th className="p-2 border">Correct Answer</th>
                                        <th className="p-2 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((question, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2 border">{idx + 1}</td>
                                            <td className="p-2 border">{question.question}</td>
                                            <td className="p-2 border">{question.userAnswer}</td>
                                            <td className="p-2 border">{question.correctAnswer}</td>
                                            <td className={`p-2 border ${question.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                                {question.isCorrect ? 'Correct' : 'Incorrect'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium">Summary</h3>
                            <p>Your performance indicates a strong understanding of the material. However, consider reviewing topics that you found challenging.</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ExamResultsPage;
