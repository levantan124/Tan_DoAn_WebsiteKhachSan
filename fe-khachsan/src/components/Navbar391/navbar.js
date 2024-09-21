/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import { MyUserContext } from "../../configs391/Context391";
import { FaArrowUp, FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; 
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import Notification from '../Main391/notification';


const NavBar = () => {
  const user = useContext(MyUserContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
    cookie.remove("token");
    cookie.remove("user");
    navigate("/", { state: { message: "You have been logged out!" } });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav css={[navStyle, isScrolled && scrolledNavStyle]}>
        <div css={infoWrapperStyle}>
          <div css={contactInfoStyle}>
            <span css={infoStyle}>
              <FaPhoneAlt /> +84 215 1050 391
            </span>
            <a href="mailto:tanhotel247@tanhotel.com" css={infoStyle}>
              <FaEnvelope /> tanhotel247@tanhotel.com
            </a>
          </div>

          <div css={socialIconsStyle}>
            <a href="https://facebook.com" css={socialIconStyle}><FaFacebookF /></a>
            <a href="https://instagram.com" css={socialIconStyle}><FaInstagram /></a>

            {!user ? (
              <Link to="/login" css={loginButtonStyle}>Đăng nhập</Link>
            ) : (
              <Link to="/" onClick={handleLogout} css={loginButtonStyle}>Đăng xuất</Link>
            )}
          </div>
        </div>

        <div css={horizontalLine}></div>

        <div css={navContentStyle}>
          <div><Link to="/" css={logoStyle}>Tan_Hotel</Link></div>
          <ul css={navLinksStyle}>
            <li><Link to="/" css={linkStyle}>Trang chủ</Link></li>
            {user && (
              <>
                <li><Link to="/booking-history" css={linkStyle}>Lịch sử đặt phòng</Link></li>
                <li css={dropdownContainerStyle}>
                  <li><Link to="/info" css={linkStyle}>{user.name}</Link></li>
                  <ul css={dropdownContentStyle}>
                    {user.role === 2 && (
                      <>
                        <li><Link to="/reservations-list" css={dropdownLinkStyle}>QL phiếu đặt phòng</Link></li>
                        <li><Link to="/services-list" css={dropdownLinkStyle}>QL dịch vụ</Link></li>
                        <li><Link to="/checkout-list" css={dropdownLinkStyle}>Trả phòng</Link></li>
                        <li><Link to="/bill-list" css={dropdownLinkStyle}>QL Hóa đơn</Link></li>
                      </>
                    )}
                    {(user.is_superuser || user.role === 1) && (
                      <li><Link to="/existing-rooms" css={dropdownLinkStyle}>QL Phòng</Link></li>
                    )}
                  </ul>
                </li>
                <li css={cartIconStyle}>
                  <Link to="/cart" css={linkStyle}>
                    <MdOutlineLocalGroceryStore />
                  </Link>
                  <Link to="#" onClick={() => setIsNotificationOpen(true)} css={linkStyle}>
                    <IoMdNotificationsOutline />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {showScrollTopButton && (
        <button onClick={scrollToTop} css={scrollTopButtonStyle}>
          <FaArrowUp />
        </button>
      )}

      <Notification isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </>
  );
};

const navStyle = css`
  position: sticky;
  top: 1rem;
  z-index: 9999;
  padding: 1px 0.8rem;
  background-color: #ffffff;
  width: 90%;
  max-width: 1300px;
  margin: 0 auto;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  transition: top 0.5s ease, width 0.5s ease, border-radius 0.3s ease;;
`;

const scrolledNavStyle = css`
  top: 0;
  background-color: #f8f9fa;
  width: 92%;
  max-width: 100%;
  border-radius: 9px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  transition: top 0.5s ease, width 0.5s ease, border-radius 0.3s ease;
`;

const navContentStyle = css`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 100%;
`;

const infoWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const contactInfoStyle = css`
  display: flex;
  gap: 1.2rem;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const socialIconsStyle = css`
  display: flex;
  gap: 0.8rem;
`;

const logoStyle = css`
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
`;

const navLinksStyle = css`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const linkStyle = css`
  font-weight: 600;
  color: black;
  transition: 0.3s;
  text-decoration: none;
  padding: 0.3rem;
  &:hover {
    color: #ff6347;
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
  background-color: #ffffff;
  min-width: 200px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  list-style: none;
`;

const dropdownLinkStyle = css`
  color: #333;
  padding: 0.5rem 1rem;
  display: block;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease, border-radius 0.3s ease;

  &:hover {
    border-radius: 10px;
    background-color: #ff6347;
    color: white;
  }
`;

const cartIconStyle = css`
  font-size: 1.3rem;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6347;
  }
`;

const loginButtonStyle = css`
  border-radius: 20px solid #333;
  font-weight: 350;
  color: black;
  transition: 0.3s;
  text-decoration: none;

  &:hover {
    color: #ff6347;
  }
`;

const horizontalLine = css`
  width: 100%;
  height: 0.5px;
  background-color: #ddd;
  margin: 0.1rem 0;
`;

const socialIconStyle = css`
  font-size: 1.1rem;
  color: #333;
  transition: color 0.3s;

  &:hover {
    color: #ff6347;
  }
`;

const infoStyle = css`
  display: flex;
  font-size:14px;
  align-items: center;
  gap: 0.4rem;
  color: #333;
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
