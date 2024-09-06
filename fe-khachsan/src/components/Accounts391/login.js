/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import cookie from "react-cookies";
import APIs, { endpoints, authAPI } from "../../configs391/API391";

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

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginError = (errorStatus) => {
    switch (errorStatus) {
      case 400:
        setError("Sai tên đăng nhập hoặc mật khẩu");
        break;
      default:
        setError("Đăng nhập không thành công");
        break;
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      let res = await APIs.post(endpoints['login'], {
        'username': username,
        'password': password,
        'client_id': "5j5685BlfLjZ1SZ50c59oM6C57M2lQnhMXmK9b7e",
        'client_secret': "kQW8noCmtlgt1r0S9NsNAgpMmERDJDlbVbplYBvKWepg6kQOE4GWH3zaE9go6tGndYFVafZy7ApxisTieYurUGQuGxwfduM50YK8Q1l9fiUj3bPRcVcdF6cUOBhXhhp9",
        'grant_type': "password",
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      if (res.status === 200) {
        cookie.save("token", res.data.access_token);
        let userdata = await authAPI().get(endpoints['current_user']);
        cookie.save('user', userdata.data);
  
        // Redirect based on role
        if (userdata.data.role === 2) {
          nav("/staff");
        } else if (userdata.data.role === 1) {
          nav("/admin");
        } else {
          nav("/");
        }
      } else {
        handleLoginError(res.status);
      }
    } catch (ex) {
      console.error('Exception:', ex);
      setError("Sai tên hoặc mật khẩu, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  

  const register = () => {
    nav("/signup");
  };

  return (
    <div css={containerStyles}>
      <div css={boxStyles}>
        {isLogin ? (
          <form css={formStyles} onSubmit={login}>
            <div css={topHeaderStyles}>
              <h2>Đăng nhập</h2>
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
                  required
                />
                <label htmlFor="logUsername">Tên đăng nhập</label>
              </div>
              <div css={inputFieldStyles}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="logPassword"
                  css={inputBoxStyles}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="logPassword">Mật khẩu</label>
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
              <div css={forgotStyles}>
                <a href="#" onClick={() => { /* Xử lý quên mật khẩu */ }}>Quên mật khẩu?</a>
              </div>
            </div>
          </form>
        ) : (
          <form css={formStyles}>
            <div css={topHeaderStyles}>
              <h2>Đăng ký</h2>
            </div>
            <div css={inputGroupStyles}>
              <div css={inputFieldStyles}>
                <input
                  type="text"
                  id="regUser"
                  css={inputBoxStyles}
                  required
                />
                <label htmlFor="regUser">Tên đăng nhập</label>
              </div>
              <div css={inputFieldStyles}>
                <input
                  type="email"
                  id="regEmail"
                  css={inputBoxStyles}
                  required
                />
                <label htmlFor="regEmail">Email</label>
              </div>
              <div css={inputFieldStyles}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="regPassword"
                  css={inputBoxStyles}
                  required
                />
                <label htmlFor="regPassword">Mật khẩu</label>
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
                <input type="checkbox" id="formCheck-2" css={checkStyles} />
                <label htmlFor="formCheck-2">I agree to the terms & conditions</label>
              </div>
              <div css={inputFieldStyles}>
                <input type="submit" value="Đăng ký" css={inputSubmitStyles} />
              </div>
            </div>
          </form>
        )}
        <div css={switchStyles}>
          <a
            href="#"
            css={[switchLinkStyles, isLogin && activeSwitchLinkStyles]}
            onClick={() => setIsLogin(true)}
          >
            Đăng nhập
          </a>
          <a
            href="#"
            css={[switchLinkStyles, !isLogin && activeSwitchLinkStyles]}
            onClick={() => setIsLogin(false)}
          >
            Đăng ký
          </a>
          <div css={btnActiveStyles} style={{ left: isLogin ? '0' : '50%' }}></div>
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
  padding-top: 5rem;
`;

const boxStyles = css`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 60px 20px 30px 20px;
  background: rgba(255, 220, 220, 0.5);
  height: 580px;
  width: 580px;
  border-radius: 30px;
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  border: 3px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
`;

const formStyles = css`
  position: absolute;
  width: 85%;
  left: 27px;
  transition: 0.5s ease-in-out;
`;

const topHeaderStyles = css`
  text-align: center;
  margin: 30px 0;

  h2 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  small {
    display: block;
    color: #555;
  }
`;

const inputGroupStyles = css`
  width: 100%;
`;

const inputFieldStyles = css`
  margin: 12px 0;
  position: relative;
`;

const inputBoxStyles = css`
  width: 100%;
  height: 40px;
  font-size: 15px;
  color: #040404;
  border: none;
  outline: none;
  border-radius: 10px;
  padding: 7px 20px 7px 20px;
  background: rgba(224, 223, 223, 0.7);
  backdrop-filter: blur(10px);
`;

const eyeAreaStyles = css`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  cursor: pointer;
`;

const visibleIconStyles = css`
  color: #444;
`;

const hiddenIconStyles = css`
  color: #444;
  opacity: 0;
`;

const rememberStyles = css`
  display: flex;
  font-size: 14px;
  margin: 12px 0 30px 0;
`;

const checkStyles = css`
  margin-right: 5px;
`;

const inputSubmitStyles = css`
  width: 100%;
  height: 50px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  background: #011F51;
  color: #fff;
  cursor: pointer;
  box-shadow: 0px 5px 20px rgba(1, 31, 81, 0.5);
  transition: 0.5s;

  &:hover {
    box-shadow: none;
  }
`;

const forgotStyles = css`
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 40px;

  a {
    text-decoration: none;
    color: #040404;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const switchStyles = css`
  display: flex;
  position: absolute;
  bottom: 50px;
  left: 25px;
  width: 85%;
  height: 50px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const switchLinkStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  width: 50%;
  border-radius: 10px;
  z-index: 10;
`;

const activeSwitchLinkStyles = css`
  background: #011F51;
`;

const btnActiveStyles = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 50px;
  background: #011F51;
  border-radius: 10px;
  box-shadow: 2px 0px 12px rgba(0, 0, 0, 0.2);
  transition: 0.5s ease-in-out;
`;

const errorStyles = css`
  color: red;
  text-align: center;
  margin: 10px 0;
`;

export default Login;