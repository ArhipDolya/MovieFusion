import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/login.css'


export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,  
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a POST request to Django backend
    axios
      .post('http://localhost:8000/login/', formData)
      .then((res) => {
        if (res.status === 200) {
          window.location.href = '/';
        } else {
          setError('Invalid email or password');
        }
      })
      .catch((error) => {
        setError('An error occurred. Please try again later.');
        console.log('Error logging in:', error);
      });
  };

  return (
    <div className="container login-container">

      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Email</label><br></br>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label><br></br>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>

      </form>

      <p className="link">
        Don't have an account? <Link to='/registration'>Create a New One</Link>
      </p>

      {error && <p className="error">{error}</p>}

    </div>
  );
};
