import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UploadFirmware.css";

import crossIcon from "../assets/cross.png";
import uploadIcon from "../assets/upload-icon.png";
import folderIcon from "../assets/folder-icon.png";
import orangeFile from "../assets/orange-file.png";
import dropdownIcon from "../assets/drop-down.png";

const UploadFirmware = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const moduleKey = location.state?.moduleKey;

  if (!moduleKey) {
    navigate("/dashboard/ota/uploadmanifest");
    return null;
  }

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const ext = selected.name
      .slice(selected.name.lastIndexOf("."))
      .toLowerCase();

    if (ext !== ".bin" && ext !== ".hex") {
      setError("File type not supported");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
  };

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  return (
    <div className="upload-overlay">
      <button
        className="close-btn"
        onClick={() => navigate("/dashboard/ota/uploadmanifest")}
      >
        <img src={crossIcon} alt="close" />
      </button>

      <div className="upload-card">
        <div className="upload-header">
          <h3>Upload Firmware</h3>
        </div>

        {!file ? (
          /* ✅ CHANGE: upload-box is now clickable */
          <div
            className="upload-box"
            onClick={() =>
              document.getElementById("firmwareInput").click()
            }
          >
            <img src={folderIcon} alt="folder" className="folder-icon" />

            {/* ❌ removed onClick from button */}
            <button type="button" className="upload-btn">
              <img src={uploadIcon} alt="upload" />
              Upload file
            </button>

            <input
              id="firmwareInput"
              type="file"
              accept=".bin,.hex"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <p className="upload-text">
              Select binary file (.bin / .hex)
            </p>

            {error && <p className="file-error">{error}</p>}
          </div>
        ) : (
          <div className="orange-upload">
            <button className="orange-close" onClick={removeFile}>
              <img src={crossIcon} alt="remove" />
            </button>

            <img
              src={orangeFile}
              alt="file"
              className="orange-file-icon"
            />

            <p className="file-name">{file.name}</p>
            <p className="upload-text">Binary file uploaded</p>
          </div>
        )}

        <div className="form-group">
          <label>Firmware Version</label>
          <input type="text" placeholder="Enter here" />
        </div>

        <div className="form-group">
          <label>Module type</label>
          <div className="select-box">
            <span>{moduleKey}</span>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
        </div>

        <div className="form-group">
          <label>Supported Hardware</label>
          <div className="select-box">
            <span>Select</span>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
        </div>

        <div className="form-group">
          <label>Supported Tractor Variants</label>
          <div className="select-box">
            <span>Select</span>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
        </div>

        <div className="form-group">
          <label>Release Notes</label>
          <textarea placeholder="Enter here" />
        </div>

        <div className="form-group">
          <label>Checksum</label>
          <textarea placeholder="Enter here" />
        </div>

        <button
          className="submit-btn"
          onClick={() =>
            navigate("/dashboard/ota/uploadmanifest", {
              state: {
                uploadedFiles: {
                  ...location.state?.uploadedFiles,
                  [moduleKey]: true,
                },
              },
            })
          }
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadFirmware;
