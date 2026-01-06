
import { useState } from "react";
import "./TractorDetail.css";
import backBtn from "../assets/back_button.png";
import tractorImg from "../assets/tractor.png";
import { useNavigate } from "react-router-dom";

export default function TractorDetail() {

  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const history = Array(4).fill({
    date: "26th",
    monthYear: "Jan 2026",
    firmware: "V12.01.09",
    mcu: "V12.01.09",
    ble1: "V12.01.09",
    ble2: "V12.01.09",
  });

  return (
    <div className="ota-wrapper">
      <button className="back-btn" onClick={()=> navigate("/dashboard/ota")}>
        <img src={backBtn} alt="Back" />
      </button>

      <div className="ota-c">
        <div className="ota-header">
          <img src={tractorImg} alt="Tractor" className="tractor-img" />

          <div className="tractor-info">
            <h2>Highforce 50 HP</h2>
            <p>ID: 23890238e4</p>
          </div>

       
        </div>

        <div className="version-row">
          <div>
            <span>MCU Version</span>
            <p>V12.01.09</p>
          </div>
          <div>
            <span>BLE Version</span>
            <p>V12.01.09</p>
          </div>
          <div>
            <span>BLE Version</span>
            <p>V12.01.09</p>
          </div>
        </div>

        <h3 className="history-title">Update History</h3>

        <div className="history-table">
          {history.map((item, index) => (
            <div className="history-row" key={index}>
              <div className="date">
                <strong>{item.date}</strong>
                <span>{item.monthYear}</span>
              </div>

              <div>
                <span>Firmware update</span>
                <p>{item.firmware}</p>
              </div>

              <div>
                <span>MCU Version</span>
                <p>{item.mcu}</p>
              </div>

              <div>
                <span>BLE Version</span>
                <p>{item.ble1}</p>
              </div>

              <div>
                <span>BLE Version</span>
                <p>{item.ble2}</p>
              </div>

              <div className="placeholder">Lorem ipsum</div>
            </div>
          ))}
        </div>
      </div>

 
    </div>
  );
}