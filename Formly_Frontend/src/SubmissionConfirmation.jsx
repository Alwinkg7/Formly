import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubmissionConfirmation.css';

const SubmissionConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const formData = state?.formData || {};

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h1 className="confirmation-title">Thank You for Your Submission!</h1>
        <p className="confirmation-message">
          We appreciate your responses. Here is a summary of your submission:
        </p>

        <div className="summary-section">
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {formData.fullName || 'Not provided'}</p>
          <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
        </div>

        <div className="summary-section">
          <h3>Academic Information</h3>
          <p><strong>Course:</strong> {formData.course || 'Not provided'}</p>
          <p><strong>Year:</strong> {formData.yearOfStudy || 'Not provided'}</p>
        </div>

        <div className="action-buttons">
          <button 
            className="action-btn fill-another"
            onClick={() => navigate('/form')}
          >
            Fill Another Form
          </button>
          <button 
            className="action-btn go-home"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>

        <div className="footer">
          <p>© {new Date().getFullYear()} Student Profile System. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;