import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function VerifyOtp() {
  // const [contact, setContact] = useState('');
  const [contact, setContact] = useState(() => localStorage.getItem('contact') || '');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // ✅ Load contact from localStorage when component mounts
  useEffect(() => {
    const savedContact = localStorage.getItem('contact');
    if (savedContact) {
      setContact(savedContact);
    } else {
      alert("No contact info found. Please go back and enter your email or phone.");
      navigate('/forgot-pass'); // Redirect if no contact
    }
  }, [navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost/feedback-api/verify_otp.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ contact, otp })
      body: JSON.stringify({
      contact: contact.trim(),
      otp: otp.trim()
      })
    });

    const data = await res.json();
    alert(data.message);

    if (data.status === 'success') {
      navigate('/New-pass');
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Verify your OTP</h2>

        <p className="message">
          Enter the OTP sent to your email or phone.
        </p>

        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="input-field"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <div className="send-btn">
            <button type="submit" className="link-btn">
              Verify OTP
            </button>
          </div>
        </form>

        <p className="plain-btn">
          <a href="/login">&larr; back</a>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
