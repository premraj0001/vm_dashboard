
import ManifestHistory from "./ManifestHistory";
import React, { useState } from "react";
import "./Ota.css";
import tractorImg from "../assets/tractor.png";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Ota = () => {
  const [activeFilter, setActiveFilter] = useState("all");


  const location = useLocation();
  const navigate = useNavigate();

  const isManifest = location.pathname.includes("manifesthistory");
  const isDetail = location.pathname.includes("/tractor/");
  return (
    <div className="ota-screen">

      <div className="ota-cards">
        <div className="ota-card">
          <div className="ota-card-left">
            <span className="ota-left-label">Total Tractors</span>
            <span className="ota-left-value">112</span>
          </div>

          <div className="ota-card-right">
            <div className="ota-card-right-child">
              <div className="ota-stat">
                <span className="ota-stat-label">Updated Tractors</span>
                <span className="ota-stat-value">59</span>
              </div>

              <div className="ota-stat">
                <span className="ota-stat-label">Outdated Tractors</span>
                <span className="ota-stat-value">63</span>
              </div>

              <div className="ota-stat">
                <span className="ota-stat-label">Successful Updates</span>
                <span className="ota-stat-value">39</span>
              </div>

              <div className="ota-stat">
                <span className="ota-stat-label">Failed Updates</span>
                <span className="ota-stat-value">29</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="ota-tabs">
        <button
          className={`ota-tab ${!isManifest ? "active" : ""}`}
          onClick={() => navigate("/dashboard/ota")}
        >
          All Tractors
        </button>

        <button
          className={`ota-tab ${isManifest ? "active" : ""}`}
          onClick={() => navigate("/dashboard/ota/manifesthistory")}
        >
          Manifest History
        </button>
      </div>

     
    {!isManifest && !isDetail && (
        <div className="ota-tractor-list">
          <div className="ota-updating-container">
            <div className="ota-updating-header">
              <div className="ota-filters">
                <div className="filters">
                  <button
                    className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveFilter("all")}
                  >
                    Filter 1
                  </button>

                  <button
                    className={`filter-btn ${activeFilter === "updated" ? "active" : ""}`}
                    onClick={() => setActiveFilter("updated")}
                  >
                    Filter 2
                  </button>

                  <button
                    className={`filter-btn ${activeFilter === "updating" ? "active" : ""}`}
                    onClick={() => setActiveFilter("updating")}
                  >
                    Filter 3
                  </button>
                </div>

                <div className="start-ota">
                  <button 
                  onClick={()=> navigate("/dashboard/ota/tractorselection")}
                  >Start OTA</button>
                </div>
              </div>
            </div>

            {(activeFilter === "all" || activeFilter === "updated") && (
              <div
                 className="ota-row"
                onClick={() => {
               
               navigate(`tractor/ME9BT525J01573002`);

                  }}
                 >

                <div className="ota-left">
                  <img src={tractorImg} alt="tractor" />
                  <div>
                    <p>Highforce 50 HP</p>
                    <p>ID: ME9BT525J01573002</p>
                  </div>
                </div>

                <div className="ota-right">
                  <div className="ota-version">
                    <div>
                      <p>MCU Version</p>
                      <p className="version">V12.01.09</p>
                    </div>
                    <div>
                      <p>BLE Version</p>
                      <p className="version">V12.01.09</p>
                    </div>
                    <div>
                      <p>BMS Version</p>
                      <p className="version">V12.01.09</p>
                    </div>

                    <div className="status-body">
                      <span className="tick-circle">✓</span>
                      <span>Up to date</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeFilter === "all" || activeFilter === "updating") && (
              <div className="ota-row">
                <div className="ota-left">
                  <img src={tractorImg} alt="tractor" />
                  <div>
                    <p>Highforce 50 HP</p>
                    <p>ID: ME9BT525J01573003</p>
                  </div>
                </div>

                <div className="ota-right">
                  <div className="ota-updates">
                    <div className="updates">
                      <p>Updating...</p>
                      <p>70%</p>
                    </div>

                    <div className="ota-progress">
                      <div className="progress-bar"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      <Outlet />
    </div>
  );
};

export default Ota;