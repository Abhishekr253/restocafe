import { useEffect, useRef } from "react";
import "./About.css";

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const targets = el.querySelectorAll(".reveal, .stat-item");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            if (entry.target.classList.contains("stat-item")) {
              runCount(entry.target.querySelector("h1"));
            }
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  function runCount(node) {
    const raw = node.dataset.value; // e.g. "25+", "15K+", "100%", "4.9★"
    const match = raw.match(/[\d.]+/);
    if (!match) return;
    const numStr = match[0];
    const isFloat = numStr.includes(".");
    const target = parseFloat(numStr);
    const suffix = raw.replace(numStr, "");
    const dur = 1200;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      node.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  return (
    <section className="about" ref={sectionRef}>
      <div className="about-container">
        <div className="about-left">
          <span className="about-tag reveal">OUR STORY</span>

          <h2 className="reveal reveal-delay-1">
            More Than a Café,
            <br />
            An Experience.
          </h2>

          <p className="about-description reveal reveal-delay-2">
            At <strong>RestoCafe</strong>, every cup of coffee, every crispy fry,
            and every handcrafted meal is prepared with passion. We combine
            premium ingredients, warm hospitality, and modern aesthetics to
            create unforgettable dining experiences.
          </p>

          <p className="about-description reveal reveal-delay-3">
            Whether you're catching up with friends, enjoying a quiet coffee,
            or treating yourself to our signature loaded fries, every visit is
            designed to feel comforting, fresh, and memorable.
          </p>

          <button className="about-btn reveal reveal-delay-4">
            Explore Menu
          </button>
        </div>

        <div className="about-right">
          <div className="about-card reveal reveal-delay-1">
            <h3>Fresh Ingredients</h3>
            <p>Locally sourced produce and premium quality ingredients prepared fresh every day.</p>
          </div>

          <div className="about-card reveal reveal-delay-2">
            <h3>Specialty Coffee</h3>
            <p>Expertly brewed coffee using carefully selected beans for the perfect aroma and taste.</p>
          </div>

          <div className="about-card reveal reveal-delay-3">
            <h3>Signature Loaded Fries</h3>
            <p>Crispy golden fries topped with rich sauces, cheese, and gourmet flavors everyone loves.</p>
          </div>
        </div>
      </div>

      <div className="about-stats">
        <div className="stat-item">
          <h1 data-value="25+">0</h1>
          <span>Signature Dishes</span>
        </div>
        <div className="stat-item">
          <h1 data-value="15K+">0</h1>
          <span>Happy Customers</span>
        </div>
        <div className="stat-item">
          <h1 data-value="100%">0</h1>
          <span>Freshly Prepared</span>
        </div>
        <div className="stat-item">
          <h1 data-value="4.9★">0</h1>
          <span>Customer Rating</span>
        </div>
      </div>
    </section>
  );
}