import { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function Forgotpass() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost/feedback-api/send_otp.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact: email }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.status === 'success') {
        localStorage.setItem('contact', email); // Save for use in VerifyOtp
        navigate('/VerifyOtp'); // Redirect to OTP screen
      }
    } catch (err) {
      alert('Error contacting server. Please try again later.');
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Reset your Password</h2>

        <p className="message">
          Enter your user account's verified email address and we will send you a password reset OTP.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="send-btn">
            <button type="submit" className="link-btn">
              Send OTP
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

export default Forgotpass;
