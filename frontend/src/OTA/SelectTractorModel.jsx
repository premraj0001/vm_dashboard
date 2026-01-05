import "./SelectTractorModel.css";
import tractorImg from "../assets/tractor.png";
import crossIcon from "../assets/cross.png";
import searchIcon from "../assets/search.png";
import { useNavigate } from "react-router-dom";

export default function SelectTractorModel() {
    const navigate = useNavigate();
  const tractors = Array(4).fill({
    name: "Highforce 50 HP",
    id: "23890238e4",
    firmware: "V12.01.09",
  });


  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" />

      {/* Modal */}
      <div className="select-modal">
        {/* Close icon */}
        <img
          
          src={crossIcon}
          alt="close"
          className="close-icon"
          onClick={()=> navigate("/dashboard/ota")}
        />

        {/* Header */}
        <div className="modal-header">
          <h2>Select Tractors</h2>
          <span className="step">Step 1 of 2</span>
        </div>

        <hr />

        {/* Controls */}
        <div className="modal-controls">
          <label className="select-all">
            <input type="checkbox" />
            Select all
          </label>

          <div className="search-box">
            <img src={searchIcon} alt="search" />
            <input type="text" placeholder="Search VIN ID" />
          </div>
        </div>

        {/* Tractor list */}
        <div className="tractor-list">
          {tractors.map((t, i) => (
            <div className="tractor-row" key={i}>
              <input type="checkbox" />

              <img src={tractorImg} alt="tractor" className="tractor-img" />

              <div className="tractor-info">
                <strong>{t.name}</strong>
                <span>ID: {t.id}</span>
              </div>

              <div className="firmware">
                <strong>Firmware Version</strong>
                <span>{t.firmware}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <button className="continue-btn">Continue</button>
      </div>
    </>
  );
}