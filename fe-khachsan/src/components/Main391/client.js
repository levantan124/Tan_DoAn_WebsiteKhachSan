/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';



const Client = () => (
  <section css={clientSectionStyle}>
    <h2 className="section-header reveal" css={{ textAlign: 'center'}}>
        KHÁCH HÀNG CỦA CHÚNG TÔI NÓI GÌ
    </h2>
    <div className="section-container client-container">
      <div css={clientGridStyle}>
        <div className="client-card reveal">
          <img src="https://res.cloudinary.com/vantan/image/upload/v1726841371/istockphoto-1386479313-612x612_scebcr.jpg" alt="client" />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi aliquam quisquam asperiores ad recusandae architecto ratione
          </p>
        </div>
        <div className="client-card reveal">
          <img src="https://res.cloudinary.com/vantan/image/upload/v1726841365/istockphoto-1311084168-612x612_mlqozn.jpg" alt="client" />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi aliquam quisquam asperiores ad recusandae architecto ratione
          </p>
        </div>
        <div className="client-card reveal">
          <img src="https://res.cloudinary.com/vantan/image/upload/v1726841360/istockphoto-1129638598-612x612_jt1wor.jpg" alt="client" />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi aliquam quisquam asperiores ad recusandae architecto ratione
          </p>
        </div>
        <div className="client-card reveal">
          <img src="https://res.cloudinary.com/vantan/image/upload/v1726841536/istockphoto-1351285381-612x612_uvuqkj.jpg" alt="client" />
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
  padding: 5rem 0; /* Thêm padding trên và dưới */
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