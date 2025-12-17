import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LiveData.css";

import batteryInfo from "../assets/battery_information.png";
import connectivity from "../assets/connectivity.png";
import deviceInfo from "../assets/device_information.png";
import locationIcon from "../assets/location.png";
import motorInfo from "../assets/motor_information.png";
import odometerIcon from "../assets/odometer.png";
import performance from "../assets/performance.png";
import systemInfo from "../assets/system_info.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LiveData({ info }) {
  if (!info) return null;

  const attr = info.attributes || {};
  const latitude = info.latitude;
  const longitude = info.longitude;
  const isActive =
  attr.motion === true ||
  info.speed > 1 ||
  info.state === "moving";

  return (
         <div className="live-screen">
             <div className="live-data-box">
               <div className="battery-info">
                <div className="card-header">
                  <img src={batteryInfo} />
                   <h3 className="h3"> Battery Information</h3>
                </div>
                   <p className="row"><span className="key">SOC:</span><span className="value">{attr.soc} %</span></p>
                   <p className="row"><span className="key">SOH:</span><span className="value">{attr.soh} %</span></p>
                   <p className="row"><span className="key">Voltage:</span><span className="value">{attr.battVoltage} V</span></p>
                   <p className="row"><span className="key">Current:</span><span className="value">{attr.battCurrent} A</span></p>
                   <p className="row"><span className="key">Energy:</span><span className="value">{attr.battEnergy} kWh</span></p>
                   <p className="row"><span className="key">Battery:</span><span className="value">{attr.battery}</span></p>
                   <p className="row"><span className="key">Rated Capacity:</span><span className="value">{attr.ratedCapacity} Ah</span></p>
                   <p className="row"><span className="key">Time to Discharge:</span><span className="value">{attr.timeToDischarge} hrs</span></p>
                   <p className="row"><span className="key">Max Cell Voltage:</span><span className="value">{attr.maxCellVoltage} V</span></p>
                   <p className="row"><span className="key">Min Cell Voltage:</span><span className="value">{attr.minCellVoltage} V</span></p>
                   <p className="row"><span className="key">Cell Voltage Diff:</span><span className="value">{attr.cellVoltDiff} V</span></p>
                   <p className="row"><span className="key">Over Voltage Alarm:</span><span className="value">{attr.batOva}</span></p>
                   <p className="row"><span className="key">Under Voltage Alarm:</span><span className="value">{attr.batUva}</span></p>
            

                </div>
                <div className="odometer-info">
                <div className="card-header">
                  <img src={odometerIcon} />
                   <h3 className="h3">Odometer</h3>
                </div>
                   <p className="row"><span className="key">Odometer:</span><span className="value">{attr.odometer}</span></p>
                   <p className="row"><span className="key">ODO KM:</span><span className="value">{attr.odokm}</span></p>
                   <p className="row"><span className="key">Unique ID:</span><span className="value">{info.uniqueid}</span></p>
                   <p className="row"><span className="key">Device Name:</span><span className="value">{info.name}</span></p>
                   <p className="row"><span className="key">Account ID:</span><span className="value">{info.accountId}</span></p>
                   <p className="row"><span className="key">Type:</span><span className="value">{info.type}</span></p>
                   <p className="row"><span className="key">Model:</span><span className="value">{info.model}</span></p>
                   <p className="row"><span className="key">Fix Time:</span><span className="value">{info.fixTime}</span></p>
                   <p className="row">
  <span className="key">Status:</span>

  <span
    style={{
      background: isActive ? "#4CAF50" : "#E53935", 
      width: "100px",
      color: "#fff",
      textAlign: "end",
      padding: "2px 15px",
      borderRadius: "20px",
      fontWeight: "medium",
    }}
  >
    {isActive ? "Active" : "Stopped"}
  </span>
</p>

                </div>
                
            
             <div className="card-map">
                <div className="card-header">
                  <img src={odometerIcon} />
                   <h3 className="h3">Location</h3>
                </div>
               <div className="map-placeholder">
                 {latitude && longitude ? (
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={15}
                  className="map"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[latitude, longitude]}>
                    <Popup>Lat: {latitude}, Lng: {longitude}</Popup>
                  </Marker>
                </MapContainer>
              ) : <p>No location available</p>}
            </div>

            <p className="row"><span className="key">Latitude:</span><span className="value">{latitude}</span></p>
            <p className="row"><span className="key">Longitude:</span><span className="value">{longitude}</span></p>
            <p className="row"><span className="key">Speed:</span><span className="value">{info.speed} km/h</span></p>
          </div>
                 {/* MOTOR INFO */}
            <div className="motor-info">
                <div className="card-header">
                  <img src={motorInfo} />
                   <h3 className="h3"> Motor Information</h3>
                </div>
                <p className="row"><span className="key">Motor Temp:</span><span className="value">{attr.motorTemp} °C</span></p>
                <p className="row"><span className="key">Motor Speed:</span><span className="value">{attr.motorSpeed} RPM</span></p>
                <p className="row"><span className="key">Motor Fault:</span><span className="value">{attr.motorFault}</span></p>
                <p className="row"><span className="key">Controller Temp:</span><span className="value">{attr.controllerTemp} °C</span></p>
                </div>
           
              {/* PERFORMANCE */}
           <div className="performance">
             <div className="card-header">
                  <img src={performance} />
                   <h3 className="h3">Performance</h3>
                </div>
             <p className="row"><span className="key">Power:</span><span className="value">{attr.power} W</span></p>
             <p className="row"><span className="key">Speed:</span><span className="value">{attr.speed} km/h</span></p>
           </div>
             {/* CONNECTIVITY */}
           <div className="connectivity">
             <div className="card-header">
                  <img src={connectivity} />
                   <h3 className="h3">Connectivity</h3>
                </div>
             <p className="row"><span className="key">IoT Voltage:</span><span className="value">{attr.iotVoltage} V</span></p>
             <p className="row"><span className="key">Ignition:</span><span className="value">{attr.ignition}</span></p>
             <p className="row"><span className="key">RSSI:</span><span className="value">{attr.rssi} dBm</span></p>
             <p className="row"><span className="key">Satellites:</span><span className="value">{attr.sat}</span></p>
           </div>
         </div>

      </div>
  );
}

export default LiveData;