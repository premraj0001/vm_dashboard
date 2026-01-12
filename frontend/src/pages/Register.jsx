import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Register.css"; 
import { useNavigate } from "react-router-dom";


const API = import.meta.env.VITE_AUTH_API;
const Register = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/dashboard/register`, {   
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        toast.success("Register Successfull")

        setFormData({ email: "", password: "" });

        setTimeout(() => navigate("/login"), 1500);
      } else {
        const error = await response.json();
        // setMessage(error.message || "❌ Registration failed");
        toast.error(error.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("something went wrong");
      // setMessage("❌ Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="tractor-image">
        <img src="moonriderImage.png" alt="tractor-image" />
      </div>
      <div className="register-validation">
        <div className="mr-logo">
          {message && <p className="message">{message}</p>}
          <img src="mrlogo.svg" alt="moonrider-logo" />
        </div>
        <div className="register-box">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off" 
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password" 
            />
            <button type="submit">Register</button>
          </form>
        </div>
        <div className="switch-to-login">
          <p className="login-redirect">
            Already have an account?{" "}
            <span
              style={{ color: "#fa9703", fontWeight: "600", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>      
        </div>
      </div>
    </div>
  );
};

export default Register;