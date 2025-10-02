import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./verify.css"; // 👈 link CSS

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/users/verify",
        { email, token },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/loginz");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2 className="verify-title">Verify Your Email ✨</h2>
        <form onSubmit={handleSubmit} className="verify-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="verify-input"
            required
          />
          <input
            type="text"
            placeholder="Enter your OTP/token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="verify-input"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`verify-button ${loading ? "disabled" : ""}`}
          >
            {loading ? "Verifying..." : "Verify Email 🚀"}
          </button>
        </form>
        <p className="verify-footer">
          Didn’t receive a token?{" "}
          <span className="resend">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
