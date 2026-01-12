import "./Loader.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="loader-circle"></div>
      <span className="loader-text">{text}</span>
    </div>
  );
}