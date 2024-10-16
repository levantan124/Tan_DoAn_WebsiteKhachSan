/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useContext, useRef, useState } from "react";  
import { useLocation, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { MyDispatchContext } from '../../configs391/Context391';
import { authAPI2,authAPI, endpoints } from "../../configs391/API391";
import NavBar from "../Navbar391/navbar";
import Header from "../Main391/header";
import Popular from "../Main391/popular";
import Client from "../Main391/client";
import Reward from "../Main391/reward";
import Footer from "../Footer391/footer";
import Sale from "../Main391/sale";
import { motion } from 'framer-motion';
import { MyUserContext } from '../../configs391/Context391';
import ChatRoom391 from "../Chat391/ChatRoom";
import ChatWebSocket391 from "../Chat391/ChatWebSoket";
import ChatPopup from '../Chat391/Chat';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useContext(MyDispatchContext);
    const [currentChatUser, setCurrentChatUser] = useState(null);
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [messages2, setMessages2] = useState([]);
    const user = useContext(MyUserContext);
    const [isVisible, setIsVisible] = useState({
        header: false,
        popular: false,
        client: false,
        reward: false,
        footer: false,
    });

    const fetchReceptionists = async () => {
        try {
            const response = await authAPI().get('/accounts/'); // Gọi API để lấy danh sách tài khoản
    
            const accounts = response.data; // Dữ liệu tài khoản từ phản hồi
            console.log("All Accounts:", accounts);
    
            // Lọc ra tài khoản có role 2
            const receptionists = accounts.filter(account => account.role === 2);
    
            console.log("Receptionists:", receptionists);
    
            // Chọn ngẫu nhiên một tài khoản Lễ tân
            if (receptionists.length > 0) {
                return receptionists[Math.floor(Math.random() * receptionists.length)];
            } else {
                throw new Error("No receptionists found.");
            }
        } catch (error) {
            console.error("Error fetching receptionists:", error);
            throw error;
        }
    };
        
    const openChatBox = async () => {
        if (!chatBoxOpen) {
            try {
                const receptionist = await fetchReceptionists();
                console.log(receptionist)
                setCurrentChatUser(receptionist);
                setChatBoxOpen(true);
            } catch (error) {
                console.error("Failed to load receptionist:", error);
            }
        } else {
            setChatBoxOpen(false);
            setCurrentChatUser(null);
        }
    };

    const room_name = currentChatUser ? `${currentChatUser.id}and${user.id}` : null;
    const { messages, sendMessage } = ChatWebSocket391(currentChatUser, user, room_name)


    const closeChatBox = () => {
        setChatBoxOpen(false);
        setCurrentChatUser(null);
    };

    const handleMessageReceived = (message) => {
        setMessages2(prevMessages => [...prevMessages, message]);
    };

    //const { sendMessage } = ChatWebSocket391(currentChatUser, handleMessageReceived);
 
    


    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const token = queryParams.get("token");
            const expires = new Date();
            expires.setDate(expires.getDate() + 7); // Token expires in 7 days
            if (token) {
                cookie.save("token", token);

                try {
                    let userdata = await authAPI2(token).get(endpoints['current_user']);
                    cookie.save('user', userdata.data);
                    dispatch({
                        type: "login",
                        payload: userdata.data
                    });
                    window.location.reload();
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                }

                window.history.replaceState(null, null, window.location.pathname);
            } 
            navigate("/");
        };

        fetchData();
    }, [navigate, dispatch]);

    const message = location.state && location.state.message;
    const currentUser = localStorage.getItem("userId");

    const observer = useRef();

    const handleObserver = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const component = entry.target.getAttribute('data-component');
                setIsVisible(prev => ({ ...prev, [component]: true }));
            } else {
                const component = entry.target.getAttribute('data-component');
                setIsVisible(prev => ({ ...prev, [component]: false }));
            }
        });
    };

    useEffect(() => {
        observer.current = new IntersectionObserver(handleObserver, { threshold: 0.1 });
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(el => observer.current.observe(el));

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    return (
        <section>
            {message && <p className="text-warning px-5">{message}</p>}
            {currentUser && (
                <h6 className="text-success text-center"> You are logged-In as {currentUser}</h6>
            )}
            <div className="container">
                <motion.div 
                    className="fade-in"
                    data-component="header"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={isVisible.header ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }} 
                    transition={{ duration: 0.5 }}
                >
                    <Header />
                </motion.div>
                {/* <Sale /> */}
                <motion.div 
                    className="fade-in"
                    data-component="popular"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={isVisible.popular ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }} 
                    transition={{ duration: 0.5 }}
                >
                    <Popular />
                </motion.div>
                <motion.div 
                    className="fade-in"
                    data-component="client"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={isVisible.client ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }} 
                    transition={{ duration: 0.5 }}
                >
                    <Client />
                </motion.div>
                <motion.div 
                    className="fade-in"
                    data-component="reward"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={isVisible.reward ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }} 
                    transition={{ duration: 0.5 }}
                >
                    <Reward />
                </motion.div>
                <button onClick={openChatBox} css={chatButtonStyle}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h10a2 2 0 012 2v7m0 4l4-4" />
                        </svg>
                    </button>
                    {chatBoxOpen && (
                        <div id="chat" className='fixed right-2 bottom-2 p-4 bg-orange-600 border border-gray-300 rounded-xl'>
                            <ChatRoom391 
                                currentChatUser={currentChatUser}
                                messages={messages}
                                sendMessage={sendMessage}
                                closeChatBox={closeChatBox}
                            />
                        </div>
                    )}
                <ChatPopup /> 
                <motion.div 
                    className="fade-in"
                    data-component="footer"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={isVisible.footer ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }} 
                    transition={{ duration: 0.5 }}
                >
                    <Footer />
                </motion.div>
            </div>
        </section>
    );  
}

const chatButtonStyle = css`
  position: fixed;
  bottom: 7rem;
  right: 28px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #FFA500;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

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


export default Home;
