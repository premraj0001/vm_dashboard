import "./SelectTractorModel.css";
import tractorImg from "../assets/tractor.png";
import crossIcon from "../assets/cross.png";
import searchIcon from "../assets/search.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SelectTractorModel() {
  const navigate = useNavigate();

  const tractorData = [
    { id: "ME9BT525J01573002", name: "Highforce 50 HP", firmware: "V12.01.09" },
    { id: "ME9BT525J01573003", name: "Highforce 45 HP", firmware: "V11.08.02" },
    { id: "ME9BT525J01573004", name: "Highforce 60 HP", firmware: "V12.00.01" },
    { id: "ME9BT525J01573005", name: "Highforce 55 HP", firmware: "V10.09.05" },
  ];

  
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(tractorData.map((t) => t.id));
    } else {
      setSelected([]);
    }
  };

 
  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const filteredTractors = tractorData.filter((t) =>
    t.id.toLowerCase().includes(search.toLowerCase())
  );

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
          onClick={() => navigate("/dashboard/ota")}
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
            <input
              type="checkbox"
              checked={selected.length === tractorData.length}
              onChange={handleSelectAll}
            />
            Select all
          </label>

          <div className="search-box">
            <img src={searchIcon} alt="search" />
            <input
              type="text"
              placeholder="Search VIN ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tractor list */}
        <div className="tractor-list">
          {filteredTractors.map((t) => (
            <div className="tractor-row" key={t.id}>
              <input
                type="checkbox"
                checked={selected.includes(t.id)}
                onChange={() => handleSelectOne(t.id)}
              />

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
        <button className="continue-btn">
          Continue ({selected.length})
        </button>
      </div>
    </>
  );
}
