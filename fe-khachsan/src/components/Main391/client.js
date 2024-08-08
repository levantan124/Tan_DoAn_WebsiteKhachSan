/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';



const Client = () => (
  <section css={clientSectionStyle}>
    <div className="section-container client-container">
      <h2 className="section-header reveal" css={{ textAlign: 'center'}}>
        What our client say
      </h2>
      <div css={clientGridStyle}>
        <div className="client-card reveal">
          <img src="img/client01.jpg" alt="client" />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi aliquam quisquam asperiores ad recusandae architecto ratione
          </p>
        </div>
        {/* Add more client-card components here */}
      </div>
    </div>
  </section>
);

const clientSectionStyle = css`
  background-color: #f0f0f0; /* Thay đổi màu nền của section */
  padding: 2rem 0; /* Thêm padding trên và dưới */
`;

const clientGridStyle = css`
  padding-left: 10rem;
  padding-right: 10rem;
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  .client-card {
    padding: 2rem;
    background: var(--white);
    border-radius: 1rem;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: 0.5s;
    &:hover {
      box-shadow: none;
    }
    img {
      max-width: 80px;
      margin: 0 auto;
      margin-bottom: 1rem;
      border-radius: 50%;
    }
    p {
      color: var(--text-dark);
      text-align: center; /* Căn giữa văn bản */
    }
  }
`;

export default Client;