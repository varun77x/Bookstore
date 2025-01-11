import React, { useState } from 'react';

const LoginForm = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setInputError('Please enter a name');
      return;
    }
    if (username.length < 3) {
      setInputError('Name must be at least 3 characters long');
      return;
    }
    setInputError('');
    onJoin(username);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Join Drawing Room
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 text-gray-700 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        {inputError && (
          <p className="mb-4 text-sm text-red-500">{inputError}</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default LoginForm;