import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQuestion, getQuestions, updateQuestion, deleteQuestion } from '../redux/actions/questionActions';
import { getExams } from '../redux/actions/examActions';
import QuestionTable from '../components/QuestionTable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionBank = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  const { questions } = useSelector(state => state.question);
  const { exams } = useSelector(state => state.exams);

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: '',
    exam: '',
    questionType: '',
  });
  const [editing, setEditing] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    difficulty: '',
    exam: '',
  });

  const fetchData = useCallback(() => {
    setIsLoading(true);
    Promise.all([dispatch(getExams()), dispatch(getQuestions())])
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [fetchData]);

  useEffect(() => {
    filterQuestions();
  }, [questions, filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('option_')) {
      const index = Number(name.split('_')[1]);
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData(prev => ({ ...prev, options: newOptions }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQuestionTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      questionType: type,
      options: type === 'multiple-choice' ? ['', '', '', ''] : [],
      correctAnswer: ''
    }));
  };

  const validateForm = () => {
    const { question, questionType, options, correctAnswer, difficulty, exam } = formData;

    if (!question.trim() || !questionType || !difficulty || !exam || !correctAnswer) {
      alert('Please fill all required fields');
      return false;
    }

    if (questionType === 'multiple-choice') {
      const validOptions = options.filter(o => o.trim());
      if (validOptions.length < 2) {
        alert('At least 2 options required');
        return false;
      }
      if (!options.includes(correctAnswer)) {
        alert('Correct answer must match one of the options');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data = {
        ...formData,
        options: formData.questionType === 'multiple-choice'
          ? formData.options.filter(opt => opt.trim())
          : []
      };

      editing
        ? await dispatch(updateQuestion(editing, data))
        : await dispatch(createQuestion(data));

      await dispatch(getQuestions());

      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        difficulty: '',
        exam: '',
        questionType: '',
      });
      setEditing(null);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (question) => {
    setEditing(question._id);
    setFormData({
      ...question,
      options: question.questionType === 'multiple-choice'
        ? [...question.options, '', '', '', ''].slice(0, 4)
        : []
    });
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    await dispatch(deleteQuestion(id));
    await dispatch(getQuestions());
    setIsLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filterQuestions = () => {
    const { search, type, difficulty, exam } = filters;

    const filtered = questions.filter(q => {
      const matchSearch = q.question.toLowerCase().includes(search.toLowerCase());
      const matchType = type ? q.questionType === type : true;
      const matchDiff = difficulty ? q.difficulty === difficulty : true;
      const matchExam = exam ? q.exam === exam : true;
      return matchSearch && matchType && matchDiff && matchExam;
    });

    setFilteredQuestions(filtered);
  };

  return (
    <div className=" mt-10 p-6">
      <ToastContainer />
      <h1 className="text-xl font-bold text-center text-blue-500 mb-4">Question Bank</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col items-center">
        <input
          name="question"
          value={formData.question}
          onChange={handleInputChange}
          placeholder="Question"
          required
          className="border border-blue-500 rounded p-2 mb-4 w-3/4 md:w-1/2"
        />

        <div className="mb-4 w-3/4 md:w-1/2">
          <select
            name="questionType"
            value={formData.questionType}
            onChange={handleQuestionTypeChange}
            required
            className="block w-full p-2 border border-blue-500 rounded"
          >
            <option value="">Select Question Type</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
          </select>
        </div>

        {formData.questionType === 'multiple-choice' && (
          <>
            {formData.options.map((opt, idx) => (
              <input
                key={idx}
                name={`option_${idx}`}
                value={opt}
                onChange={handleInputChange}
                placeholder={`Option ${idx + 1}`}
                className="border p-2 mb-2 w-3/4 md:w-1/2 border-blue-500 rounded"
              />
            ))}
            <select
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleInputChange}
              required
              className="border p-2 mb-4 w-3/4 md:w-1/2 border-blue-500 rounded"
            >
              <option value="">Select Correct Answer</option>
              {formData.options.map((opt, i) => opt.trim() && (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </>
        )}

        {formData.questionType === 'true-false' && (
          <div className="mb-4 w-3/4 md:w-1/2 flex gap-4">
            <label>
              <input
                type="radio"
                name="correctAnswer"
                value="true"
                checked={formData.correctAnswer === 'true'}
                onChange={handleInputChange}
              /> True
            </label>
            <label>
              <input
                type="radio"
                name="correctAnswer"
                value="false"
                checked={formData.correctAnswer === 'false'}
                onChange={handleInputChange}
              /> False
            </label>
          </div>
        )}

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
          required
          className="mb-4 w-3/4 md:w-1/2 p-2 border border-blue-500 rounded"
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          name="exam"
          value={formData.exam}
          onChange={handleInputChange}
          required
          className="mb-4 w-3/4 md:w-1/2 p-2 border border-blue-500 rounded"
        >
          <option value="">Select Exam</option>
          {exams.map(exam => (
            <option key={exam._id} value={exam._id}>{exam.name}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 w-3/4 md:w-1/2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : editing ? 'Update' : 'Add'} Question
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Questions:</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <select onChange={(e) => handleFilterChange('type', e.target.value)} value={filters.type} className="border p-1 rounded border-blue-500">
            <option value="">All Types</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
          </select>
          <select onChange={(e) => handleFilterChange('difficulty', e.target.value)} value={filters.difficulty} className="border p-1 rounded border-blue-500">
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select onChange={(e) => handleFilterChange('exam', e.target.value)} value={filters.exam} className="border p-1 rounded border-blue-500">
            <option value="">All Exams</option>
            {exams.map(exam => (
              <option key={exam._id} value={exam._id}>{exam.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search questions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="border p-1 rounded border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
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



// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createQuestion, getQuestions, updateQuestion, deleteQuestion } from '../redux/actions/questionActions';
// import { getExams } from '../redux/actions/examActions';
// import QuestionTable from '../components/QuestionTable';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const QuestionBank = () => {
//   const dispatch = useDispatch();
//   const hasFetchedExams = useRef(false);

//   const { questions } = useSelector(state => state.question);
//   const { exams } = useSelector(state => state.exams);
//   const [isLoading, setIsLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     question: '',
//     options: ['', '', '', ''],
//     correctAnswer: '',
//     difficulty: '',
//     exam: '',
//     questionType: '',
//     examId: '',
//   });
//   const [editing, setEditing] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [questionType, setQuestionType] = useState('');
//   const [difficultyLevel, setDifficultyLevel] = useState('');
//   const [examType, setExamType] = useState('');
//   const [filteredQuestions, setFilteredQuestions] = useState([]);

//   const fetchExams = useCallback(() => {
//     setIsLoading(true);
//     Promise.all([dispatch(getExams()), dispatch(getQuestions())])
//       .finally(() => setIsLoading(false));
//   }, [dispatch]);

//   useEffect(() => {
//     if (!hasFetchedExams.current) {
//       fetchExams();
//       hasFetchedExams.current = true;
//     }
//   }, [fetchExams]);

//   useEffect(() => {
//     setFilteredQuestions(questions);
//   }, [questions]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith('option')) {
//       const index = Number(name.split('_')[1]);
//       setFormData(prev => {
//         const newOptions = [...prev.options];
//         newOptions[index] = value;
//         return { ...prev, options: newOptions };
//       });
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleQuestionTypeChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       questionType: e.target.value,
//       options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : ['', ''],
//       correctAnswer: ''
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//      console.log("Submitting question data:", formData);
//     setIsLoading(true);
//     if (editing) {
//       await dispatch(updateQuestion(editing, formData));
//       setEditing(null);
//     } else {
//       await dispatch(createQuestion(formData));
//     }
//     await dispatch(getQuestions());
//     setFormData({
//       question: '',
//       options: ['', '', '', ''],
//       correctAnswer: '',
//       difficulty: '',
//       exam: '',
//       questionType: '',
//     //   examId: '',
//     });
//     setIsLoading(false);
//   };

//   const handleEdit = (question) => {
//     setEditing(question._id);
//     setFormData(question);
//   };

//   const handleDelete = async (id) => {
//     setIsLoading(true);
//     await dispatch(deleteQuestion(id));
//     await dispatch(getQuestions());
//     setIsLoading(false);
//   };

//   const filterQuestions = (search, type, difficulty, exam) => {
//     const filtered = questions.filter((question) => {
//       const matchesSearch = question.question.toLowerCase().includes(search.toLowerCase());
//       const matchesType = type ? question.questionType === type : true;
//       const matchesDifficulty = difficulty ? question.difficulty === difficulty : true;
//       const matchesExam = exam ? question.exam === exam : true;

//       return matchesSearch && matchesType && matchesDifficulty && matchesExam;
//     });
//     setFilteredQuestions(filtered);
//   };

//   const handleSearchChange = (e) => {
//     const val = e.target.value;
//     setSearchQuery(val);
//     filterQuestions(val, questionType, difficultyLevel, examType);
//   };

//   const handleTypeChange = (e) => {
//     const val = e.target.value;
//     setQuestionType(val);
//     filterQuestions(searchQuery, val, difficultyLevel, examType);
//   };

//   const handleDifficultyChange = (e) => {
//     const val = e.target.value;
//     setDifficultyLevel(val);
//     filterQuestions(searchQuery, questionType, val, examType);
//   };

//   const handleExamChange = (e) => {
//     const val = e.target.value;
//     setExamType(val);
//     filterQuestions(searchQuery, questionType, difficultyLevel, val);
//   };

//   return (
//     <div className="p-6">
//       <ToastContainer />
//       <h1 className="text-xl font-bold text-center text-blue-500 mb-4">Question Bank</h1>

//       <form onSubmit={handleSubmit} className="mb-6 flex flex-col items-center">
//         <input
//           name="question"
//           value={formData.question}
//           onChange={handleChange}
//           placeholder="Question"
//           required
//           className="border border-blue-500 rounded p-2 mb-4 w-3/4 md:w-1/2"
//         />

//         <div className="mb-4 w-3/4 md:w-1/2">
//           <label className="block text-gray-700">Type:</label>
//           <select
//             name="questionType"
//             value={formData.questionType}
//             onChange={handleQuestionTypeChange}
//             className="mt-1 block w-full p-2 border border-blue-500 rounded"
//           >
//             <option value="">Question Type</option>
//             <option value="multiple-choice">Multiple Choice</option>
//             <option value="true-false">True/False</option>
//           </select>
//         </div>

//         {formData.questionType === 'multiple-choice' && (
//           <>
//             {formData.options.map((option, index) => (
//               <input
//                 key={index}
//                 name={`option_${index}`}
//                 value={option}
//                 onChange={handleChange}
//                 placeholder={`Option ${index + 1}`}
//                 required
//                 className="border p-2 mb-2 w-3/4 md:w-1/2 border-blue-500 rounded"
//               />
//             ))}
//             <input
//               name="correctAnswer"
//               value={formData.correctAnswer}
//               onChange={handleChange}
//               placeholder="Correct Option"
//               required
//               className="border p-2 mb-4 w-3/4 md:w-1/2 border-blue-500 rounded"
//             />
//           </>
//         )}

//         {formData.questionType === 'true-false' && (
//           <div className="mb-4 w-3/4 md:w-1/2">
//             <label className="block text-gray-700">Correct Answer:</label>
//             <label className="mr-4">
//               <input
//                 type="radio"
//                 name="correctAnswer"
//                 value="true"
//                 checked={formData.correctAnswer === 'true'}
//                 onChange={handleChange}
//               /> True
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="correctAnswer"
//                 value="false"
//                 checked={formData.correctAnswer === 'false'}
//                 onChange={handleChange}
//               /> False
//             </label>
//           </div>
//         )}

//         <div className="mb-4 w-3/4 md:w-1/2">
//           <label className="block text-gray-700">Difficulty:</label>
//           <select
//             name="difficulty"
//             value={formData.difficulty}
//             onChange={handleChange}
//             className="mt-1 block w-full p-2 border border-blue-500 rounded"
//           >
//             <option value="">Select Difficulty</option>
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//         </div>

//         <div className="mb-4 w-3/4 md:w-1/2">
//           <label className="block text-gray-700">Exam:</label>
//           <select
//             name="exam"
//             value={formData.exam}
//             onChange={handleChange}
//             className="mt-1 block w-full p-2 border border-blue-500 rounded"
//           >
//             <option value="">Select an Exam</option>
//             {exams.map((exam) => (
//               <option key={exam._id} value={exam._id}>{exam.name}</option>
//             ))}
//           </select>
        
//         </div>
  
//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-2 w-3/4 md:w-1/2 rounded"
//         >
//           {editing ? 'Update' : 'Add'} Question
//         </button>
//       </form>

//       <hr className="my-4" />

//       <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
//         <h2 className="text-xl font-bold">Questions:</h2>
//         <div className="flex flex-col md:flex-row gap-2">
//           <select value={questionType} onChange={handleTypeChange} className="border p-1 rounded border-blue-500">
//             <option value="">All Types</option>
//             <option value="multiple-choice">Multiple Choice</option>
//             <option value="true-false">True/False</option>
//           </select>
//           <select value={difficultyLevel} onChange={handleDifficultyChange} className="border p-1 rounded border-blue-500">
//             <option value="">All Difficulty</option>
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//           <select value={examType} onChange={handleExamChange} className="border p-1 rounded border-blue-500">
//             <option value="">All Exams</option>
//             {exams.map((exam) => (
//               <option key={exam._id} value={exam._id}>{exam.name}</option>
//             ))}
//           </select>
//           <input
//             type="text"
//             placeholder="Search questions..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="border p-1 rounded border-blue-500"
//           />
//         </div>
//       </div>

//       <QuestionTable
//         questions={filteredQuestions}
//         isLoading={isLoading}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />
//     </div>
//   );
// };

// export default QuestionBank;
