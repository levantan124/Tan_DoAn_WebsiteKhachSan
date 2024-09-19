import { createContext, useState } from "react";

export const MyUserContext = createContext();
export const MyDispatchContext = createContext();

export const MyUserProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
  
    const addNotification = (message) => {
      setNotifications((prevNotifications) => [...prevNotifications, { message }]);
    };
  
    return (
      <MyUserContext.Provider value={{ notifications, addNotification }}>
        {children}
      </MyUserContext.Provider>
    );
  };