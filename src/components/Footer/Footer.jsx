// Footer.jsx
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>RestoCafe</h2>
          <p>
            Comfort food, crafted with care. Fresh ingredients, warm
            hospitality, every single visit.
          </p>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <a href="#home">Home</a>
          <a href="#about">Our Story</a>
          <a href="#projects">Signature Dishes</a>
          <a href="#menu">Menu</a>
        </div>

        <div className="footer-links">
          <h4>Visit Us</h4>
          <p>221 Marine Drive, Kozhikode, Kerala</p>
          <p>Open daily · 9am – 11pm</p>
        </div>

        <div className="footer-links">
          <h4>Contact</h4>
          <a href="tel:+919999999999">+91 99999 99999</a>
          <a href="mailto:hello@restocafe.com">hello@restocafe.com</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} RestoCafe. All rights reserved.</span>
        <div className="footer-social">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Facebook">Facebook</a>
        </div>
      </div>
    </footer>
  );
}