import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    profilePicture: "",
    termsAccepted: false,
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let errors = [];
    if (!formData.username) errors.push("Username is required.");
    if (!formData.email.match(/\S+@\S+\.\S+/))
      errors.push("Email format is invalid.");
    if (formData.password.length < 6)
      errors.push("Password must be at least 6 characters long.");
    if (formData.password !== formData.confirmPassword)
      errors.push("Passwords do not match.");
    if (!formData.termsAccepted)
      errors.push("You must accept the terms and conditions.");
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();

    if (errors.length > 0) {
      setMessage(errors.join(" "));
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      };

      // Make API call
      const response = await axios.post(
        "http://localhost:5000/signup",
        signupData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful signup
      if (response.data) {
        setMessage(
          "Account created successfully! Welcome Email Sent (simulated)"
        );
        // Store the token if provided in response
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        // Redirect after a delay
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          "Signup failed. Please try again.";
        setMessage(errorMessage);
      } else if (error.request) {
        // Request was made but no response
        setMessage(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        // Something else went wrong
        setMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Signup Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join MelodyVerse today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name (Optional)"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              I accept the{" "}
              <a href="/terms" className="text-blue-600 hover:text-blue-500">
                terms and conditions
              </a>
            </label>
          </div>

          {message && (
            <div
              className={`text-sm text-center p-2 rounded ${
                message.includes("sent")
                  ? "text-green-600 bg-green-50"
                  : "text-red-500 bg-red-50"
              }`}
            >
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
