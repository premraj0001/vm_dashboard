import React, { useState } from "react";
import "./ServiceDetails.css";
import TractorIcon from "../assets/TractorIcon.svg";
import profileIcon from "../assets/profileIcon.svg";
import viewIcon from "../assets/viewIcon.svg";

const data = [
  {
    id: 1,
    bookingId: "BK00123",
    username: "Premguru",
    contact: "9876543210",
    tractor: "Moonrider T75",
    tractorId: "27547864",
    serviceType: "General",
    date: "25th Oct 2025",
    slot: "9:00 am to 1:00 pm",
    status: "Completed",
  },
  {
    id: 2,
    bookingId: "BK00124",
    username: "Premguru",
    contact: "9876543210",
    tractor: "Moonrider T75",
    tractorId: "27547864",
    serviceType: "General",
    date: "25th Oct 2025",
    slot: "9:00 am to 1:00 pm",
    status: "Active",
  },
];

export default function ServiceDetails() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredData =
    activeTab === "all"
      ? data
      : data.filter((item) => item.status.toLowerCase() === activeTab);

  return (
    <div className="container">
      <h2>e-Tractor Service</h2>

      <div className="container-box">
        <div className="tabs-header">
          <div className="tabs">
            {["all", "active", "completed"].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "tab active" : "tab"}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="table-header">
            <span>Booking ID</span>
            <span>Username</span>
            <span>Contact</span>
            <span>Tractor Details</span>
            <span>Service type</span>
            <span>Description</span>
            <span>Service date</span>
            <span>Slot</span>
            <span>Status</span>
          </div>
        </div>

        <div className="table-wrapper">
          {filteredData.map((item) => (
            <div key={item.id} className="table-row">
              <div>{item.bookingId}</div>

              <div className="user">
                <img src={profileIcon} alt="profile" />
                <p>{item.username}</p>
              </div>

              <div>{item.contact}</div>

              <div className="tractor">
                <img src={TractorIcon} alt="tractor" />
                <div>
                  <p>{item.tractor}</p>
                  <span>ID : {item.tractorId}</span>
                </div>
              </div>

              <div>
                <span className="badge">{item.serviceType}</span>
              </div>

              <div className="view">
                <img src={viewIcon} alt="view" />
                <span>View</span>
              </div>

              <div>{item.date}</div>
              <div>{item.slot}</div>

              <div className={`status ${item.status.toLowerCase()}`}>
                <span className="dot"></span>
                {item.status}
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <p className="empty">No data found</p>
          )}
        </div>
      </div>
    </div>
  );
}