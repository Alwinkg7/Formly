import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import TextInput from "./elements/TextInput";
import TextArea from "./elements/TextArea";
import RadioButtons from "./elements/RadioButtons";
import Checkboxes from "./elements/Checkboxes";
import ScaleQuestion from "./elements/ScaleQuestion";

export default function RespondForm() {
  const { form_id } = useParams();
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost/feedback-api/get_form.php?form_id=${form_id}`)
      .then((res) => {
        if (res.data.status === "success") {
          setFormDetails(res.data.form);
          setQuestions(res.data.questions);

          const initialAnswers = {};
          res.data.questions.forEach((q) => {
            if (
              q.question_type === "rating" ||
              q.question_type === "scale_question"
            ) {
              initialAnswers[q.id] = q.min_value || 3;
            }
          });
          setAnswers(initialAnswers);
        } else {
          console.error("Failed to load form:", res.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching form structure:", err);
        setLoading(false);
      });
  }, [form_id]);

  const handleInputChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, option, isChecked) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers;
    if (isChecked) {
      newAnswers = [...currentAnswers, option];
    } else {
      newAnswers = currentAnswers.filter((item) => item !== option);
    }
    handleInputChange(questionId, newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      form_id: form_id,
      answers: answers,
    };
    try {
      const res = await axios.post(
        "http://localhost/feedback-api/submit_response.php",
        payload
      );
      if (res.data.status === "success") {
        alert("✅ Thank you! Your response has been submitted.");
        navigate("/dashboard");
      } else {
        alert(`❌ Error: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`❌ An error occurred: ${error.response.data.message}`);
      } else {
        alert(
          "❌ An error occurred while submitting your response. Could not connect to the server."
        );
      }
    }
  };

  const renderQuestion = (q) => {
    const commonProps = {
      data: {
        id: q.id,
        label: q.question_text,
        description: q.description || "",
        options: q.options || [],
        required: q.is_required,
        min: q.min_value,
        max: q.max_value,
      },
      disabled: false,
    };

    switch (q.question_type) {
      case "text":
      case "text_input":
        return (
          <TextInput
            {...commonProps}
            // --- START OF FIX ---
            value={answers[q.id]}
            // --- END OF FIX ---
            onChange={(e) => handleInputChange(q.id, e.target.value)}
          />
        );
      case "text_area":
        return (
          <TextArea
            {...commonProps}
            // --- START OF FIX ---
            value={answers[q.id]}
            // --- END OF FIX ---
            onChange={(e) => handleInputChange(q.id, e.target.value)}
          />
        );
      case "multiple_choice":
      case "radio_buttons":
        return (
          <RadioButtons
            {...commonProps}
            selectedValue={answers[q.id]}
            onChange={(value) => handleInputChange(q.id, value)}
          />
        );
      case "boolean":
      case "checkboxes":
        return (
          <Checkboxes
            {...commonProps}
            selectedValues={answers[q.id]}
            onChange={(option, checked) =>
              handleCheckboxChange(q.id, option, checked)
            }
          />
        );
      case "rating":
      case "scale_question":
        return (
          <ScaleQuestion
            {...commonProps}
            value={answers[q.id]}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
          />
        );
      default:
        return (
          <div
            key={q.id}
            className="text-red-500 p-4 border border-red-200 rounded-md"
          >
            Unsupported question type: {q.question_type}
          </div>
        );
    }
  };

  if (loading) return <p className="text-center p-10">Loading form...</p>;
  if (!formDetails)
    return (
      <p className="text-center p-10 text-red-500">Could not load the form.</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 my-10 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">{formDetails.title}</h1>
        <p className="text-gray-600 mt-2">{formDetails.description}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q.id} className="p-6 bg-white border rounded-lg">
              <div className="flex items-start">
                <span className="text-lg font-bold text-blue-600 mr-4">
                  {index + 1}.
                </span>
                <div className="flex-1">{renderQuestion(q)}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Response
        </button>
      </form>
    </div>
  );
}