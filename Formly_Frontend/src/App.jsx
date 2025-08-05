import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import ResultAnalytics from "/src/Pages/ResultAnalytics.jsx";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import FormCanvas from "./components/FormCanvas";
import ElementConfig from "./components/ElementConfig";
import PreviewModal from "./components/PreviewModal";
import Dashboard from "./components/Dashboard";
import RespondForm from "./components/RespondForm";
import SubmissionConfirmation from "./SubmissionConfirmation";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import Login from "./Login";
import Signup from "./Signup";
import NewPass from "./New-pass";
import Forgotpass from "./Forgot_pass";
import Home from "./Home";
import VerifyOtp from './VerifyOtp.jsx';
import UserProfile from "./Pages/UserProfile";
import SubmittedPage from "./components/SubmittedPage";


function BuilderWrapper() {
  const location = useLocation();

  const [formElements, setFormElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState("Untitled form");

  const selectedElement = formElements.find((el) => el.id === selectedId);

  const addElement = (type) => {
    const base = {
      id: Date.now(),
      type,
      label: type,
      description: "",
      required: false,
    };

    if (type === "Radio Buttons" || type === "Checkboxes") {
      base.options = ["Option 1", "Option 2"];
    } else if (type === "Scale Question") {
      base.min = 1;
      base.max = 5;
    }

    setFormElements((prev) => [...prev, base]);
    setSelectedId(base.id);
  };

  const deleteElement = (id) => {
    setFormElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateElement = (id) => {
    const el = formElements.find((e) => e.id === id);
    if (!el) return;
    const copy = { ...el, id: Date.now(), label: el.label + " (copy)" };
    setFormElements((prev) => [...prev, copy]);
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const template = query.get("template");

    if (template === "registration") {
      setFormTitle("Registration Form");
      setFormElements([
        {
          id: Date.now() + 1,
          type: "Text Input",
          label: "Full Name",
          required: true,
        },
        {
          id: Date.now() + 2,
          type: "Text Input",
          label: "Email",
          inputType: "email",
          required: true,
        },
        {
          id: Date.now() + 3,
          type: "Text Input",
          label: "Mobile Number",
          inputType: "number",
          required: true,
        },
        {
          id: Date.now() + 4,
          type: "Text Area",
          label: "Address",
          required: false,
        },
        {
          id: Date.now() + 5,
          type: "Radio Buttons",
          label: "Gender",
          options: ["Male", "Female", "Other"],
          required: true,
        },
        {
          id: Date.now() + 6,
          type: "Text Input",
          label: "College Name",
          required: true,
        },
        {
          id: Date.now() + 7,
          type: "Text Input",
          label: "Roll Number",
          required: true,
        },
        {
          id: Date.now() + 8,
          type: "Checkboxes",
          label: "Select Subjects",
          options: ["Math", "Physics", "Chemistry", "Biology"],
          required: true,
        },
      ]);
    } else if (template === "feedback") {
      setFormTitle("Customer Feedback");
      setFormElements([
        {
          id: Date.now() + 1,
          type: "Text Input",
          label: "Customer Name",
          required: true,
        },
        {
          id: Date.now() + 2,
          type: "Text Input",
          label: "Email",
          inputType: "email",
          required: false,
        },
        {
          id: Date.now() + 3,
          type: "Scale Question",
          label: "Rate Our Service",
          min: 1,
          max: 5,
        },
        {
          id: Date.now() + 4,
          type: "Text Area",
          label: "Feedback Comments",
          required: false,
        },
      ]);
    } else if (template === "biodata") {
      setFormTitle("Bio Data Collection");
      setFormElements([
        {
          id: Date.now() + 1,
          type: "Text Input",
          label: "Full Name",
          required: true,
        },
        {
          id: Date.now() + 2,
          type: "Text Input",
          label: "Date of Birth",
          required: true,
        },
        {
          id: Date.now() + 3,
          type: "Text Input",
          label: "Phone Number",
          required: true,
        },
        {
          id: Date.now() + 4,
          type: "Text Input",
          label: "Email Address",
          required: false,
        },
        {
          id: Date.now() + 5,
          type: "Text Area",
          label: "Permanent Address",
          required: true,
        },
        {
          id: Date.now() + 6,
          type: "Radio Buttons",
          label: "Gender",
          options: ["Male", "Female", "Other"],
        },
        {
          id: Date.now() + 7,
          type: "Text Input",
          label: "Nationality",
          required: true,
        },
        {
          id: Date.now() + 8,
          type: "Text Input",
          label: "Marital Status",
          required: false,
        },
        {
          id: Date.now() + 9,
          type: "Text Area",
          label: "Educational Qualifications",
          required: true,
        },
        {
          id: Date.now() + 10,
          type: "Text Area",
          label: "Work Experience",
          required: false,
        },
      ]);
    }
  }, [location.search]);

  return (
    <div className="flex h-screen">
      <Sidebar addElement={addElement} />
      <FormCanvas
        formElements={formElements}
        setSelectedId={setSelectedId}
        selectedId={selectedId}
        deleteElement={deleteElement}
        duplicateElement={duplicateElement}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
      />

      {showPreview && (
        <PreviewModal
          formElements={formElements}
          onClose={() => setShowPreview(false)}
          formTitle={formTitle}
        />
      )}

      <ElementConfig
        selectedElement={selectedElement}
        updateElement={(updated) =>
          setFormElements((prev) =>
            prev.map((el) => (el.id === updated.id ? updated : el))
          )
        }
        openPreview={() => setShowPreview(true)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/respond/:form_id" element={<RespondForm />} />
        <Route path="/builder" element={<BuilderWrapper />} />
        <Route
          path="/analytics"
          element={
            <ChakraProvider>
              <ResultAnalytics />
            </ChakraProvider>
          }
        />
        <Route path="/confirmation" element={<SubmissionConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Forgotpass" element={<Forgotpass />} />
        <Route path="/VerifyOtp" element={<VerifyOtp />} />
        <Route path="/New-pass" element={<NewPass />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/submitted" element={<SubmittedPage />} />

      </Routes>
    </Router>
  );
}

export default App;
