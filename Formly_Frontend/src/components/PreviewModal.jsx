import { useNavigate } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';

import TextInput from './elements/TextInput';
import TextArea from './elements/TextArea';
import RadioButtons from './elements/RadioButtons';
import Checkboxes from './elements/Checkboxes';
import ScaleQuestion from './elements/ScaleQuestion';

export default function PreviewModal({ formElements, onClose, formTitle }) {
  const navigate = useNavigate();

  // Utility to normalize backend type names
  const normalizeType = (type) => {
    if (!type) return '';
    return type.trim().toLowerCase().replace(/\s+/g, '_');
  };

  const renderElement = (el) => {
    const type = normalizeType(el.type);

    const commonProps = {
      data: el,
      disabled: false,
      onChange: () => {}, // No need to track for preview
    };

    let component = null;
    switch (type) {
      case "text_input":
        component = <TextInput {...commonProps} />;
        break;
      case "text_area":
        component = <TextArea {...commonProps} />;
        break;
      case "radio_buttons":
        component = <RadioButtons {...commonProps} />;
        break;
      case "checkboxes":
        component = <Checkboxes {...commonProps} />;
        break;
      case "scale_question":
        component = <ScaleQuestion {...commonProps} />;
        break;
      default:
        component = (
          <div className="text-red-600">
            Unsupported type: <strong>{el.type}</strong>
          </div>
        );
        break;
    }

    return (
      <div
        key={el.id}
        className="border border-gray-300 rounded-md p-4 mb-4 shadow-sm bg-white"
      >
        {component}
        {el.description && (
          <p className="text-sm text-gray-500 mt-1">{el.description}</p>
        )}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const answeredElements = formElements.map((el) => {
      const value =
        normalizeType(el.type) === 'checkboxes'
          ? formData.getAll(String(el.id))
          : formData.get(String(el.id));

      return { ...el, value };
    });

    navigate('/submitted', {
      state: {
        formTitle: formTitle || 'Untitled form',
        formElements: answeredElements,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-3/4 max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <EyeIcon className="w-6 h-6 text-blue-600" />
            Live Form Preview
          </h2>
          <button
            onClick={onClose}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>

        <h3 className="text-2xl font-semibold mb-4">{formTitle || 'Untitled form'}</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {formElements.map(renderElement)}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
