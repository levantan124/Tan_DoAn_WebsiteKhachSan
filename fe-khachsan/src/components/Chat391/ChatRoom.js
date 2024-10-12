/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useEffect } from "react";

const ChatRoom = ({ currentChatUser, messages, sendMessage, closeChatBox }) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSend = () => {
    sendMessage(input);
    setInput(""); // Clear the input after sending the message
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    const handleMediaQueryChange = (event) => {
      setIsOpen(!event.matches); 
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery); // Check current screen size

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  if (!currentChatUser || !isOpen) return null;

  return (
    <div css={chatPopupStyle}>
      <div css={headerStyle}>
        <div className="flex items-center">
          <img
            src={currentChatUser?.avatar || ""}
            alt="Avatar"
            style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
          />
          <span>{currentChatUser?.username}</span>
        </div>
        <button onClick={closeChatBox} css={closeButtonStyle}>×</button>
      </div>
      <div css={contentStyle}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: msg.sender_id === currentChatUser.id ? "flex-start" : "flex-end",
              }}
            >
              <div
                style={{
                  backgroundColor: msg.sender_id === currentChatUser.id ? "#e0f7fa" : "#f1f1f1",
                  padding: "8px 12px",
                  borderRadius: 10,
                  maxWidth: "80%",
                }}
              >
                {msg.message}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div css={footerStyle}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          css={inputStyle}
          placeholder="Type a message"
        />
        <button onClick={handleSend} css={sendButtonStyle}>
          Gửi
        </button>
      </div>
    </div>
  );
};

const chatPopupStyle = css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  max-width: 90%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  height: 400px;
`;


  const headerStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #00bfff;
    padding: 10px;
    border-radius: 10px 10px 0 0;
  `;

  const contentStyle = css`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;


  const footerStyle = css`
    padding: 10px;
    border-top: 1px solid #f1f1f1;
    display: flex;
    background-color: white;
  `;


  const inputStyle = css`
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 5px;
  `;

  const sendButtonStyle = css`
    background-color: #007bff;
    color: white;
    padding: 8px 12px;
    border-radius: 5px;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  `;

  const closeButtonStyle = css`
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: #333;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
  }

  &:focus {
    outline: none;
  }
`;


export default ChatRoom;
