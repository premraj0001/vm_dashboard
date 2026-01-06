import "./UploadManifest.css";
import crossIcon from "../assets/cross.png";
import uploadIcon from "../assets/upload-icon.png";
import folderIcon from "../assets/folder-icon.png";

const UploadManifest = () => {
  return (
    <div className="upload-overlay-mm">
      <button className="close-btn1-mm">
        <img src={crossIcon} alt="Close" />
      </button>

      <div className="upload-card-m-mm">

        {/* Header */}
        <div className="upload-header-mm">
          <h2>Upload Manifest</h2>
          <span>Step 2 of 2</span>
        </div>

        <hr />

        {/* Upload Box */}
        <div className="upload-box-mm">
          <img
            src={folderIcon}
            alt="Folder"
            className="folder-icon-mm"
          />

          <div className="upload-action-mm">
            <img src={uploadIcon} alt="Upload" />
            <span>Upload file</span>
          </div>

          <p>Contains all firmware binaries for VCU, BMS, BLE</p>
        </div>

        {/* Manifest Version */}
        <div className="manifest-input-mm">
          <label>Manifest Version</label>
          <input type="text" placeholder="Enter here" />
        </div>

        {/* Upload Button */}
        <button className="upload-btn-mm">Upload</button>
      </div>
    </div>
  );
};

export default UploadManifest;
