// import { Outlet, useNavigate,NavLink } from "react-router-dom";
// import "./Dashboard.css";
// import logo from "../assets/moonriderLogo.png"

// export default function DashboardLayout() {
//   const navigate = useNavigate();
  
//   const handleLogout = () => {
//     sessionStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="dashboard">

//       {/* TOP HEADER */}

//       <div className="dash-header">

//         <div className="header-logo">
//           <img src={logo} alt="logo" />
//         </div>

//         <div className="vehicle">
          
//           <NavLink 
//            style={
//             (e)=>{
//               return {
//                 color: e.isActive? "orange" : "grey",
//               }
//             }
//            }
//           to={"/dashboard/vehicle"}>Vehicle</NavLink>
//           <NavLink
//             style={
//               (e)=>{
//                 return{
//                   color: e.isActive? "orange" : "grey",
//                 }
//               }
//             }
//           to={"/dashboard/presentation"}>Presentation</NavLink>
          
          
//      <NavLink
//             style={
//               (e)=>{
//                 return{
//                   color: e.isActive? "orange" : "grey",
//                 }
//               }
//             }
//           to={"/dashboard/ota"}>OTA</NavLink>
//         </div>

//         <div className="logout">
//           <button
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>

//       </div>
//       <Outlet />
//     </div>
//   );
// }
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import "./Dashboard.css";
import logo from "../assets/moonriderLogo.png";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dash-header">

        <div className="header-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="vehicle">
          <NavLink to="/dashboard/vehicle" end>Vehicle</NavLink>
          <NavLink to="/dashboard/presentation">Presentation</NavLink>
          <NavLink to="/dashboard/ota">OTA</NavLink>
           <NavLink to="/dashboard/services">Service Details</NavLink>
        </div>

        <div className="logout">
          <button onClick={handleLogout}>Logout</button>
        </div>

      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        <Outlet />
      </div>

    </div>
  );
}