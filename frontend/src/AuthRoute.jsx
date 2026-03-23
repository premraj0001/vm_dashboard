import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const token = sessionStorage.getItem("token");
  
  
  if (token) {
    return <Navigate to="/dashboard/vehicle" replace />;
  }

 
  return <Outlet />;
};

export default AuthRoute;