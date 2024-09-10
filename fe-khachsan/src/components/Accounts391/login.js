/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import Signup from './singup'; // Fixed the import from 'singup' to 'Signup'
import GoogleButton from './google';
import APIs, { endpoints, authAPI } from '../../configs391/API391';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginError = (errorStatus) => {
    switch (errorStatus) {
      case 400:
        setError('Sai tên đăng nhập hoặc mật khẩu');
        break;
      default:
        setError('Đăng nhập không thành công');
        break;
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res = await APIs.post(endpoints['login'], new URLSearchParams({
        'username': username,
        'password': password,
        'client_id': '5j5685BlfLjZ1SZ50c59oM6C57M2lQnhMXmK9b7e',
        'client_secret': 'kQW8noCmtlgt1r0S9NsNAgpMmERDJDlbVbplYBvKWepg6kQOE4GWH3zaE9go6tGndYFVafZy7ApxisTieYurUGQuGxwfduM50YK8Q1l9fiUj3bPRcVcdF6cUOBhXhhp9',
        'grant_type': 'password',
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (res.status === 200) {
        cookie.save('token', res.data.access_token);
        let userdata = await authAPI().get(endpoints['current_user']);
        cookie.save('user', userdata.data);

        // Redirect based on role
        if (userdata.data.role === 2) {
          nav('/staff');
        } else if (userdata.data.role === 1) {
          nav('/admin');
        } else {
          nav('/');
        }
      } else {
        handleLoginError(res.status);
      }
    } catch (ex) {
      console.error('Exception:', ex);
      setError('Sai tên hoặc mật khẩu, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const register = () => {
    nav('/signup');
  };

  return (
    <div css={containerStyles}>
      <div css={boxStyles}>
        {isLogin ? (
          <form css={formStyles} onSubmit={login}>
            <div css={headerStyles}>
              <h2>ĐĂNG NHẬP</h2>
            </div>
            {error && <div css={errorStyles}>{error}</div>}
            <div css={inputGroupStyles}>
              <div css={inputFieldStyles}>
                <input
                  type="text"
                  id="logUsername"
                  css={inputBoxStyles}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tên đăng nhập"
                  required
                />
              </div>
              <div css={inputFieldStyles}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="logPassword"
                  css={inputBoxStyles}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  required
                />
                <div css={eyeAreaStyles} onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon
                    icon={faEye}
                    css={showPassword ? hiddenIconStyles : visibleIconStyles}
                  />
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    css={showPassword ? visibleIconStyles : hiddenIconStyles}
                  />
                </div>
              </div>
              <div css={rememberStyles}>
                <input type="checkbox" id="formCheck" css={checkStyles} />
                <label htmlFor="formCheck">Nhớ tài khoản</label>
              </div>
              <div css={inputFieldStyles}>
                <input type="submit" value="Đăng nhập" css={inputSubmitStyles} disabled={loading} />
              </div>
              <GoogleButton />
              <div css={forgotStyles}>
                <a href="#">Quên mật khẩu?</a>
              </div>
            </div>
          </form>
        ) : (
          <Signup />
        )}
        <div css={switchStyles}>
          {isLogin ? (
            <a href="" css={switchLinkStyles} onClick={register}>
              Đăng ký tài khoản mới
            </a>
          ) : (
            <a href="#" css={loginLinkStyles} onClick={() => setIsLogin(true)}>
              Đăng nhập
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const containerStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/path/to/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-top: 1rem;
`;

const boxStyles = css`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1px 20px 30px 30px;
  background: rgba(255, 220, 220, 0.5);
  height: 500px; 
  width: 500px;
  border-radius: 30px;
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  border: 3px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  align-items: center; /* Center contents horizontally */
  justify-content: center; /* Center contents vertically */
`;

const formStyles = css`
  position: relative;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center contents horizontally */
`;

const headerStyles = css`
  text-align: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
  }
`;

const inputGroupStyles = css`
  width: 100%;
  display: flex;
  flex-direction: column; /* Stack inputs vertically */
  align-items: center; /* Center contents horizontally */
`;

const inputFieldStyles = css`
  position: relative; /* Add this to position eyeAreaStyles relative to this container */
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const inputBoxStyles = css`
  width: 100%;
  max-width: 500px; 
  height: 40px;
  font-size: 15px;
  color: #7f8c8d;
  border: 1px solid #dcdbe1;
  border-radius: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  padding-right: 40px; /* Add extra padding to avoid text overlap with the icon */
`;

const eyeAreaStyles = css`
  position: absolute;
  top: 50%;
  right: 10px; /* Adjust right position to fit within the padding */
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1; /* Ensure it's above the input field */
`;


const visibleIconStyles = css`
  color: #555;
`;

const hiddenIconStyles = css`
  color: #555;
  opacity: 0;
`;

const rememberStyles = css`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 15px 0;
`;

const checkStyles = css`
  margin-right: 8px;
`;

const inputSubmitStyles = css`
  border: none;
  background: #ff6347;
  color: #fff;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0; /* Adjust margin for better spacing */
  width: 100%; /* Ensure button is full width */
  max-width: 100%; /* Limit width of button */
  
  &:hover {
    background: #e5533d;
  }
`;

const forgotStyles = css`
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 20px;

  a {
    text-decoration: none;
    color: #ff6347;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const switchStyles = css`
  display: flex;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const switchLinkStyles = css`
  color: #ff6347;
  font-weight: bold;
  text-decoration: none;
  margin-bottom: 50px;
  &:hover {
    text-decoration: underline;
  }
`;

const loginLinkStyles = css`
  color: #004080;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
`;

const errorStyles = css`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
`;

const googleButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4285f4;
  color: #fff;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
  width: 100%;
  max-width: 100%;
  text-align: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ae8;
  }
`;

const googleIconStyles = css`
  margin-right: 10px;
`;
export default Login;
