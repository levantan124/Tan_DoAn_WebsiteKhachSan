/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

const Statistics = ({ messages }) => {
  const totalMessages = messages.length;
  const userMessages = messages.filter(msg => msg.sender === 'user').length;
  const botMessages = messages.filter(msg => msg.sender === 'bot').length;

  return (
    <div css={css`
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    `}>
      <h2>Thống Kê Tin Nhắn</h2>
      <p>Tổng số tin nhắn: <strong>{totalMessages}</strong></p>
      <p>Số tin nhắn từ khách hàng: <strong>{userMessages}</strong></p>
      <p>Số tin nhắn từ bot: <strong>{botMessages}</strong></p>
    </div>
  );
};

export default Statistics;
