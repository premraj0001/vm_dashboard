import "./ManifestHistory.css";

export default function ManifestHistory() {
  const data = Array(7).fill({
    date: "26th",
    monthYear: "Jan 2026",
    firmware: "V12.01.09",
    mcu: "V12.01.09",
    ble: "V12.01.09",
    created: "23th Oct 2025",
    tractors: 100,
  });

  return (
    <div className="manifest-layout">
     
      <div className="manifest-history">

      <div className="manifest-card">
        {data.map((item, index) => (
          <div className="manifest-row" key={index}>
            <div className="date">
              <strong>{item.date}</strong>
              <span>{item.monthYear}</span>
            </div>

            <div>
              <span className="label">Firmware update</span>
              <p>{item.firmware}</p>
            </div>

            <div>
              <span className="label">MCU Version</span>
              <p>{item.mcu}</p>
            </div>

            <div>
              <span className="label">BLE Version</span>
              <p>{item.ble}</p>
            </div>

            <div>
              <span className="label">Created date</span>
              <p>{item.created}</p>
            </div>

            <div className="tractor-count">
              <span className="label">
                Tractors <span className="info">ⓘ</span>
              </span>
              <p>{item.tractors}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}