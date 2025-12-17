import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import "./App.css";
import Presentation from "./pages/Presentation";
import VehiclePage from "./pages/VehiclePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
        
          <Route index element={<Navigate to="vehicle" replace />} />

      
          <Route path="vehicle" element={<VehiclePage />} />

          
          <Route path="presentation" element={<Presentation />} />

        </Route>

        
      </Route>

      <Route path="*" element={<h2>Page not found</h2>} />
    </Routes>
  );
}
