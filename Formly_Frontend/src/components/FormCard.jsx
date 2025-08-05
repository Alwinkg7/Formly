import { Link } from "react-router-dom";

export default function FormCard({ form }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold">{form.title}</h2>
      <p className="text-sm text-gray-500">Created: {form.createdAt}</p>
      <p className="text-sm text-gray-500">Responses: {form.responses}</p>
      <div className="flex space-x-4 mt-4">
        <Link
          to={`/builder?template=${form.templateKey}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
