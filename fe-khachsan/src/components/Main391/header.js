/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const Header = () => (
  <section css={headerContainerStyle}>
    <div css={headerImageContainerStyle}>
      <div css={headerContentStyle}>
        <h1 className="reveal">Chào mừng đến với khách sạn của chúng tôi.</h1>
        <p className="reveal">
        Trải nghiệm dịch vụ đẳng cấp, đặt phòng ngay hôm nay!
        </p>
      </div>
      <div css={bookingWrapperStyle}>
        <div css={bookingContainerStyle}>
          <div className="form-group reveal" css={formGroupStyle}>
            <div className="input-group">
              <input type="text" />
              <label>Location</label>
            </div>
            <p>Where are you going?</p>
          </div>
          <div className="form-group reveal" css={formGroupStyle}>
            <div className="input-group">
              <input type="text" />
              <label>Check In</label>
            </div>
            <p>Add date</p>
          </div>
          <div className="form-group reveal" css={formGroupStyle}>
            <div className="input-group">
              <input type="text" />
              <label>Check Out</label>
            </div>
            <p>Add date</p>
          </div>
          <div className="form-group reveal" css={formGroupStyle}>
            <div className="input-group">
              <input type="text" />
              <label>Guests</label>
            </div>
            <p>Add guests</p>
          </div>
        </div>
        <button className="btn reveal" css={buttonStyle}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </div>
  </section>
);

const headerContainerStyle = css`
  padding-top: 8rem;
  padding-left: 10rem;
  padding-right: 10rem;
`;

const headerImageContainerStyle = css`
  position: relative;
  min-height: 500px;
  background-image: linear-gradient(to right, rgba(44, 56, 85, 0.9), rgba(100, 125, 187, 0.1)), url('https://res.cloudinary.com/vantan/image/upload/v1723028712/hotel05_qg1s57.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 2rem;
`;

const headerContentStyle = css`
  max-width: 600px;
  padding: 5rem 2rem;
  color: var(--white);
`;

const bookingWrapperStyle = css`
  position: absolute;
  bottom: -5rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 6rem);
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.2);
  border-radius: 2rem;
`;

const bookingContainerStyle = css`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
`;

const formGroupStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;

  padding-bottom: 1rem; /* Khoảng cách dưới các phần tử */
  .input-group {
    position: relative;
    width: 100%;
    input {
      width: 100%;
      padding: 10px 0;
      font-size: 1rem;
      border: none;
      outline: none;
      background: transparent;
      border-bottom: 1px solid #000; /* Đường gạch chân màu đen */
      color: var(--text-dark);
    }
    label {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--text-dark);
      pointer-events: none;
      transition: 0.5s;
    }
    input:focus ~ label {
      font-size: 0.8rem;
      top: 0;
    }
    input:focus {
      border-bottom: 1px solid #000; /* Đường gạch chân màu đen khi focus */
    }
  }
  p {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-light);
  }
`;

const buttonStyle = css`
  width: 50px;
  height: 50px;
  outline: none;
  border: none;
  font-size: 1.5rem;
  color: var(--white);
  background: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background: var(--primary-color-dark);
  }
`;

export default Header;