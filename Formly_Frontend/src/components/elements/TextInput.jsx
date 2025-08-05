import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function TextInput({ data, disabled, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">
        <div className="flex items-center">
          <PencilSquareIcon className="w-5 h-5 mr-2" />
          <span>{data.label}</span>
          {data.required && <span className="text-red-500 ml-1">*</span>}
        </div>
        {data.description && (
          <p className="text-sm text-gray-500 mt-1">{data.description}</p>
        )}
      </label>
      <input
        type={data.inputType || "text"}
        disabled={disabled}
        required={data.required}
        className="border rounded p-2 w-full mt-1"
        placeholder={data.label}
        value={value || ""}
        onChange={onChange}
      />
    </div>
  );
}