import React, { useEffect, useContext, useRef, useState } from "react";  
import { useLocation, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { MyDispatchContext } from '../../configs391/Context391';
import { authAPI, endpoints } from "../../configs391/API391";
import NavBar from "../Navbar391/navbar";
import Header from "../Main391/header";
import Popular from "../Main391/popular";
import Client from "../Main391/client";
import Reward from "../Main391/reward";
import Footer from "../Footer391/footer";
import { motion } from 'framer-motion';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useContext(MyDispatchContext);
    const [isVisible, setIsVisible] = useState({
        header: false,
        popular: false,
        client: false,
        reward: false,
        footer: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const token = queryParams.get("token");
            const expires = new Date();
            expires.setDate(expires.getDate() + 7); // Token expires in 7 days
            if (token) {
                cookie.save("token", token);

                try {
                    let userdata = await authAPI(token).get(endpoints['current_user']);
                    cookie.save('user', userdata.data);
                    dispatch({
                        type: "login",
                        payload: userdata.data
                    });
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

export default Home;
