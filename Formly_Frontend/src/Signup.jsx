import { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import emo from './assets/emoji.png';

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Validate full email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Restrict allowed characters while typing
  const handleEmailChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
    setEmail(filteredValue);
  };

  const handleSignup = async () => {
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const res = await fetch('http://localhost/feedback-api/signup.php', {
        method: 'POST',
        credentials: 'include', // needed to store session cookie
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.status === 'success') {
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <div className="avatar">
          <img src={emo} alt="Emoji" className="emoji" />
        </div>
        <h2>Sign up</h2>

        <input
          type="text"
          placeholder="Enter Email"
          className="input-field"
          value={email}
          onChange={handleEmailChange}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'hide' : 'show'}
          </span>
        </div>

        <button className="signin-btn" onClick={handleSignup}>Sign up</button>

        <p className="agreement">
          By continuing, you agree to the <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
        </p>

        <div className="divider">
          <hr />
          <span>Already have an account?</span>
          <hr />
        </div>

        <button className="create-btn" onClick={() => navigate('/login')}>
          Log in
        </button>
      </div>
    </div>
  );
}

export default App;
