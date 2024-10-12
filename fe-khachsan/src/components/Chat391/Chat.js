/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const popupStyle = css`
    display: ${isOpen ? 'block' : 'none'};
    position: fixed;
    bottom: 1rem;
    right: 20px;
    width: 350px;
    height: 430px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: all 0.3s ease;
  `;

  const buttonStyle = css`
    position: fixed;
    bottom: 11rem;
    right: 28px; 
    padding: 8px;
    border-radius: 50%;
    border: 2px solid black; /* Thêm viền đen */
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease; /* Thêm transition cho transform */
    width: 60px; /* Sửa weight thành width */
    height: 60px;
    z-index: 1001; /* Đảm bảo nút nằm trên các thành phần khác */

    &:hover {
      background-color: #FF6347; /* Màu đỏ khi hover */
      transform: scale(1.1); /* Phóng to một chút khi hover */
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 4px rgba(255, 99, 71, 0.3);
    }

    svg {
      width: 32px;
      height: 32px;
    }
  `;

  const closeButtonStyle = css`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: #007bff;

    &:hover {
      color: #0056b3;
    }
  `;

  return (
    <div>
      {/* Ẩn nút khi popup mở */}
      {!isOpen && (
        <button onClick={togglePopup} css={buttonStyle}>
          Chat Bot
        </button>
      )}
      <div css={popupStyle}>
        <iframe
          width="100%"
          height="100%"
          allow="microphone;"
          src="https://console.dialogflow.com/api-client/demo/embedded/d1133209-48dd-4403-b270-79679089950d"
        ></iframe>
        <button onClick={togglePopup} css={closeButtonStyle}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
