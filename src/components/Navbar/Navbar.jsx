import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goTo = (id) => {
    setMenuOpen(false);

    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-icon">
          <span>R</span>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <button onClick={() => goTo("home")}>Home</button>
          <button onClick={() => goTo("about")}>Our Story</button>
          <button onClick={() => goTo("projects")}>Signature Dishes</button>
          <button onClick={() => goTo("contact")}>Contact</button>
        </div>

        {/* Desktop CTA */}
        <button className="reserve-btn" onClick={() => goTo("contact")}>
          Reserve
        </button>

        {/* Mobile Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        className={`nav-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          ✕
        </button>

        <button onClick={() => goTo("home")}>Home</button>
        <button onClick={() => goTo("about")}>Our Story</button>
        <button onClick={() => goTo("projects")}>Signature Dishes</button>
        <button onClick={() => goTo("contact")}>Contact</button>
      </div>
    </>
  );
}
