import { useEffect, useState } from "react";
import {
  Cog6ToothIcon,
  TagIcon,
  PencilIcon,
  ExclamationCircleIcon,
  ListBulletIcon,
  AdjustmentsVerticalIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

// Load JSON config (manually imported)
import inputTypes from './elements/inputTypes.json';


export default function ElementConfig({ selectedElement, updateElement, openPreview }) {
  const [local, setLocal] = useState(null);

  useEffect(() => setLocal(selectedElement), [selectedElement]);

  if (!local)
    return (
      <div className="w-1/5 bg-white border-l p-4">
        <p className="italic text-gray-400">Select an element to configure</p>
      </div>
    );

  const handleLabelChange = (e) => {
    const updated = { ...local, label: e.target.value };
    setLocal(updated);
    updateElement(updated);
  };

  const handleDescriptionChange = (e) => {
    const updated = { ...local, description: e.target.value };
    setLocal(updated);
    updateElement(updated);
  };

  const handleRequiredChange = (e) => {
    const updated = { ...local, required: e.target.checked };
    setLocal(updated);
    updateElement(updated);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...local.options];
    updatedOptions[index] = value;
    const updated = { ...local, options: updatedOptions };
    setLocal(updated);
    updateElement(updated);
  };

  const addOption = () => {
    const updated = {
      ...local,
      options: [...local.options, `Option ${local.options.length + 1}`],
    };
    setLocal(updated);
    updateElement(updated);
  };

  const removeOption = (index) => {
    const updatedOptions = local.options.filter((_, i) => i !== index);
    const updated = { ...local, options: updatedOptions };
    setLocal(updated);
    updateElement(updated);
  };

  const handleMinChange = (e) => {
    const updated = { ...local, min: Number(e.target.value) };
    setLocal(updated);
    updateElement(updated);
  };

  const handleMaxChange = (e) => {
    const updated = { ...local, max: Number(e.target.value) };
    setLocal(updated);
    updateElement(updated);
  };

  const handleInputTypeChange = (e) => {
    const updated = { ...local, inputType: e.target.value };
    setLocal(updated);
    updateElement(updated);
  };

  return (
    <div className="w-1/5 bg-white border-2 rounded-lg m-2 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
          Configure Element
        </h2>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          onClick={openPreview}
        >
          Preview
        </button>
      </div>

      {/* Label Field */}
      <label className="mb-1 flex items-center gap-1 text-sm font-medium">
        <TagIcon className="w-4 h-4 text-gray-600" /> Label
      </label>
      <input
        className="border rounded p-2 w-full mb-4"
        value={local.label}
        onChange={handleLabelChange}
      />

      {/* Description Field */}
      <label className="mb-1 flex items-center gap-1 text-sm font-medium">
        <PencilIcon className="w-4 h-4 text-gray-600" /> Description
      </label>
      <textarea
        className="border rounded p-2 w-full mb-4"
        value={local.description}
        onChange={handleDescriptionChange}
      />

      {/* Required Checkbox */}
      <div className="flex items-center mb-4">
        <ExclamationCircleIcon className="w-5 h-5 text-gray-600 mr-2" />
        <input
          type="checkbox"
          checked={local.required}
          onChange={handleRequiredChange}
          className="mr-2"
        />
        <label>Required</label>
      </div>

      {/* Input Type Dropdown for Text Input */}
      {/* Input Type for Text Input */}
{local.type === "Text Input" && (
  <div className="mb-4">
    <label className="mb-1 flex items-center gap-1 text-sm font-medium">
      Input Type
    </label>
    <select
      value={local.inputType || "text"}
      onChange={(e) => {
        const updated = { ...local, inputType: e.target.value };
        setLocal(updated);
        updateElement(updated);
      }}
      className="border p-2 w-full"
    >
      {inputTypes["Text Input"].inputTypes.map((type) => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>
  </div>
)}


      {/* Radio/Checkbox Options */}
      {(local.type === "Checkboxes" || local.type === "Radio Buttons") && (
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-1 font-medium">
            <ListBulletIcon className="w-4 h-4 text-gray-600" />
            Options
          </label>
          {local.options.map((opt, index) => (
            <div key={index} className="flex mb-2 items-center gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="border p-1 flex-1"
              />
              <button
                onClick={() => removeOption(index)}
                className="text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={addOption}
          >
            + Add Option
          </button>
        </div>
      )}

      {/* Scale Question Fields */}
      {local.type === "Scale Question" && (
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-1 font-medium">
            <AdjustmentsVerticalIcon className="w-4 h-4 text-gray-600" />
            Min Value
          </label>
          <input
            type="number"
            className="border p-2 w-full mb-2"
            value={local.min}
            onChange={handleMinChange}
          />

          <label className="mb-1 flex items-center gap-1 font-medium">
            <AdjustmentsVerticalIcon className="w-4 h-4 text-gray-600" />
            Max Value
          </label>
          <input
            type="number"
            className="border p-2 w-full"
            value={local.max}
            onChange={handleMaxChange}
          />
        </div>
      )}
    </div>
  );
}
