import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-screen">
      <div className="loader-content">
        <div className="loader-mark">
          <span className="loader-ring"></span>
          <span className="loader-dot"></span>
        </div>

        <div className="loader-brand">
          <span className="loader-brand-main">YOUR</span>
          <span className="loader-brand-name">RESTAURANT</span>
        </div>

        <div className="loader-line">
          <span className="loader-progress"></span>
        </div>

        <p className="loader-text">Preparing your table...</p>
      </div>
    </div>
  );
}