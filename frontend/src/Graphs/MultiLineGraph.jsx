import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
function smooth(values, window = 6) {
  return values.map((val, i) => {
    const start = Math.max(0, i - window);
    const end = Math.min(values.length, i + window);
    const slice = values.slice(start, end);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

function downsample(times, values, maxPoints = 80) {
  if (times.length <= maxPoints) return { times, values };
  const step = Math.ceil(times.length / maxPoints);
  return {
    times: times.filter((_, i) => i % step === 0),
    values: values.filter((_, i) => i % step === 0),
  };
}

export default function MultiLineGraph({ data }) {
  const voltageRef = useRef(null);
  const currentRef = useRef(null);
  const socRef = useRef(null);

  const voltageChart = useRef(null);
  const currentChart = useRef(null);
  const socChart = useRef(null);

  useEffect(() => {
    voltageChart.current = echarts.init(voltageRef.current);
    currentChart.current = echarts.init(currentRef.current);
    socChart.current = echarts.init(socRef.current);

    return () => {
      voltageChart.current?.dispose();
      currentChart.current?.dispose();
      socChart.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const times = data.map((d) =>
      new Date(d.time).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    );

    let voltage = smooth(data.map((d) => d.voltage));
    let current = smooth(data.map((d) => d.current));
    let soc = smooth(data.map((d) => d.soc));

    const v = downsample(times, voltage);
    const c = downsample(times, current);
    const s = downsample(times, soc);

    const grid = {
      left: "10%",
      right: "5%",
      bottom: "15%",
      top: "15%",
    };

    voltageChart.current.setOption({
      title: { text: "Voltage vs Time", left: "center", top: 5, textStyle: { fontWeight: "600" } },
      tooltip: { trigger: "axis" },
      grid,
      xAxis: {
        type: "category",
        data: v.times,
        axisLabel: { rotate: 45, fontSize: 10 },
      },
      yAxis: { type: "value", name: "Voltage (V)" },
      series: [
        {
          type: "line",
          smooth: true,
          data: v.values,
          symbol: "circle",
          symbolSize: 3,
          lineStyle: { width: 3, color: "#2D61E4" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(45,97,228,0.4)" },
              { offset: 1, color: "rgba(45,97,228,0.05)" },
            ]),
          },
        },
      ],
    });

    currentChart.current.setOption({
      title: { text: "Current vs Time", left: "center", top: 5, textStyle: { fontWeight: "600" } },
      tooltip: { trigger: "axis" },
      grid,
      xAxis: { type: "category", data: c.times, axisLabel: { rotate: 45, fontSize: 10 } },
      yAxis: { type: "value", name: "Current (A)" },
      series: [
        {
          type: "line",
          smooth: true,
          data: c.values,
          symbol: "circle",
          symbolSize: 3,
          lineStyle: { width: 3, color: "#1FB676" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(31,182,118,0.35)" },
              { offset: 1, color: "rgba(31,182,118,0.05)" },
            ]),
          },
        },
      ],
    });
    socChart.current.setOption({
      title: { text: "SOC vs Time", left: "center", top: 5, textStyle: { fontWeight: "600" } },
      tooltip: { trigger: "axis" },
      grid,
      xAxis: { type: "category", data: s.times, axisLabel: { rotate: 45, fontSize: 10 } },
      yAxis: { type: "value", name: "SOC (%)" },
      series: [
        {
          type: "line",
          smooth: true,
          data: s.values,
          symbol: "circle",
          symbolSize: 3,
          lineStyle: { width: 3, color: "#000" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0,0,0,0.3)" },
              { offset: 1, color: "rgba(0,0,0,0.03)" },
            ]),
          },
        },
      ],
    });
  }, [data]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <div
          ref={voltageRef}
          style={{
            height: "350px",
            width: "50%",
            background: "#fff",
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
          }}
        />
        <div
          ref={currentRef}
          style={{
            height: "350px",
            width: "50%",
            background: "#fff",
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
          }}
        />
      </div>
      <div
        ref={socRef}
        style={{
          height: "330px",
          background: "#fff",
          borderRadius: "12px",
          padding: "10px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
          marginTop: "10px",
        }}
      />
    </div>
  );
}
