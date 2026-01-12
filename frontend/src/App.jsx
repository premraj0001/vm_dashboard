// import { Routes, Route, Navigate } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./pages/ProtectedRoute";
// import "./App.css";
// import Presentation from "./pages/Presentation";
// import VehiclePage from "./pages/VehiclePage";
// import Ota from "./OTA/Ota";
// import ManifestHistory from "./OTA/ManifestHistory";
// import TractorDetail from "./OTA/TractorDetail";
// import SelectTractorModel from "./OTA/SelectTractorModel";
// import UploadManifest from "./OTA/UploadManifest";

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route element={<ProtectedRoute />}>
//         <Route path="/dashboard" element={<Dashboard />}>
        
//           <Route index element={<Navigate to="vehicle" replace />} />

      
//           <Route path="vehicle" element={<VehiclePage />} />

          
//           <Route path="presentation" element={<Presentation />} />
          
//         <Route path="ota" element={<Ota />}>
//           <Route path="manifesthistory" element={<ManifestHistory />} />
          
//         </Route>
//         <Route path="/dashboard/ota/tractor/:id" element={<TractorDetail />} />
//         </Route>
//         <Route path="/dashboard/ota/tractorselection" element={<SelectTractorModel />} />
//         <Route path="/dashboard/ota/tractorselection/createmanifest" element={<UploadManifest />}/>
//       </Route>

//       <Route path="*" element={<h2>Page not found</h2>} />
//     </Routes>
//   );
// }
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import "./App.css";
import Presentation from "./pages/Presentation";
import VehiclePage from "./pages/VehiclePage";
import Ota from "./OTA/Ota";
import ManifestHistory from "./OTA/ManifestHistory";
import TractorDetail from "./OTA/TractorDetail";
import SelectTractorModel from "./OTA/SelectTractorModel";
import UploadFirmware from "./OTA/UploadFirmware";
import UploadManifest from "./OTA/UploadManifest";


export default function App() {
  return (
  <>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        closeOnClick
        draggable
        theme="light"
      />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>

          <Route index element={<Navigate to="vehicle" replace />} />

          <Route path="vehicle" element={<VehiclePage />} />
          <Route path="presentation" element={<Presentation />} />

         <Route path="ota" element={<Ota />}>
              <Route path="manifesthistory" element={<ManifestHistory />} />
              <Route path="tractorselection" element={<SelectTractorModel />} />
              <Route path="uploadmanifest" element={<UploadManifest />} />
              <Route path="uploadfirmware" element={<UploadFirmware />} />
          </Route>


          <Route path="/dashboard/ota/tractor/:id" element={<TractorDetail />} />

        </Route>
      </Route>

      <Route path="*" element={<h2>Page not found</h2>} />
    </Routes>
  </>
  );
}