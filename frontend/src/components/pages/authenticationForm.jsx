import React, { useState } from 'react';
import axios from 'axios';
import './css/login.css';
import * as Components from './Components'; // Import your styled components

export const AuthenticationForm = () => {
  const [signIn, toggleSignIn] = useState(true);

  // Define separate formData for login and registration
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });

  const [registrationFormData, setRegistrationFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState('');

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;
    setRegistrationFormData({
      ...registrationFormData,
      [name]: value,
    });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    // Send a POST request to log in using loginFormData
    axios
      .post('http://localhost:8000/login/', loginFormData)
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

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();

    // Send a POST request to register a new user using registrationFormData
    axios
      .post('http://localhost:8000/register/', registrationFormData)
      .then((res) => {
        if (res.status === 201) {
          // Registration was successful, switch to sign-in form
          toggleSignIn(true);
          setError('Registration successful. Please sign in.');
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
    <Components.FullScreenContainer>
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>{signIn ? 'Sign In' : 'Create Account'}</Components.Title>

              <Components.Input
                type='text'
                name='username'
                placeholder='Username'
                value={registrationFormData.username}
                onChange={handleRegistrationChange}
                required
              />

            <Components.Input
              type='email'
              name='email'
              placeholder='Email'
              value={registrationFormData.email}
              onChange={handleRegistrationChange}
              required
            />
            <Components.Input
              type='password'
              name='password'
              placeholder='Password'
              value={registrationFormData.password}
              onChange={handleRegistrationChange}
              required
            />
            {!signIn && (
              <Components.Input
                type='password'
                name='password2' // Use 'password2' as the name
                placeholder='Confirm Password'
                value={registrationFormData.password2}
                onChange={handleRegistrationChange}
                required
              />
            )}
            <Components.Button onClick={signIn ? handleLoginSubmit : handleRegistrationSubmit}>
              {signIn ? 'Sign In' : 'Sign Up'}
            </Components.Button>
          </Components.Form>
          {error && <p className='error'>{error}</p>}
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Sign in</Components.Title>
            <Components.Input
              type='email'
              name='email'
              placeholder='Email'
              value={loginFormData.email} // Use loginFormData for email in sign-in
              onChange={handleLoginChange}
              required
            />
            <Components.Input
              type='password'
              name='password'
              placeholder='Password'
              value={loginFormData.password} // Use loginFormData for password in sign-in
              onChange={handleLoginChange}
              required
            />
            <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
            <Components.Button onClick={handleLoginSubmit}>Sign In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggleSignIn(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Enter your personal details and start the journey with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggleSignIn(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </Components.FullScreenContainer>
  );
};
