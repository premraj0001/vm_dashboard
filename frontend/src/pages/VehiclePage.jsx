import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Dashboard.css";
import LiveData from "./LiveData.jsx";
import "./VehiclePage.css";
import { fetchVehicle, fetchData } from "../api.jsx";   
import Graph from "./Graph.jsx";

export default function VehiclePage() {
  const [tractorId, setTractorId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("find");
  const [liveInfo, setLiveInfo] = useState(null);

  const handleFindData = () => {
    setActiveTab("find");
    handleSearch();
  };

  useEffect(() => {
    if (activeTab !== "live" || !tractorId) return;

    const fetchLive = async () => {
      try {
        const res = await fetchVehicle(tractorId);    
        setLiveInfo(res.data[0] || null);
      } catch (e) {
        console.log("Live fetch error", e);
      }
    };

    fetchLive();

    const timer = setInterval(fetchLive, 2000);
    return () => clearInterval(timer);
  }, [activeTab, tractorId]);

  const handleSearch = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!tractorId || !startDate || !endDate) {
        alert("Please fill all fields before searching.");
        setIsLoading(false);
        return;
      }

      const res = await fetchData({                      
        tractorId,
        startDate,
        endDate
      });


      setData(res.data);                               

    } catch (err) {
      console.log("FETCH ERROR:", err);
      setError("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `TractorData_${tractorId}_${startDate}_${endDate}.xlsx`;
    saveAs(blob, fileName);
  };

    return (
 <div className="vehiclepage">

  <div className="text">
    <h3>Enter VIN details</h3>
  </div>


  <div className="vin-details">
    <div className="vin-box">
      <div className="vehicle-value">
        
        <div className="vehicle-value-left">
          <div className="vin">
            <p>VIN number</p>
            <div className="input-vin">
              <input
                value={tractorId}
                onChange={(e) => setTractorId(e.target.value)}
                placeholder="Enter VIN number"
              />
            </div>
          </div>

          <div className="dates">
            <div className="start-date">
              <label>Start Date</label>
              <input
                className="select-dates"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="end-date">
              <label>End Date</label>
              <input
                className="select-dates"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="submit">
            <button
              className="dashboard-data"
              onClick={handleFindData}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="vehicle-value-right">
          <div className="instructions">
            <ul>
              <li>Enter the VIN to fetch vehicle-specific records.</li>
              <li>Select the Start and End Dates to filter the expected time range.</li>
              <li>Click Submit to generate and view the detailed report.</li>
            </ul>
          </div>
        </div>

      </div>
    </div> 
  </div> 

  <div className="content">
    <button
      className={`dashboard-data ${activeTab === "find" ? "active" : ""}`}
      onClick={handleFindData}
    >
      {activeTab === "find" && <span className="live-indicator"></span>}
      Data
    </button>

    <button
      className={`live-data ${activeTab === "live" ? "active" : ""}`}
      onClick={() => {
        if (!tractorId) return alert("Enter VIN");
        setActiveTab("live");
      }}
    >
      {activeTab === "live" && <span className="live-indicator"></span>}
      Live Data
    </button>

    <button
      className={`graphs ${activeTab === "graph" ? "active" : ""}`}
      onClick={() => setActiveTab("graph")}
    >
      {activeTab === "graph" && <span className="live-indicator"></span>}
      Graphs
    </button>
  </div>

    {activeTab === "find" && (
  <>
    {isLoading && <p className="status-text">Loading data...</p>}
    {error && <p className="error-text">{error}</p>}

    {!isLoading && data.length > 0 && (
      <div className="table-wrapper">
        <div className="table-header">
          <h3>Device Data</h3>
          <button className="download-btn" onClick={exportToExcel}>
            Download Excel
          </button>
        </div>

        <div className="table-container">
          <table className="professional-table">
            <thead>
              <tr>
                {Object.keys(data[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>
                      {val === null || val === "" ? "-" : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </>
)}

    {activeTab === "live" && (
      <div style={{ marginTop: "20px" }}>
        <LiveData info={liveInfo} />
      </div>
    )}

    {activeTab === "graph" && (
      <div style={{ marginTop: "20px" }}>
        <Graph data={data} />
      </div>
    )}
 

</div> 

  );
}
