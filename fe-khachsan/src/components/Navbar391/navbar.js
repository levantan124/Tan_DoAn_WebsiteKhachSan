/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import { MyUserContext } from "../../configs391/Context391";

const NavBar = () => {
  const user = useContext(MyUserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token và user từ cookie
    cookie.remove("token");
    cookie.remove("user");
    
    // Điều hướng về trang chủ
    navigate("/", { state: { message: "You have been logged out!" } });
  };

  return (
    <nav css={navStyle}>
      <div css={logoStyle}>Tan_Hotel</div>
     
      <ul css={navLinksStyle}>
        <li><Link to="/" css={linkStyle}>Trang chủ</Link></li>
        <li><Link to="/booking" css={linkStyle}>Đặt phòng</Link></li>
        {user ? (
          <>
            <li><Link to="/info" css={linkStyle}>{user.name}</Link></li>
            <li><Link to="/" onClick={handleLogout} css={linkStyle}>Đăng xuất</Link></li>
            {user.role === 2 && (
              <>
                <li><Link to="/reservations-list/" css={linkStyle}>QL phiếu đặt phòng</Link></li>
                <li><Link to="/services-list/" css={linkStyle}>QL dịch vụ</Link></li>
              </>
            )}
          </>
        ) : (
          <li><Link to="/login" css={linkStyle}>Đăng nhập</Link></li>
        )}
      </ul>
    </nav>
  );
};

const navStyle = css`
  max-width: calc(100% - 20rem);
  position: fixed;
  z-index: 9999;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  width: 95%;
  top: 1rem;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
`;

const logoStyle = css`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-dark);
`;

const navLinksStyle = css`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const linkStyle = css`
  font-weight: 600;
  color: var(--text-light);
  transition: 0.3s;
  text-decoration: none;

  &:hover {
    color: var(--primary-color);
  }
`;

export default NavBar;
