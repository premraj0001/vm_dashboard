import React, { useRef, useState } from "react";
import "./UploadFirmwares.css";

import closeIcon from "../assets/cross.png";
import folderIcon from "../assets/folder-icon.png";
import orangeFile from "../assets/orange-file.png";

const modules = [
  { key: "vcu", label: "VCU" },
  { key: "masterBms", label: "Master BMS" },
  { key: "slaveBms", label: "Slave BMS" },
  { key: "ble", label: "BLE" },
];

const UploadFirmwares = () => {
  const [files, setFiles] = useState({});
  const inputsRef = useRef({});

  const openPicker = (key) => {
    inputsRef.current[key].click();
  };

  const handleChange = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (ext !== ".bin" && ext !== ".hex") {
      alert("File type not supported");
      return;
    }

    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const removeFile = (key, e) => {
    e.stopPropagation();
    setFiles((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  return (
    <div className="fw-overlay">
         <button className="fw-close">
    <img src={closeIcon} alt="close" />
  </button>
      <div className="fw-card">
        {/* Header */}
        <div className="fw-header">
          <h3>Upload Firmwares</h3>
          <span>Step 2 of 2</span>
        </div>
        
        <hr className="fw-header-divider" />

        {/* Grid */}
        <div className="fw-grid">
          {modules.map((mod) => {
            const file = files[mod.key];

            return (
              <div
                key={mod.key}
                className="fw-tile"
                onClick={() => !file && openPicker(mod.key)}
              >
                <input
                  ref={(el) => (inputsRef.current[mod.key] = el)}
                  type="file"
                  hidden
                  accept=".bin,.hex"
                  onChange={(e) => handleChange(mod.key, e)}
                />

                {/* Top icon area */}
                <div className={`fw-icon-box ${file ? "uploaded" : ""}`}>
                  <img
                    src={file ? orangeFile : folderIcon}
                    alt="icon"
                  />

                  {file && (
                    <button
                      className="fw-remove"
                      onClick={(e) => removeFile(mod.key, e)}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Bottom content */}
                <div className="fw-info">
                  <p className="fw-title">{mod.label}</p>
                  <p className="fw-sub">
                    Select binary file (.bin / .hex)
                  </p>

                  <span className={`fw-status ${file ? "done" : ""}`}>
                    {file ? "✔" : "+"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <hr className="fw-divider" />

        {/* Footer */}
        <div className="fw-footer">
          <label>Manifest Version</label>
          <input placeholder="Enter here" />
          <button>Create Manifest and Start OTA</button>
        </div>
      </div>
    </div>
  );
};

export default UploadFirmwares;
