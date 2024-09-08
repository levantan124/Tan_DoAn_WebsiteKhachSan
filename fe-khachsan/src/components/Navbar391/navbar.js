/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import { MyUserContext } from "../../configs391/Context391";
import { FaArrowUp } from 'react-icons/fa';

const NavBar = () => {
  const user = useContext(MyUserContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
        setShowScrollTopButton(window.scrollY > 300);
      } else {
        setIsScrolled(false);
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    // Xóa token và user từ cookie
    cookie.remove("token");
    cookie.remove("user");
    
    // Điều hướng về trang chủ
    navigate("/", { state: { message: "You have been logged out!" } });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav css={[navStyle, isScrolled && scrolledNavStyle]}>
        <div css={logoStyle}>Tan_Hotel</div>
        
        <ul css={navLinksStyle}>
          <li><Link to="/" css={linkStyle}>Trang chủ</Link></li>
          {user ? (
            <>
              <li><Link to="/info" css={linkStyle}>{user.name}</Link></li>
              <li><Link to="/booking-history" css={linkStyle}>Lịch sử đặt phòng</Link></li>
              {user.role === 2 && (
                <li css={dropdownContainerStyle}>
                  <span css={linkStyle}>QL Lễ Tân</span>
                  <ul css={dropdownContentStyle}>
                    <li><Link to="/reservations-list" css={dropdownLinkStyle}>QL phiếu đặt phòng</Link></li>
                    <li><Link to="/services-list" css={dropdownLinkStyle}>QL dịch vụ</Link></li>
                    <li><Link to="/checkout-list" css={dropdownLinkStyle}>Trả phòng</Link></li>
                    <li><Link to="/manage-bill" css={dropdownLinkStyle}>QL Hóa đơn</Link></li>
                  </ul>
                </li>
              )}
              {(user.is_superuser || user.role === 1) && (
                <li><Link to="/existing-rooms" css={linkStyle}>QL Phòng</Link></li>
              )}
              <li><Link to="/" onClick={handleLogout} css={linkStyle}>Đăng xuất</Link></li>
            </>
          ) : (
            <li><Link to="/login" css={linkStyle}>Đăng nhập</Link></li>
          )}
        </ul>
      </nav>

      {showScrollTopButton && (
        <button onClick={scrollToTop} css={scrollTopButtonStyle}>
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

const navStyle = css`
  position: sticky; 
  top: 1rem;
  z-index: 9999;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  width: 90%;
  width: 1200px;
  margin: 0 auto;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  transition: top 0.3s ease, width 0.3s ease;
`;

const scrolledNavStyle = css`
  top: 0;
  width: 1300px;
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

const dropdownContainerStyle = css`
  position: relative;
  display: inline-block;

  &:hover ul {
    display: block;
  }
`;

const dropdownContentStyle = css`
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  list-style: none;
`;

const dropdownLinkStyle = css`
  color: var(--text-dark);
  padding: 0.5rem;
  display: block;
  text-decoration: none;

  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

const scrollTopButtonStyle = css`
  position: fixed;
  bottom: 3rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(to bottom, #ee0979, #ff6a00);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background: linear-gradient(to bottom, #f00, #600500);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
`;

export default NavBar;
