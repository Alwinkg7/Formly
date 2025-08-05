import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/UserProfile.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost/feedback-api/logout.php", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("✅ " + data.message);
        navigate("/login");
      } else {
        alert("❌ Logout failed: " + data.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("❌ Network error during logout.");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("http://localhost/feedback-api/user_profile.php", {
        method: "GET",
        credentials: "include", // very important for session access
      });
      const data = await res.json();
      if (data.status === "success" && data.user) {
        setUser(data.user);
      } else {
        alert("❌ Failed to fetch user profile.");
        navigate("/login"); // redirect if not authenticated
      }
    } catch (err) {
      console.error("User fetch error:", err);
      alert("❌ Server error fetching profile.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Unable to load profile.</p>;

  return (
    <div className="user-profile-container">
      <h2 className="profile-header">
        <span>👤</span> My Profile
      </h2>

      <div className="profile-card">
        <p className="profile-detail"><strong>Name:</strong> {user.name}</p>
        <p className="profile-detail"><strong>Email:</strong> {user.email}</p>
        <p className="profile-detail"><strong>Phone:</strong> {user.phone}</p>
        <p className="profile-detail"><strong>Joined:</strong> {new Date(user.joined).toLocaleDateString()}</p>

        <div className="button-group">
          <button className="button button-primary" onClick={() => alert("Edit profile coming soon!")}>
            Edit Profile
          </button>
          <button className="button button-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
