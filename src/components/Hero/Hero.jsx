import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";
import Navbar from "../Navbar/Navbar";

gsap.registerPlugin(ScrollTrigger);

const frameCount = 240;

export default function Hero() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    let cancelled = false;
    const images = [];
    const frame = { current: 0 };

    let heroTween;
    let scrollTriggerSet = false;

    const isMobile = window.innerWidth <= 768;

    // Resize canvas
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      render();

      ScrollTrigger.refresh();
    }

    // Draw image (cover)
    function render() {
      if (cancelled) return;

      let img = images[Math.round(frame.current)];

      if (!img || !img.complete) return;

      if (!img.naturalWidth) {
        img = images.findLast((i) => i.complete && i.naturalWidth);
        if (!img) return;
      }

      const canvasWidth = canvas.clientWidth;
      const canvasHeight = canvas.clientHeight;

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth;
      let drawHeight;

      if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imgRatio;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imgRatio;
      }

      const x = (canvasWidth - drawWidth) / 2;
      const y = (canvasHeight - drawHeight) / 2;

      context.drawImage(img, x, y, drawWidth, drawHeight);
    }

    let loadedCount = 0;
    let failedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();

      img.src = `/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

      img.onload = () => {
        if (cancelled) return;

        loadedCount++;

        if (i === 1) {
          resizeCanvas();
        }

        if (!scrollTriggerSet && loadedCount >= 5) {
          scrollTriggerSet = true;

          resizeCanvas();

          heroTween = gsap.to(frame, {
            current: frameCount - 1,
            snap: "current",
            ease: "none",
            onUpdate: render,

            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",

              // Smaller scroll distance on mobile
              end: isMobile ? "+=2500" : "+=5000",

              scrub: true,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          ScrollTrigger.refresh();

          window.dispatchEvent(new Event("hero-pin-ready"));
        }
      };

      img.onerror = () => {
        if (cancelled) return;

        failedCount++;
        console.warn("Frame failed:", img.src);
      };

      images.push(img);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelled = true;

      window.removeEventListener("resize", resizeCanvas);

      heroTween?.scrollTrigger?.kill();
      heroTween?.kill();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <canvas ref={canvasRef} />

      <div className="overlay" />

      <div className="hero-navbar">
        <Navbar />
      </div>

      {/* Optional Hero Content */}
      {/*
      <div className="hero-content">
        <h1>Luxury</h1>
        <p>Experience The Extraordinary</p>
      </div>
      */}
    </section>
  );
}
