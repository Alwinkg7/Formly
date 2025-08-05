import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 shadow-lg bg-white">
      <div className="text-blue-700 font-bold text-xl">Formly</div>
      <div className="flex justify-between space-x-6 font-semibold text-black">
        <Link to="/" className="hover:text-blue-500">
          Home
        </Link>
        <Link to="/dashboard" className="hover:text-blue-500">
          Dashboard
        </Link>
        <Link to="/builder" className="hover:text-blue-500">
          Form Builder
        </Link>
        <Link to="/analytics" className="hover:text-blue-500">
          Results Analytics
        </Link>
        <Link to="/user-profile" className="hover:text-blue-500">
          Profile
        </Link>
      </div>
      <Link
        to="/login"
        className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Log in
      </Link>
    </nav>
  );
}

export default Navbar;
