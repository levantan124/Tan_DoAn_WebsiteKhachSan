import React, { useState, useEffect } from "react";
// import avatar_default from '../assets/default_avatar.png';

const ChatRoom = ({ currentChatUser, messages, sendMessage,  closeChatBox }) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSend = () => {
    sendMessage(input);
    setInput(""); // Clear the input after sending the message
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    const handleMediaQueryChange = (event) => {
      setIsOpen(!event.matches); // Close if screen is smaller than 600px
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery); // Check current screen size

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  if (!currentChatUser || !isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-3/12 bg-white shadow-lg rounded-t-lg z-10 mr-5  border-orange-200">
      <div className="flex justify-between items-center bg-sky-300  p-3 rounded-t-lg">
        <div className="flex">
          <img
            src={currentChatUser?.avatar ? currentChatUser?.avatar : ""}
            alt="Avatar"
            className="w-8 h-8 rounded-full mx-2"
          />
          <h2 className="text-lg font-bold">{currentChatUser.username}</h2>
        </div>
        <button onClick={closeChatBox} className="text-orange-700 text-xl hover:bg-red-50 px-2">
          X
        </button>
      </div>
      <div className="flex flex-col mt-4 h-64 overflow-y-scroll pl-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex items-start ${msg.sender_id === currentChatUser.id ? "self-start" : "self-end"}`}
          >
            {msg.sender_id === currentChatUser.id ? (
              <>
                <img
                  src={msg.sender?.avatar ? msg.sender.avatar : ""}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className={`py-1 px-3 rounded-lg bg-green-100`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </>
            ) : (
              <>
                <div className={`py-1 px-3 rounded-lg bg-gray-200`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
                <img
                  src={msg.sender?.avatar ? msg.sender.avatar : ""}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full ml-2"
                />
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex pl-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-[80%] pl-2 border border-gray-300 rounded-lg mr-2"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="bg-blue-400 hover:bg-blue-800 text-white p-2 rounded-lg"
        >
          Gửi
        </button>
      </div>

      
    </div>

    
  );
};

export default ChatRoom;
