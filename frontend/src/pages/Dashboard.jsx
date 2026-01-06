import { Outlet, useNavigate,NavLink } from "react-router-dom";
import "./Dashboard.css";
import logo from "../assets/moonriderLogo.png"

export default function DashboardLayout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* TOP HEADER */}

      <div className="dash-header">

        <div className="header-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="vehicle">
          
          <NavLink 
           style={
            (e)=>{
              return {
                color: e.isActive? "orange" : "grey",
              }
            }
           }
          to={"/dashboard/vehicle"}>Vehicle</NavLink>
          <NavLink
            style={
              (e)=>{
                return{
                  color: e.isActive? "orange" : "grey",
                }
              }
            }
          to={"/dashboard/presentation"}>Presentation</NavLink>
          <NavLink
            style={
              (e)=>{
                return{
                  color: e.isActive? "orange" : "grey",
                }
              }
            }
          to={"/dashboard/ota"}>Ota</NavLink>
          
    
        </div>

        <div className="logout">
          <button
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>
      <Outlet />
    </div>
  );
}
