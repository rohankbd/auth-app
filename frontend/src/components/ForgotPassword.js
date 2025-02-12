import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState(""); // To store the full email entered by the user
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleUsernameSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/verify-username",
        { username }
      );
      if (response.data.verified) {
        setMessage("");
        setStep(2);
      } else {
        setMessage("Username not found. Try again!");
      }
    } catch (error) {
      setMessage("Username not found. Try again!");
    }
  };

  const handleEmailVerification = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/verify-email", {
        username,
        email: userEmail,
      });
      if (response.data.verified) {
        setMessage("");
        setStep(3);
      } else {
        setMessage("Email verification failed. Try again!");
      }
    } catch (error) {
      setMessage("Email verification failed. Try again!");
      setStep(2);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/reset-password", {
        username,
        newPassword,
      });
      setMessage("Password reset successfully.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage("Failed to reset password. Try again!");
    }
  };

  return (
    <div className="container mx-auto text-center mt-20">
      <h1 className="text-2xl font-bold mb-4 text-blue-500">Forgot Password</h1>
      {step === 1 && (
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="border p-2 rounded w-1/3 text-center mx-auto"
            required
          />
          <button
            type="submit"
            className="mt-4 p-2 border rounded bg-blue-500 text-white hover:bg-blue-700 transition duration-300"
          >
            Verify Username
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleEmailVerification} className="space-y-4">
          <p>Please enter the full email you used to sign up</p>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter your full email"
            className="border p-2 rounded w-1/3 text-center mx-auto"
            required
          />
          <button
            type="submit"
            className="mt-4 p-2 border rounded bg-blue-500 text-white hover:bg-blue-700 transition duration-300"
          >
            Verify Email
          </button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4 relative">
          <div className="relative w-1/3 mx-auto">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="border p-2 rounded text-center w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <img
                src={showNewPassword ? "/eye-closed.png" : "/eye-open.png"}
                alt={showNewPassword ? "Hide" : "Show"}
                style={{ width: "24px", height: "24px" }}
              />
            </button>
          </div>
          <div className="relative w-1/3 mx-auto">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="border p-2 rounded text-center w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <img
                src={showConfirmPassword ? "/eye-closed.png" : "/eye-open.png"}
                alt={showConfirmPassword ? "Hide" : "Show"}
                style={{ width: "24px", height: "24px" }}
              />
            </button>
          </div>
          <button
            type="submit"
            className="mt-4 p-2 border rounded bg-blue-500 text-white hover:bg-blue-700 transition duration-300 w-1/3 mx-auto"
          >
            Reset Password
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
