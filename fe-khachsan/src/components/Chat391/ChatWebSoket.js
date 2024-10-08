import { useEffect, useState } from "react";

const ChatWebSocket = ( currentChatUser, user, room_name) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!currentChatUser) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${room_name}/`);
    setSocket(ws);

    ws.onopen = () => {
        console.log("open ws")
      const message = {
        type: "previous_messages",
        sender_id: user.id,
        receiver_id: currentChatUser.id,
        room_name: room_name, 
      };
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'previous_messages') {
        setMessages(data.messages);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    return () => {
      ws.close();
    };
  }, [currentChatUser, room_name]); 

  const sendMessage = (input) => {
    if (socket && input) {
      const message = {
        type: "chat",
        message: input,
        sender_id: user.id,
        receiver_id: currentChatUser.id,
        sender: user,
        room_name: room_name, 
      };
      socket.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage };
};

export default ChatWebSocket;
