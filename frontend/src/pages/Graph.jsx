import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./Graph.css";

export default function BatteryVoltageGraph({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
   const times = data.map(d => {
  const t = new Date(d.fixTime || d.deviceTime);
  return t.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
});

    const voltage = data.map(d => Number(d.battery));

    chartInstance.current.setOption({
      title: { text: "Battery Voltage vs Time", left: "center", top: 10 },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          return `
            Time: ${params[0].axisValue}<br/>
            Voltage: ${params[0].data}
          `;
        }
      },
      xAxis: {
        type: "category",
        data: times,
        axisLabel: {
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: "value",
        name: "Battery (Volts)",
        min: 0,
        max: 5,
        interval: 0.5
      },
      series: [
        {
          name: "Battery Voltage",
          type: "line",
          smooth: true,
          data: voltage,
          symbol: "circle",
          symbolSize: 4,
          lineStyle: { width: 2, color: "#3a5fcd" }
        }
      ]
    });

    chartInstance.current.resize();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <div className="graph">
      <div className="graph-details">
        <div ref={chartRef} className="chart-container"></div>
      </div>
    </div>
  );
}

