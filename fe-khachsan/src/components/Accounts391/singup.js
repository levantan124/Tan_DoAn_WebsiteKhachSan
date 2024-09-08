/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../configs391/API391'; 

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [DOB, setDOB] = useState('');
  const [sex, setSex] = useState('1');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError('');

    const userData = {
      username,
      name,
      email,
      password,
      DOB,
      address,
      phone,
      sex: parseInt(sex, 10), // Convert to number
      role: 3
    };

    try {
      await registerUser(userData);
      console.log(userData)
      nav('/login');
    } catch (error) {
      setError(`Có lỗi xảy ra: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={containerStyles}>
      <div css={boxStyles}>
        <form css={formStyles} onSubmit={handleSignup}>
          <div css={topHeaderStyles}>
            <h2>ĐĂNG KÝ</h2>
          </div>
          {error && <div css={errorStyles}>{error}</div>}
          <div css={inputGroupStyles}>
            <div css={inputFieldStyles}>
              <input
                type="text"
                id="signUpUsername"
                css={inputBoxStyles}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên đăng nhập"
                required
              />
            </div>
            <div css={inputFieldStyles}>
              <input
                type="text"
                id="signUpName"
                css={inputBoxStyles}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Họ tên"
                required
              />
            </div>
            <div css={inputFieldStyles}>
              <input
                type="email"
                id="signEmail"
                css={inputBoxStyles}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div css={inputFieldStyles}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="signUpPassword"
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
            <div css={inputFieldStyles}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="signUpConfirmPassword"
                css={inputBoxStyles}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
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
            <div css={inputFieldStyles}>
              <input
                type="date"
                id="signUpBirthDate"
                css={inputBoxStyles}
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
                placeholder="Ngày sinh"
                required
              />
            </div>
            <div css={inputFieldStyles}>
              <select
                id="signUpGender"
                css={inputBoxStyles}
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="1">Nam</option>
                <option value="2">Nữ</option>
              </select>
            </div>
            <div css={inputFieldStyles}>
              <input
                type="text"
                id="signUpAddress"
                css={inputBoxStyles}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ"
                required
              />
            </div>
            <div css={inputFieldStyles}>
              <input
                type="tel"
                id="signUpPhoneNumber"
                css={inputBoxStyles}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại"
                required
              />
            </div>
            <div css={inputFieldStyles}>
              <input
                type="submit"
                value="Đăng ký"
                css={inputSubmitStyles}
                disabled={loading}
              />
            </div>
          </div>
        </form>
        <div css={switchStyles}>
          <a href="" css={switchLinkStyles} onClick={() => nav('/login')}>
            Đã có tài khoản? Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

// Các styles giữ nguyên như cũ
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
  height: 750px;
  width: 500px;
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
`;

const inputGroupStyles = css`
  width: 100%;
`;

const inputFieldStyles = css`
  margin: 20px 0;
  position: relative;
`;

const inputBoxStyles = css`
  width: 100%;
  height: 40px;
  font-size: 15px;
  color: #7f8c8d;
  border: 1px solid #dcdbe1;
  border-radius: 20px;
  padding: 0 20px;
  box-sizing: border-box;
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
  width:100%;

  &:hover {
    background: #e5533d;
  }
`;

const eyeAreaStyles = css`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
`;

const visibleIconStyles = css`
  display: inline;
`;

const hiddenIconStyles = css`
  display: none;
`;

const switchStyles = css`
  display: flex;
  position: absolute;
  bottom: 10px; /* Adjusted to place 10px from the bottom */
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
  margin-bottom: 60px;
  &:hover {
    text-decoration: underline;
  }
`;

const errorStyles = css`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
`;

export default Signup;
