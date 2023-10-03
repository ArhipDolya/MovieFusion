import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import './css/registration.css'

export const Registration = () => {
  const [formData, setFormData] = useState(
    {
    username: '',
    email: '',
    password: '',
    password2: '',
    }
  );

  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
        ...formData,
        [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault()

    // Send a POST request to Django backend for registration
    axios
        .post('http://localhost:8000/register/', formData)
        .then((res) => {
            if (res.status === 201) {
                window.location.href = 'Sign-in/'
            } else {
                setError('Registration failed. Please check your input.');
            }
        })
        .catch((error) => {
            setError('An error occurred. Please try again later.');
            console.log('Error registering user:', error);
        });
  };

  return (
    <div className="container registration-container">
        <h1>Create account</h1>

        <form onSubmit={handleSubmit}>

            <div>
                <label>Username</label><br></br>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

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
            
            <div>
                <label>Confirm Password</label><br></br>
                <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type='submit'>Create your account</button>

        </form>

        <p className="link">Already have an account? <Link to='/Sign-in'>Sign in</Link></p>

        { error && <p className='error'>{error}</p> }

    </div>
  )

}
