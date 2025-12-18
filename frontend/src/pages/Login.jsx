import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = "https://backend-prod.moonrider.ai";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API}/dashboard/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("token", data.token);
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/dashboard/vehicle"), 1000);
      } else {
        const error = await res.json();
        setMessage(error.message || "❌ Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Something went wrong");
    }
  }

  return (
    <div className="login-container">
      <div className="tractor-image">
        <img src="moonriderImage.png" alt="" />
      </div>

      <div className="login-validation">
        <div className="logo">
          {message && <p className="message">{message}</p>}
          <img src="mrlogo.svg" alt="moonrider logo" />
        </div>

        <div className="login-inputs">
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <button type="submit">Login</button>
          </form>
        </div>

      </div>
    </div>
  );
}