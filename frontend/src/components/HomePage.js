import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="container mx-auto text-center mt-20">
      <h1 className="text-4xl font-bold text-indigo-600">
        You are successfully logged in!
      </h1>
      <p className="mt-4 text-xl text-gray-700">
        Welcome to MelodyVerse, your ultimate music experience.
      </p>
      <div className="mt-10">
        <a
          href="/homepage"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
          Explore Music
        </a>
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default HomePage;
