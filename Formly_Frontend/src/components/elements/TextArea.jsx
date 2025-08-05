import {
  DocumentTextIcon} from '@heroicons/react/24/outline';

export default function TextArea({ data, onClick, isSelected, disabled, deleteElement, duplicateElement }) {
  return (
    <div onClick={onClick} className="mb-4">
      <label className="block font-medium mb-1">
        <DocumentTextIcon className="w-5 h-5 mr-2" />
        {data.label}
        {data.required && <span className="text-red-500 ml-1">*</span>}
        {data.description && (
          <p className="text-sm text-gray-500 mt-1">{data.description}</p>
        )}
      </label>
      <textarea
        placeholder={data.label}
        disabled={disabled}
        className="border p-2 rounded w-full mt-1"
      />
    </div>
  );
}
