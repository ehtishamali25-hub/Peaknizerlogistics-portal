import { useNavigate } from 'react-router-dom';

const BackButton = ({ fallbackPath = '/customer/dashboard' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1); // Go back to previous page
    } else {
      navigate(fallbackPath); // Go to dashboard if no history
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
    >
      <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>
  );
};

export default BackButton;