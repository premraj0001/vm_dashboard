import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import videoFile from  "../assets/video.mp4";
import logo from "../assets/moonriderLogo.png"
const Home = () => {
     const navigate = useNavigate();
  return(
    <div className="home-container">
        <div className="header">
           <div className="logo-moonrider">
              <img src={logo} alt="" />
           </div>
           <div className="header-content">
                 <h1 className="gradient-text">Powering Smart Farms</h1>
           </div>

           <div className="buttons">
               <button className="register-btn" onClick={() => navigate("/register")}>
                 Sign Up
               </button>
               <button className="register-btn" onClick={() => navigate("/login")}>
                 Log In
               </button>
           </div>
        </div>
        <div className="video-content">
              <video
                  muted
                  autoPlay
                  loop
                  playsInline
                  src={videoFile}
                />
        </div>
    </div>
  )
};
export default Home;