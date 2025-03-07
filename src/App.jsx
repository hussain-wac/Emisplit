import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EmiForm from "./components/EmiForm";
import DynamicForm from "./components/DynamicForm/Dynamicform";

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Select Form</h1>

        {/* Navigation Buttons */}
        <div className="flex space-x-4 mb-6">
          <Link to="/emi">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
              EMI Form
            </button>
          </Link>
          <Link to="/dynamic">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
              Dynamic Form
            </button>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
          <Routes>
            <Route path="/emi" element={<EmiForm />} />
            <Route path="/dynamic" element={<DynamicForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
