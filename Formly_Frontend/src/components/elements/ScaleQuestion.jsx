export default function ScaleQuestion({ data, disabled, value, onChange }) {
  const min = data.min || 1;
  const max = data.max || 5;
  const currentValue = Math.max(min, Math.min(max, value || min));

  return (
    <div className="p-2">
      <label className="block font-medium mb-2">
        {data.label || "Scale Question"}
        {data.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex items-center space-x-4">
        <span className="w-8 text-right text-sm font-semibold text-gray-700">
          {currentValue}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          value={currentValue}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <span className="w-8 text-left text-sm text-gray-500">{max}</span>
      </div>

      {data.description && (
        <p className="text-sm text-gray-500 mt-1">{data.description}</p>
      )}
    </div>
  );
}