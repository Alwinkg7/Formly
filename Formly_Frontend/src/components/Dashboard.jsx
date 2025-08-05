import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShareModal from "./ShareModal";

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);

  const handleShare = (formId) => {
    setSelectedFormId(formId);
    setShowShareModal(true);
  };

  useEffect(() => {
    axios.get("http://localhost/feedback-api/get_forms.php", {
      withCredentials: true, // ✅ Include cookies/session
    })
      .then((res) => {
        if (res.data.status === "success" && Array.isArray(res.data.forms)) {
          setForms(res.data.forms);
        } else if (res.data.status === "error" && res.data.message.includes("Unauthorized")) {
          alert("Your session has expired. Please log in again.");
          navigate("/login");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching forms:", err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    axios.post("http://localhost/feedback-api/delete_form.php", { id }, {
      withCredentials: true, // ✅ Include credentials
    })
      .then((res) => {
        const data = res.data;
        if (data.status === "success") {
          alert("✅ Form deleted successfully.");
          setForms((prev) => prev.filter((form) => form.id !== id));
        } else {
          alert("❌ Failed to delete form: " + data.message);
        }
      })
      .catch((err) => alert("❌ Error deleting form: " + err.message));
  };

  const handleRespond = (formId) => {
    navigate(`/respond/${formId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Forms</h2>

      {loading ? (
        <p>Loading forms...</p>
      ) : forms.length === 0 ? (
        <p>No forms found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white shadow rounded p-4 border hover:border-blue-500 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold">{form.title}</h3>
                <p className="text-gray-500 text-sm">
                  Created: {new Date(form.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleRespond(form.id)}
                  className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Respond
                </button>

                <button
                  onClick={() => handleShare(form.id)}
                  className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600 text-sm"
                >
                  Share
                </button>

                <button
                  onClick={() => handleDelete(form.id)}
                  className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showShareModal && (
        <ShareModal
          formId={selectedFormId}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
