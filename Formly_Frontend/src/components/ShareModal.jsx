// ShareModal.jsx
import { useState } from "react";
import { DocumentDuplicateIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ShareModal({ formId, onClose }) {
  const [copied, setCopied] = useState(false);

  // Construct the full, shareable URL
  const shareUrl = `${window.location.origin}/form/${formId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  if (!formId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Share Form Link</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Anyone with this link can view and submit this form.
        </p>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-700"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
