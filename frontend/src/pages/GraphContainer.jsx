import MultiLineGraph from "../Graphs/MultiLineGraph";

export default function GraphContainer({ data }) {
  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <MultiLineGraph data={data} />
    </div>
  );
}
