// SignatureDishes.jsx
import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { projects } from "./index";
import "./Signature.css";

gsap.registerPlugin(ScrollTrigger);

let heroReady = false;
window.addEventListener(
  "hero-pin-ready",
  () => {
    heroReady = true;
  },
  { once: true },
);

function SignatureProjects() {
  const sectionRef = useRef();
  const [ready, setReady] = useState(heroReady);

  useEffect(() => {
    if (ready) return;
    const onHeroReady = () => setReady(true);
    window.addEventListener("hero-pin-ready", onHeroReady, { once: true });
    return () => window.removeEventListener("hero-pin-ready", onHeroReady);
  }, [ready]);

  useGSAP(
    () => {
      if (!ready) return;
      if (window.innerWidth < 1024) return;

      const q = gsap.utils.selector(sectionRef);
      const wrapper = q(".about-wrapper")[0];

      const horizontalTween = gsap.to(wrapper, {
        x: () => {
          const lastCard = wrapper.querySelector(".dish-card:last-of-type");

          const lastCardLeft = lastCard.offsetLeft;
          const wrapperPaddingLeft = parseFloat(
            getComputedStyle(wrapper).paddingLeft,
          );

          return -(lastCardLeft - wrapperPaddingLeft);
        },

        ease: "none",

        scrollTrigger: {
          trigger: sectionRef.current,

          start: "top top",

          end: () => {
            const lastCard = wrapper.querySelector(".dish-card:last-of-type");

            const lastCardLeft = lastCard.offsetLeft;
            const wrapperPaddingLeft = parseFloat(
              getComputedStyle(wrapper).paddingLeft,
            );

            return "+=" + (lastCardLeft - wrapperPaddingLeft);
          },

          pin: true,

          scrub: true,

          anticipatePin: 1,

          invalidateOnRefresh: true,
        },
      });

      gsap.from(q(".about-title"), {
        y: 80,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: { trigger: q(".intro")[0], start: "top 85%" },
      });

      q(".dish-card").forEach((card) => {
        gsap.from(card, {
          y: 120,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });

      ScrollTrigger.refresh();

      return () => {
        horizontalTween.scrollTrigger?.kill();
        horizontalTween.kill();
      };
    },
    { scope: sectionRef, dependencies: [ready] },
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="about-section bg-[#0a0a0a] text-white overflow-hidden relative z-30"
    >
      <div
        className="about-wrapper signature-wrapper"
        style={{ paddingLeft: "clamp(1.25rem, 7vw, 9rem)" }}
      >
        {/* INTRO */}
        <div className="intro signature-intro">
          <p className="signature-tag uppercase text-[#A67C52] text-[11px] font-medium">
            Signature
          </p>

          <h1 className="signature-title about-title mt-3 text-[38px] sm:text-[46px] md:text-5xl lg:text-[56px] leading-[1.05] font-semibold">
            Signature
            <br />
            Projects
          </h1>

          <div className="signature-break mt-5 w-10 h-[2px] bg-[#A67C52]" />

          <p className="signature-description mt-5 text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-[300px]">
            Every plate tells a story — prepared fresh with authentic Indian
            flavours and handcrafted ingredients.
          </p>
        </div>

        {/* CARDS */}
        {projects.map((dish, index) => (
          <div key={index} className="dish-card group signature-card">
            <img
              src={dish.src}
              alt={dish.title}
              className="w-full h-full object-cover scale-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute inset-0 rounded-[18px] ring-1 ring-white/10 group-hover:ring-[#A67C52]/60 transition-colors duration-500" />

            <div className="absolute bottom-0 p-4 md:p-5 w-full">
              <span className="text-[10px] uppercase tracking-[2px] text-[#D4A574]">
                {dish.category}
              </span>
              <h2 className="title-card mt-1 text-lg md:text-xl font-semibold leading-snug">
                {dish.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SignatureProjects;
