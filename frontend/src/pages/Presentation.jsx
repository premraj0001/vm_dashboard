// import { useEffect, useState, useRef } from "react";
// import LiveData from "./LiveData";
// import Loader from "./Loader.jsx";
// import GraphContainer from "./GraphContainer";
// import { fetchVehicle, fetchHistory as fetchHistoryAPI } from "../api.jsx";

// function cleanFixTime(t) {
//   if (!t) return null;

//   let val = String(t).trim();
//   val = val.replace(" ", "T");
//   val = val.replace(/\//g, "-");
//   val = val.replace(/(\+\d{2})(\d{2})$/, "$1:$2");

//   if (!/[\+\-]\d{2}:\d{2}$/.test(val) && !val.endsWith("Z")) {
//     val += "+05:30";
//   }

//   const d = new Date(val);
//   if (isNaN(d.getTime())) {
//     console.log("❌ INVALID FIXTIME:", t, " => ", val);
//     return null;
//   }

//   return val;
// }

// function Loader({ text }) {
//   return (
//     <div
//       style={{
//         height: "70vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: "18px",
//         fontWeight: 500,
//         color: "#555",
//       }}
//     >
//       🔄 {text}
//     </div>
//   );
// }

// function Presentation() {
//   const vehicleList = [
//     "ME9BT525J01573002",  
//     "ME9BT725G01573001",
//     "ME9BT725G01573003",
//     "ME9BT225E01573003",
//     "ME9BT225E01573002",
//   ];


//   const [vehicleIndex, setVehicleIndex] = useState(0);
//   const [screen, setScreen] = useState("live");

//   const [latestData, setLatestData] = useState(null);
//   const [weekHistory, setWeekHistory] = useState([]);

//   const [liveLoading, setLiveLoading] = useState(true);
//   const [graphLoading, setGraphLoading] = useState(true);

//   const historyCache = useRef({});
//   const loadingHistory = useRef(false);

//   useEffect(() => {
//     const name = vehicleList[vehicleIndex];
//     setWeekHistory([]);
//     setGraphLoading(true);

//     const loadHistory = async () => {
//       if (loadingHistory.current) return;
//       loadingHistory.current = true;

//       if (historyCache.current[name]) {
//         setWeekHistory(historyCache.current[name]);
//         setGraphLoading(false);
//         loadingHistory.current = false;
//         return;
//       }

//       try {
//         const res = await fetchHistoryAPI({ tractorId: name });
//         const history = res.data;
//         if (!Array.isArray(history)) return;

//         const formatted = history
//           .map((item) => {
//             const ft = cleanFixTime(item.fixTime);
//             if (!ft) return null;

//             return {
//               time: ft,
//               voltage: Number(item.battVoltage ?? 0),
//               current: Number(item.battCurrent ?? 0),
//               soc: Number(item.soc ?? 0),
//             };
//           })
//           .filter(Boolean);

//         historyCache.current[name] = formatted;
//         setWeekHistory(formatted);
//         setGraphLoading(false);
//       } catch (err) {
//         console.log("History fetch error:", err);
//       }

//       loadingHistory.current = false;
//     };

//     loadHistory();
//   }, [vehicleIndex]);

//   useEffect(() => {
//     const name = vehicleList[vehicleIndex];

//     const loadLive = async () => {
//       try {
//         const res = await fetchVehicle(name);
//         const json = res.data;

//         if (json && json.length > 0) {
//           setLatestData(json[0]);
//           setLiveLoading(false);
//         }
//       } catch (err) {
//         console.log("❌ Live fetch error:", err);
//       }
//     };

//     loadLive();
//     const interval = setInterval(loadLive, 1000);

//     return () => clearInterval(interval);
//   }, [vehicleIndex]);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setScreen((prev) => {
//         if (prev === "live") return "graph";
//         setVehicleIndex((i) => (i + 1) % vehicleList.length);
//         return "live";
//       });
//     }, 20000);

//     return () => clearInterval(interval);
//   }, []);

//   const name = vehicleList[vehicleIndex];
//   return (
//     <div style={{ padding: 10 }}>
//       <h2 style={{ textAlign: "center", fontSize: "20px", marginTop: "0px" }}>
//         Showing {screen === "live" ? "Live Data" : "Graph"} for:
//         <span style={{ color: "#ff6600" }}> {name}</span>
//       </h2>

//       {screen === "live" ? (
//         liveLoading ? (
//           <Loader text="Loading Live Data..." />
//         ) : (
//           <LiveData info={latestData} />
//         )
//       ) : graphLoading ? (
//         <Loader text="Loading Graph Data..." />
//       ) : (
        
//         <GraphContainer data={weekHistory} />
//       )}
//     </div>
//   );
// }

// export default Presentation;





// /**
 
//  * 
//  */


import { useEffect, useState, useRef } from "react";
import LiveData from "./LiveData";
import Loader from "./Loader.jsx";
import GraphContainer from "./GraphContainer";
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

  const [isReady, setIsReady] = useState(false);

  const historyCache = useRef({});
  const loadingHistory = useRef(false);

  const name = vehicleList[vehicleIndex];


  useEffect(() => {
    setLiveLoading(true);
    setGraphLoading(true);
    setIsReady(false);
    setWeekHistory([]);
  }, [vehicleIndex]);


  useEffect(() => {
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

        if (!Array.isArray(history)) {
          setGraphLoading(false);
          loadingHistory.current = false;
          return;
        }

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
        setGraphLoading(false);
      }

      loadingHistory.current = false;
    };

    loadHistory();
  }, [name]);


  useEffect(() => {
    const loadLive = async () => {
      try {
        const res = await fetchVehicle(name);
        const json = res.data;

        if (json && json.length > 0) {
          setLatestData(json[0]);
          setLiveLoading(false);
        }
      } catch (err) {
        console.log("❌ Live fetch error:", err);
      }
    };

    loadLive();
    const interval = setInterval(loadLive, 1000);

    return () => clearInterval(interval);
  }, [name]);


  useEffect(() => {
    if (!liveLoading && !graphLoading) {
      setIsReady(true);
    }
  }, [liveLoading, graphLoading]);

  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      setScreen((prev) => {
        if (prev === "live") return "graph";

        setVehicleIndex((i) => (i + 1) % vehicleList.length);
        setIsReady(false); // reset for next vehicle
        return "live";
      });
    }, 10000); 

    return () => clearInterval(interval);
  }, [isReady, vehicleList.length]);

  return (
    <div style={{ padding: 10 }}>
      <h2 style={{ textAlign: "center", fontSize: "20px", marginTop: "0px" }}>
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