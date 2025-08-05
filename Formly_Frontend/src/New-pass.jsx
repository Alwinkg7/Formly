import { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function NewPass() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState(() => localStorage.getItem('contact') || '');

    const navigate = useNavigate();
    const handleReset = async () => {
       

        const res = await fetch('http://localhost/feedback-api/reset_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact, password })
        });
         if (!contact) {
            alert("Missing contact info. Please restart the password reset flow.");
            return;
        }

        const data = await res.json();
        alert(data.message);
        if (data.status === 'success') {
            localStorage.removeItem('contact'); // cleanup
            navigate('/dashboard'); 
        }
    };
    

    return (
        <div className="container">
            <div className="form-box">
                <h2>Create New Password</h2>

                <p className='message'>
                    Enter your new password below.
                </p>

                <div className="password-wrapper">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Your password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? '🙈 Hide': '👁️ Show'} 
                    </span>
                 </div>

                <div className="send-btn">
                    <button className='link-btn' onClick={handleReset}>
                        Confirm Password
                    </button>
                </div>

                <p className="plain-btn">
                    <a href="/Forgotpass">&larr; back</a>
                </p>
            </div>
        </div>
    )
}

export default NewPass;
