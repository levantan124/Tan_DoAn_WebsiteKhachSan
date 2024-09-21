/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const Footer = () => (
  <footer css={footerStyle}>
    <div css={footerContainerStyle}>
      <div css={footerColStyle}>
        <h3>Phương châm</h3>
        <p>
        Chăm sóc tận tình
        </p>
        <p>
        Sự tiện nghi đang dạng dịch vụ.
        </p>
        <p>
        Sự hài lòng của khách hàng là ưu tiên hàng đầu. 
        </p>
      </div>
      <div css={footerColStyle}>
        <h4>Công ty</h4>
        <ul>
          <li><a href="#">Về chúng tôi</a></li>
          <li><a href="#">Đội ngũ</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Book</a></li>
          <li><a href="#">Liên hệ với chúng tôi</a></li>
        </ul>
      </div>
      <div css={footerColStyle}>
        <h4>Trợ giúp</h4>
        <ul>
          <li><a href="#">Câu hỏi thường gặp</a></li>
          <li><a href="#">Điều khoản và điểu kiện</a></li>
          <li><a href="#">Chính sách bảo mật</a></li>
        </ul>
      </div>
      <div css={footerColStyle}>
        <h4>Tài nguyên</h4>
        <ul>
          <li><a href="#">Phương tiện truyền thông xã hội</a></li>
          <li><a href="#">Trung tâm hỗ trợ</a></li>
          <li><a href="#">Quan hệ đối tác</a></li>
        </ul>
      </div>
    </div>
    <div css={footerBarStyle}>
      <p>Copyright &copy; 2024 Code Hub. All rights reserved</p>
    </div>
  </footer>
);


const footerStyle = css`
  background: var(--extra-light);
  background-color: #f0f0f0;
`;


const footerContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5rem;
  max-width: var(--max-width);
  margin: auto;
  padding: 2rem 1rem;
`;

const footerColStyle = css`
  h3, h4 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-dark);
  }

  h4 {
    font-size: 1.2rem;
  }

  p {
    margin-bottom: 1rem;
    color: var(--text-light);
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  ul li a {
    color: var(--text-light);
    text-decoration: none;
  }

  ul li a:hover {
    color: var(--text-dark);
    text-decoration: underline;
  }
`;

const footerBarStyle = css`
  position: relative;
  max-width: var(--max-width);
  margin: auto;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-light);
  text-align: center;
`;

export default Footer;