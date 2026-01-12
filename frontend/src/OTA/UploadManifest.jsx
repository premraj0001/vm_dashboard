import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UploadManifest.css";

import closeIcon from "../assets/cross.png";
import folderIcon from "../assets/folder-icon.png";
import orangeFile from "../assets/orange-file.png";

const modules = [
  { key: "vcu", label: "VCU" },
  { key: "masterBms", label: "Master BMS" },
  { key: "slaveBms", label: "Slave BMS" },
  { key: "ble", label: "BLE" },
];

const UploadManifest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [files] = useState(location.state?.uploadedFiles || {});

  return (
    <div className="fw-overlay">
      <button
        className="fw-close"
        onClick={() => navigate("/dashboard/ota")}
      >
        <img src={closeIcon} alt="close" />
      </button>

      <div className="fw-card">
        <div className="fw-header">
          <h3>Upload Firmwares</h3>
          <span>Step 2 of 2</span>
        </div>

        <hr className="fw-header-divider" />

        <div className="fw-grid">
          {modules.map((mod) => {
            const uploaded = files[mod.key];

            return (
              <div
                key={mod.key}
                className="fw-tile"
                onClick={() =>
                  navigate("/dashboard/ota/uploadfirmware", {
                    state: {
                      moduleKey: mod.key,
                      uploadedFiles: files, // pass current state forward
                    },
                  })
                }
              >
                <div className={`fw-icon-box ${uploaded ? "uploaded" : ""}`}>
                  <img
                    src={uploaded ? orangeFile : folderIcon}
                    alt="icon"
                  />
                </div>

                <div className="fw-info">
                  <p className="fw-title">{mod.label}</p>
                  <p className="fw-sub">
                    Select binary file (.bin / .hex)
                  </p>

                  <span className={`fw-status ${uploaded ? "done" : ""}`}>
                    {uploaded ? "✔" : "+"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <hr className="fw-divider" />

        <div className="fw-footer">
          <label>Manifest Version</label>
          <input placeholder="Enter here" />
          <button>Create Manifest and Start OTA</button>
        </div>
      </div>
    </div>
  );
};

export default UploadManifest;