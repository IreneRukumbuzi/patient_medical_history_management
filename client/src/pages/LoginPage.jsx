import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import signingImage from '../assets/signing_image.jpg';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ username, password });
      const { token, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      onLogin(role);

      if (role === 'practitioner') {
        navigate('/practitioner-dashboard');
      } else if (role === 'patient') {
        navigate('/patient-dashboard');
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        alert(message || 'Invalid login credentials');
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${signingImage})` }} >
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
