import React from "react";
import './App.css';
import cookie from "react-cookies";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar391/navbar";
import Header391 from "./components/Main391/header";
import Popular391 from "./components/Main391/popular";
import Client391 from "./components/Main391/client";
import Reward391 from "./components/Main391/reward";
import Footer391 from "./components/Footer391/footer";
import LogIn391 from "./components/Accounts391/login";
import Signup391 from "./components/Accounts391/singup";
import Info391 from "./components/Navbar391/info";
import RoomDetails391 from './components/Main391/roomdetails';
import BookingHistory391 from "./components/Main391/bookinghistory"
import Cart391 from "./components/Main391/cart";

import Home391 from "./components/Home391/home";

// STAFF
import ServiceList391 from "./components/Staff391/ServiceList391"
import ReservationList391 from "./components/Staff391/ReservationList391"
import AddService391 from "./components/Staff391/AddService391"
import BillList391 from "./components/Staff391/BillList391"
import ExportBill391 from "./components/Staff391/ExportBill391"

//ADMIN
import Admin391 from "./components/Admin391/admin"
import ExistingRooms391 from "./components/Admin391/Room/existingrooms"
import ExistingRoomTypes391 from "./components/Admin391/Roomtype/existingroomtypes"
import ExistingServices391 from "./components/Admin391/Service/existingservices"
import ExistingAccounts391 from "./components/Admin391/Accounts/existingaccounts"
import ExistingReservations391 from "./components/Admin391/Reservations/existingreservations"
import { MyUserContext } from "./configs391/Context391";

const App = () => {
  const user = cookie.load("user") || null;

  return (
    <MyUserContext.Provider value={user}>
      <Router>
      <Navbar />
        <Layout>
          <Routes>
            <Route path="/" element={<Home391 />} />
            {/* <Route path="/" element={<Popular391 />} /> */}
            <Route path="/login" element={<LogIn391 />} />
            <Route path="/signup" element={<Signup391 />} />
            <Route path="/info" element={<Info391 />} />
            <Route path="/booking-history" element={<BookingHistory391 />} />
            <Route path="/room/:id" element={<RoomDetails391 />} />
            <Route path="/cart" element={<Cart391 />} />
    
            {/* STAFF */}
            <Route path="/services-list" element={<ServiceList391 />} />
            <Route path="/reservations-list" element={<ReservationList391 />} />
            <Route path="/add-services/:id" element={<AddService391 />} />
            <Route path="/bill-list" element={<BillList391 />} />
            <Route path="/bill/:id" element={<ExportBill391 />} />
            
            {/* ADMIN */}
            <Route path="/admin" element={<Admin391 />}>
              <Route path="existing-rooms" element={<ExistingRooms391 />} />
              <Route path="existing-roomtypes" element={<ExistingRoomTypes391 />} />
              <Route path="existing-services" element={<ExistingServices391 />} />
              <Route path="existing-accounts" element={<ExistingAccounts391 />} />
              <Route path="existing-reservations" element={<ExistingReservations391 />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </MyUserContext.Provider>
  );
};

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isLoginOrSignupPage = pathname === "/login" || pathname === "/signup" || pathname === "/info" ;

  return (
    <>
      {/* <Navbar /> */}
      {/* {!isLoginOrSignupPage && <Header391 />} */}

      <main>{children}</main>

      {/* {!isLoginOrSignupPage && <Popular391 />}
      {!isLoginOrSignupPage && <Client391 />}
      {!isLoginOrSignupPage && <Reward391 />}
      <Footer391 /> */}
    </>
  );
};

export default App;
