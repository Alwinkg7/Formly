import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Checkboxes({ data, disabled, onChange, selectedValues = [] }) {
  return (
    <div className="mb-4">
      <label className="font-medium flex items-center">
        <CheckCircleIcon className="w-5 h-5 mr-2" />
        {data.label}
        {data.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {data.description && (
        <p className="text-sm text-gray-500 mt-1">{data.description}</p>
      )}
      <div className="mt-2 space-y-2">
        {data.options.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`checkbox-${data.id}-${index}`}
              name={option}
              value={option}
              checked={selectedValues.includes(option)}
              onChange={(e) => onChange(option, e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={`checkbox-${data.id}-${index}`} className="ml-3 block text-sm font-medium text-gray-700">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}