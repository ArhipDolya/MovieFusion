import styled from 'styled-components';

export const FullScreenContainer = styled.div`
  /* Full-screen container styles */
  width: 100vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

export const Container = styled.div`
  /* Container styles */
  background-color: #192a56; /* Dark blue background color */
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 678px;
  max-width: 100%;
  min-height: 400px;
`;

export const SignUpContainer = styled.div`
  /* Sign-up container styles */
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.signinIn !== true ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  ` : null}
`;

export const SignInContainer = styled.div`
  /* Sign-in container styles */
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;

export const Form = styled.form`
  /* Form styles */
  background-color: #1f347a; /* Darker blue background color */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

export const Title = styled.h1`
  /* Title styles */
  font-weight: bold;
  margin: 0;
  color: #ffffff; /* White text color */
`;

export const Input = styled.input`
  /* Input field styles */
  background-color: #334d9b; /* Darker blue background color */
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  color: #ffffff; /* White text color */
  font-size: 16px; /* Increased font size */
  background-color: #444; /* Highlighted background color */
`;

export const Button = styled.button`
  /* Button styles */
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  color: #ffffff;
  font-size: 14px; /* Larger font size for better visibility */
  font-weight: bold;
  padding: 14px 45px; /* Larger padding for better visibility */
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
};
`

export const GhostButton = styled(Button)`
  /* Ghost button styles */
  background-color: transparent;
  border-color: #ffffff;
  };
`

export const Anchor = styled.a`
  /* Anchor styles */
  color: #ffffff;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

export const OverlayContainer = styled.div`
  /* Overlay container styles */
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${props =>
    props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
  /* Overlay styles */
  background: #1f347a; /* Dark blue background color */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
};
`

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
};
`

export const LeftOverlayPanel = styled(OverlayPanel)`
  /* Left overlay panel styles */
  transform: translateX(-20%);
  ${props => props.signinIn !== true ? `transform: translateX(0);` : null}
};
`

export const RightOverlayPanel = styled(OverlayPanel)`
  /* Right overlay panel styles */
  right: 0;
  transform: translateX(0);
  ${props => props.signinIn !== true ? `transform: translateX(20%);` : null}
};
`

export const Paragraph = styled.p`
  /* Paragraph styles */
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  color: #ffffff;
  };
`