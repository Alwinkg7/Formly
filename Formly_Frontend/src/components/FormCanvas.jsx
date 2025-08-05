import {
  EllipsisVerticalIcon,
  TrashIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import TextInput from "./elements/TextInput";
import TextArea from "./elements/TextArea";
import RadioButtons from "./elements/RadioButtons";
import Checkboxes from "./elements/Checkboxes";
import ScaleQuestion from "./elements/ScaleQuestion";

export default function FormCanvas({
  setForms,
  formElements,
  setFormElements,
  setSelectedId,
  selectedId,
  deleteElement,
  duplicateElement,
  formTitle,
  setFormTitle,
}) {
  const { formId } = useParams();
  const isEditMode = Boolean(formId);
  const [formDescription, setFormDescription] = useState("");

  const convertBackendTypeToLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "text_input":
        return "Text Input";
      case "text_area":
        return "Text Area";
      case "radio":
        return "Radio Buttons";
      case "checkbox":
        return "Checkboxes";
      case "scale":
        return "Scale Question";
      // Ensure these match your actual backend types
      case "multiple_choice":
        return "Radio Buttons"; // Assuming this for ENUM
      case "rating":
        return "Scale Question"; // Assuming this for ENUM
      case "boolean":
        return "Checkboxes"; // Assuming this for ENUM
      case "text":
        return "Text Input"; // Assuming this for ENUM
      default:
        return "Text Input";
    }
  };

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`http://localhost/feedback-api/get_form.php?form_id=${formId}`)
        .then((res) => {
          if (res.data.status === "success") {
            const { form, questions } = res.data;
            setFormTitle(form.title);
            setFormDescription(form.description || "");

            const mappedQuestions = questions.map((q) => ({
              // Use q.id, not index + 1
              id: q.id, // Use actual database ID
              type: convertBackendTypeToLabel(q.question_type),
              label: q.question_text,
              description: q.description || "", // Will be empty if not in DB
              options: Array.isArray(q.options) ? q.options : [], // Options are now arrays
              min: q.min_value, // Get min_value
              max: q.max_value, // Get max_value
              required: q.is_required, // Get is_required
            }));

            setFormElements(mappedQuestions);
          } else {
            console.error("❌ Failed to load form:", res.data.message);
          }
        })
        .catch((err) => {
          console.error("Error loading form:", err.message);
        });
    }
  }, [formId, setFormTitle, setFormElements]);

  const handleSaveForm = () => {
    const payload = {
      ...(isEditMode && { id: formId }),
      title: formTitle,
      description: formDescription, // Use actual form description from state
      questions: formElements.map((el, index) => ({
        question_text: el.label || "Untitled",
        type: el.type.toLowerCase().replace(/ /g, "_"), // Convert label back to backend type
        options: el.options || [], // Send options as array
        min: el.min, // Send min
        max: el.max, // Send max
        is_required: el.required || false, // Send required status
        order: index + 1, // Order can still be index based for new forms
      })),
    };

    const endpoint = isEditMode
      ? "http://localhost/feedback-api/update_form.php"
      : "http://localhost/feedback-api/save_form.php";

    fetch(endpoint, {
      method: "POST",
      credentials: "include", // Include session cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert(
            isEditMode
              ? "✅ Form updated successfully!"
              : "✅ Form saved! ID: " + data.form_id
          );

          // Re-fetch forms for Dashboard to update
          fetch("http://localhost/feedback-api/get_forms.php", {
            credentials: "include", 
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.status === "success" && Array.isArray(result.forms)) {
                setForms(result.forms);
              } else {
                console.error(
                  "Failed to re-fetch forms after save/update:",
                  result
                );
              }
            })
            .catch((err) => console.error("Error re-fetching forms:", err));
        } else {
          alert("❌ Failed to save form: " + (data.error || data.message));
        }
      })
      .catch((err) => alert("❌ Error saving/updating form: " + err.message));
  };

  const renderElement = (el) => {
    const isSelected = el.id === selectedId;
    const border = isSelected ? "border-blue-500 border-2" : "border";

    const commonProps = {
      data: el,
      isSelected,
      onClick: () => setSelectedId(el.id),
      disabled: true,
    };

    let renderedComponent;
    switch (el.type) {
      case "Text Input":
        renderedComponent = <TextInput {...commonProps} />;
        break;
      case "Text Area":
        renderedComponent = <TextArea {...commonProps} />;
        break;
      case "Radio Buttons":
        renderedComponent = <RadioButtons {...commonProps} />;
        break;
      case "Checkboxes":
        renderedComponent = <Checkboxes {...commonProps} />;
        break;
      case "Scale Question":
        renderedComponent = <ScaleQuestion {...commonProps} />;
        break;
      default:
        renderedComponent = (
          <div className="text-red-500">Unknown Type: {el.type}</div>
        );
    }

    return (
      <div
        key={el.id}
        className={`${border} p-4 rounded mb-4 relative bg-white`}
        onClick={() => setSelectedId(el.id)}
      >
        <div className="absolute top-2 right-2">
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
        </div>
        {renderedComponent}
        <div className="flex gap-4 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateElement(el.id);
            }}
            className="flex items-center text-blue-600 text-sm"
          >
            <SquaresPlusIcon className="w-4 h-4 mr-1" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteElement(el.id);
            }}
            className="flex items-center text-red-600 text-sm"
          >
            <TrashIcon className="w-4 h-4 mr-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-3/5 m-2 border-2 rounded-lg p-4 overflow-y-scroll bg-gray-50">
      <h2 className="text-xl font-bold mb-4">
        {isEditMode ? "Edit Form" : "Build Your Form"}
      </h2>
      <input
        type="text"
        className="text-2xl font-semibold mb-6 border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-400"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        placeholder="Form Title"
      />
      {formElements.map(renderElement)}
      <button
        onClick={handleSaveForm}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isEditMode ? "Update Form" : "Save Form"}
      </button>
    </div>
  );
}
