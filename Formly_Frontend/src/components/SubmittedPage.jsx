import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import TextInput from './elements/TextInput';
import TextArea from './elements/TextArea';
import RadioButtons from './elements/RadioButtons';
import Checkboxes from './elements/Checkboxes';
import ScaleQuestion from './elements/ScaleQuestion';

export default function SubmittedPage() {
  const { state } = useLocation();
  const { formTitle, formElements } = state || {};
  const [showPopup, setShowPopup] = useState(false);

  // Form state values for all answers (optional)
  const [formData, setFormData] = useState({});

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const renderElement = (element) => {
    const commonProps = {
      data: element,
      value: formData[element.id],
      onChange: (value) => handleChange(element.id, value),
      disabled: false, // active input
    };

    switch (element.type) {
      case 'Text Input':
        return <TextInput {...commonProps} />;
      case 'Text Area':
        return <TextArea {...commonProps} />;
      case 'Radio Buttons':
        return <RadioButtons {...commonProps} />;
      case 'Checkboxes':
        return <Checkboxes {...commonProps} />;
      case 'Scale Question':
        return <ScaleQuestion {...commonProps} />;
      default:
        return null;
    }
  };

  const handleFinalSubmit = () => {
    // You can send `formData` to backend if needed
    console.log('Form submitted:', formData);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-8">{formTitle || 'Untitled form'}</h1>

      <div className="space-y-6">
        {formElements?.map((el) => (
          <div
            key={el.id}
            className="border border-gray-300 rounded-md p-4 bg-white"
          >
            {renderElement(el)}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleFinalSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white text-green-600 text-lg font-semibold px-8 py-6 rounded shadow-lg animate-popup">
            ✅ Thank you for your submission!
          </div>
        </div>
      )}

      {/* Animation */}
      <style>
        {`
          @keyframes popupAnimation {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          .animate-popup {
            animation: popupAnimation 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
