import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/login.css';
import * as Components from './Components';

import ReCAPTCHA from 'react-google-recaptcha';


export const AuthenticationForm = () => {
  const [signIn, toggleSignIn] = useState(true);
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
  const [registrationFormData, setRegistrationFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;
    setRegistrationFormData({ ...registrationFormData, [name]: value });
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:8000/api/v1/login/', loginFormData)
      .then((res) => {
        if (res.status === 200) {
          setToken(res.data.access);
          localStorage.setItem('token', res.data.access);
          window.location.href = '/';
        } else {
          setError('Invalid email or password');
        }
      })
      .catch((error) => {
        setError('An error occurred. Please try again later.');
        console.error('Error logging in:', error);
      });
  };

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();

    // Check if reCAPTCHA has been completed
    if (!recaptchaToken) {
      setFormSubmitted(true);
      return;
    }

    const registrationData = {
      ...registrationFormData,
      recaptchaToken: recaptchaToken,
    }

    axios
      .post('http://localhost:8000/api/v1/register/', registrationData)
      .then((res) => {
        if (res.status === 201) {
          toggleSignIn(true);
          setError('Registration successful. Please sign in.');
        } else {
          setError('Registration failed. Please check your input.');
        }
      })
      .catch((error) => {
        setError('An error occurred. Please try again later.');
        console.error('Error registering user:', error);
      });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Components.FullScreenContainer>
      <Components.Container>
          <div>
            <Components.SignUpContainer signinIn={signIn}>
              <Components.Form>
                <Components.Title>{signIn ? 'Sign In' : 'Create Account'}</Components.Title>
                <Components.Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={registrationFormData.username}
                  onChange={handleRegistrationChange}
                  required
                />
                <Components.Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registrationFormData.email}
                  onChange={handleRegistrationChange}
                  required
                />
                <Components.Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registrationFormData.password}
                  onChange={handleRegistrationChange}
                  required
                />
                {!signIn && (
                  <Components.Input
                    type="password"
                    name="password2"
                    placeholder="Confirm Password"
                    value={registrationFormData.password2}
                    onChange={handleRegistrationChange}
                    required
                  />
                )}

                <ReCAPTCHA className='recaptcha-container'
                  sitekey='6LcOOr8oAAAAAD3YScusJhiClf928fUkzIYsycoB'
                  onChange={handleRecaptchaChange}
                />

                {!recaptchaToken && formSubmitted && <p className="error">Please complete the reCAPTCHA verification.</p>}

                <Components.Button onClick={signIn ? handleLoginSubmit : handleRegistrationSubmit}>
                  {signIn ? 'Sign In' : 'Sign Up'}
                </Components.Button>
              </Components.Form>
              {error && <p className="error">{error}</p>}
            </Components.SignUpContainer>

            <Components.SignInContainer signinIn={signIn}>
              <Components.Form>
                <Components.Title>Sign in</Components.Title>
                <Components.Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginFormData.email}
                  onChange={handleLoginChange}
                  required
                />
                <Components.Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginFormData.password}
                  onChange={handleLoginChange}
                  required
                />
                <Components.Button onClick={handleLoginSubmit}>Sign In</Components.Button>
              </Components.Form>
            </Components.SignInContainer>

            <Components.OverlayContainer signinIn={signIn}>
              <Components.Overlay signinIn={signIn}>
                <Components.LeftOverlayPanel signinIn={signIn}>
                  <Components.Title>Welcome Back!</Components.Title>
                  <Components.Paragraph>To keep connected with us please login with your personal info</Components.Paragraph>
                  <Components.GhostButton onClick={() => toggleSignIn(true)}>Sign In</Components.GhostButton>
                </Components.LeftOverlayPanel>

                <Components.RightOverlayPanel signinIn={signIn}>
                  <Components.Title>Hello, Friend!</Components.Title>
                  <Components.Paragraph>Enter your personal details and start the journey with us</Components.Paragraph>
                  <Components.GhostButton onClick={() => toggleSignIn(false)}>Sign Up</Components.GhostButton>
                </Components.RightOverlayPanel>
              </Components.Overlay>
            </Components.OverlayContainer>
          </div>
      </Components.Container>
    </Components.FullScreenContainer>
  );
};