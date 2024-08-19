import React from "react";
import cookie from "react-cookies";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar391/navbar";
import Header391 from "./components/Main391/header";
import Popular391 from "./components/Main391/popular";
import Client391 from "./components/Main391/client";
import Reward391 from "./components/Main391/reward";
import Footer391 from "./components/Footer391/footer";
import LogIn391 from "./components/Accounts391/login";
import Info391 from "./components/Navbar391/info";
import RoomDetails391 from './components/Main391/roomdetails';

// STAFF
import ServiceList391 from "./components/Staff391/ServiceList391"
import ReservationList391 from "./components/Staff391/ReservationList391"


import { MyUserContext, MyDispatchContext } from "./configs391/Context391";


const App = () => {
  // Lấy thông tin người dùng từ cookie, nếu có
  const user = cookie.load("user") || null;

  return (
    <MyUserContext.Provider value={user}>
        <Router>
          <Navbar />
          {/* <Header391 /> */}
          <Routes>
            <Route path="/" element={<Popular391 />} />
            <Route path="/login" element={<LogIn391 />} />
            <Route path="/info" element={<Info391 />} />
            <Route path="/room/:id" element={<RoomDetails391 />} />
            <Route path="/services-list" element={<ServiceList391 />} />
            <Route path="/reservations-list" element={<ReservationList391 />} />
          </Routes>
          {/* <Client391 />
          <Reward391 />
          <Footer391 /> */}
        </Router>
    </MyUserContext.Provider>
  );
};

export default App;