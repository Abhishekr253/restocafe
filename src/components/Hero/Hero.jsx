import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";
import Navbar from "../Navbar/Navbar";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_QUERY = "(max-width: 768px)";

const DESKTOP_VIDEO = "/hero.mp4";

const MOBILE_FRAMES = {
  count: 240,
  path: "/frames/mobile/ezgif-frame-",
  scrollLen: "+=2500",
};

function HeroDesktop() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;

    let playing = false;
    let leaving = false;

    const lock = () => {
      document.body.style.overflow = "hidden";
    };

    const unlock = () => {
      document.body.style.overflow = "";
    };

    lock();

    const showFirstFrame = () => {
      video.currentTime = 0.001;
    };

    if (video.readyState >= 1) {
      showFirstFrame();
    } else {
      video.addEventListener("loadedmetadata", showFirstFrame, {
        once: true,
      });
    }

    const finish = () => {
      playing = false;
      leaving = true;

      unlock();

      window.scrollTo({
        top: hero.offsetHeight,
        behavior: "smooth",
      });
    };

    const start = () => {
      if (playing) return;

      playing = true;
      video.currentTime = 0;

      video.play().catch((error) => {
        console.warn("Video autoplay failed:", error);
        finish();
      });
    };

    // Autoplay as soon as the video is ready
    const onReady = () => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("hero-pin-ready"));

      start();
    };

    // If video is already ready
    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener("loadeddata", onReady, { once: true });
    }

    // When video ends → go to next section
    video.addEventListener("ended", finish);

    const onScroll = () => {
      const y = window.scrollY;

      if (leaving) {
        if (y > 50) {
          leaving = false;
        }
        return;
      }

      // If user comes back to the top, replay video
      if (!playing && y < 10) {
        video.pause();
        video.currentTime = 0.001;

        lock();
        start();
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      unlock();

      video.pause();

      video.removeEventListener("ended", finish);
      video.removeEventListener("loadedmetadata", showFirstFrame);
      video.removeEventListener("loadeddata", onReady);

      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero hero--video">
      <video
        ref={videoRef}
        src={DESKTOP_VIDEO}
        muted
        autoPlay
        playsInline
        preload="auto"
      />

      <div className="overlay" />

      <div className="hero-navbar">
        <Navbar />
      </div>
    </section>
  );
}

function HeroMobile() {
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

    const set = MOBILE_FRAMES;
    const frameCount = set.count;

    // Lock viewport height once — ignore live toolbar show/hide changes
    let lastWidth = window.innerWidth;
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    };
    setVh();

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
      let drawWidth, drawHeight;
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
      img.src = `${set.path}${String(i).padStart(3, "0")}.jpg`;

      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        if (i === 1) resizeCanvas();

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
              end: set.scrollLen,
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

    // Only react to real resizes — ignore mobile toolbar show/hide.
    const handleResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      setVh();
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
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
    </section>
  );
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile ? <HeroMobile key="mobile" /> : <HeroDesktop key="desktop" />;
}
