import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';
import emo from './assets/emoji.png';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
    setEmail(filteredValue);
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!password) {
      alert('Password cannot be empty.');
      return;
    }

    try {
      const res = await fetch('http://localhost/feedback-api/login.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        alert(data.message);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your connection or try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <div className="avatar">
          <img src={emo} alt="Emoji" className="emoji" />
        </div>
        <h2>Log in</h2>

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

        <button className="login-btn" onClick={handleLogin}>Log in</button>

        <p className="agreement">
          By continuing, you agree to the <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
        </p>

        <div className='forgot-btn'>
          <Link to="/Forgotpass" className='plain-btn'>
            Forgot Password?
          </Link>
        </div>

        <div className="divider">
          <hr />
          <span>New to our community?</span>
          <hr />
        </div>

        <button className="create-btn" onClick={() => navigate('/signup')}>
          Create an account
        </button>
      </div>
    </div>
  );
}

export default Login;
