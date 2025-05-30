import { FaVideo, FaMicrophoneAltSlash } from 'react-icons/fa';

const ProctoringInfo = () => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Proctoring Information</h2>
      <p className="text-gray-700 mb-2">
        To maintain the integrity of the exam, the following proctoring measures will be in place:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li className="flex items-center gap-2">
          <FaVideo className="w-5 h-5 text-blue-500" aria-hidden="true" />
          <FaMicrophoneAltSlash className="w-4 h-4 text-red-500" aria-hidden="true" />
          <span>Video monitoring will be enabled throughout the exam.</span>
        </li>
        <li>Browser lockdown will prevent access to other tabs and applications.</li>
        <li>Identity verification will occur before the exam starts.</li>
        <li>Behavior detection tools will flag any suspicious activities during the exam.</li>
      </ul>
      <p className="mt-4 text-gray-600">
        Please ensure that you are in a quiet environment and have a stable internet connection to avoid interruptions during the exam.
      </p>
    </div>
  );
};

export default ProctoringInfo;