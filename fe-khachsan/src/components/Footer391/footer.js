/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const Footer = () => (
  <footer css={footerStyle}>
    <div css={footerContainerStyle}>
      <div css={footerColStyle}>
        <h3>Lorem</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Eius, expedita! Doloremque facilis hic veritatis ea quisquam nesciunt
          quos, ipsa ex!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
          impedit rerum molestiae fugit dignissimos ipsam ab veritatis dolor
          deserunt eaque?
        </p>
      </div>
      <div css={footerColStyle}>
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Our Team</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Book</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
      <div css={footerColStyle}>
        <h4>Legal</h4>
        <ul>
          <li><a href="#">FAQs</a></li>
          <li><a href="#">Terms & Conditions</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
      <div css={footerColStyle}>
        <h4>Resources</h4>
        <ul>
          <li><a href="#">Social Media</a></li>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Partnerships</a></li>
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