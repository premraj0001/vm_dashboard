import { useEffect, useState, useRef } from "react";
import LiveData from "./LiveData";
import GraphContainer from "./GraphContainer";
import Loader from "./Loader";
import { fetchVehicle, fetchHistory as fetchHistoryAPI } from "../api.jsx";

function cleanFixTime(t) {
  if (!t) return null;

  let val = String(t).trim();
  val = val.replace(" ", "T");
  val = val.replace(/\//g, "-");
  val = val.replace(/(\+\d{2})(\d{2})$/, "$1:$2");

  if (!/[\+\-]\d{2}:\d{2}$/.test(val) && !val.endsWith("Z")) {
    val += "+05:30";
  }

  const d = new Date(val);
  if (isNaN(d.getTime())) {
    console.log("❌ INVALID FIXTIME:", t, " => ", val);
    return null;
  }

  return val;
}



function Presentation() {
  const vehicleList = [
    "ME9BT525J01573002",
    "ME9BT725G01573001",
    "ME9BT725G01573003",
    "ME9BT225E01573003",
    "ME9BT225E01573002",
  ];

  const [vehicleIndex, setVehicleIndex] = useState(0);
  const [screen, setScreen] = useState("live");

  const [latestData, setLatestData] = useState(null);
  const [weekHistory, setWeekHistory] = useState([]);

  const [liveLoading, setLiveLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);

  const historyCache = useRef({});
  const loadingHistory = useRef(false);

  
  useEffect(() => {
    if (screen !== "graph") return; //?

    const name = vehicleList[vehicleIndex];
    setWeekHistory([]);
    setGraphLoading(true);

    const loadHistory = async () => {
      if (loadingHistory.current) return;
      loadingHistory.current = true;

      if (historyCache.current[name]) {
        setWeekHistory(historyCache.current[name]);
        setGraphLoading(false);
        loadingHistory.current = false;
        return;
      }

      try {
        const res = await fetchHistoryAPI({ tractorId: name });
        const history = res.data;

        if (!Array.isArray(history)) return;

        const formatted = history
          .map((item) => {
            const ft = cleanFixTime(item.fixTime);
            if (!ft) return null;

            return {
              time: ft,
              voltage: Number(item.battVoltage ?? 0),
              current: Number(item.battCurrent ?? 0),
              soc: Number(item.soc ?? 0),
            };
          })
          .filter(Boolean);

        historyCache.current[name] = formatted;
        setWeekHistory(formatted);
        setGraphLoading(false);
      } catch (err) {
        console.log("History fetch error:", err);
      }

      loadingHistory.current = false;
    };

    loadHistory();
  }, [screen, vehicleIndex]); //why screen is added?

  
  useEffect(() => {
    const name = vehicleList[vehicleIndex];
    setLiveLoading(true);
    setLatestData(null);

    const loadLive = async () => {
      try {
        const res = await fetchVehicle(name);
        const json = res.data;

        if (json && json.length > 0) {
          // 👇 minimum loader visibility
          setTimeout(() => {
            setLatestData(json[0]);
            setLiveLoading(false);
          }, 500);
        }
      } catch (err) {
        console.log("❌ Live fetch error:", err);
      }
    };

    loadLive();
    const interval = setInterval(loadLive, 1000);
    return () => clearInterval(interval);
  }, [vehicleIndex]);

 
  useEffect(() => {
    if (liveLoading) return;

    const interval = setInterval(() => {
      setScreen((prev) => {
        if (prev === "live") return "graph";
        setVehicleIndex((i) => (i + 1) % vehicleList.length);
        return "live";
      });
    }, 10000);//

    return () => clearInterval(interval);
  }, [liveLoading]);

  const name = vehicleList[vehicleIndex];

  return (
    <div style={{ padding: 10 }}>
      <h2 style={{ textAlign: "center", fontSize: "20px", marginBottom: "10px" }}>
        Showing {screen === "live" ? "Live Data" : "Graph"} for:
        <span style={{ color: "#ff6600" }}> {name}</span>
      </h2>

      {screen === "live" ? (
        liveLoading ? (
          <Loader text="Loading Live Data..." />
        ) : (
          <LiveData info={latestData} />
        )
      ) : graphLoading ? (
        <Loader text="Loading Graph Data..." />
      ) : (
        <GraphContainer data={weekHistory} />
      )}
    </div>
  );
}

export default Presentation;
