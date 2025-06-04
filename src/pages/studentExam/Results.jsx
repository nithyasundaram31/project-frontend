import React, { useEffect, useRef, useState } from 'react'
import ExamResultsPage from '../../components/ExamResultsPage'
import { useDispatch, useSelector } from 'react-redux';
import { getSubmitted } from '../../redux/actions/submitExam';

const Results = () => {
    const { submittedData } = useSelector((state) => state.examSubmit);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const hasFetchedExams = useRef(false);

    useEffect(() => {
        const fetchExams = async () => {
            setIsLoading(true);
            try {
                await dispatch(getSubmitted());
            } catch (error) {
                console.error("Error fetching submitted exams:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        

        if (!hasFetchedExams.current) {
            fetchExams();
            hasFetchedExams.current = true;
        }
    }, [dispatch]);

    return (
        <div>
            <ExamResultsPage
                isLoading={isLoading}
                recentSubmissions={submittedData}
            />

        </div>
    )
}

export default Results