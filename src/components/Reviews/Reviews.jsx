import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Reviews.css";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    quote:
      "Every dish tastes like it was made for someone who actually cares about food.",
    name: "Ananya R.",
    rating: 5,
  },
  {
    quote:
      "Consistent quality every single time. The shawaya alone is worth the visit.",
    name: "Karthik M.",
    rating: 5,
  },
  {
    quote:
      "Fresh ingredients, bold flavours, no shortcuts. Exactly what a kitchen should be.",
    name: "Priya S.",
    rating: 5,
  },
];

export default function Reviews() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const isDesktop = window.innerWidth >= 1024;
      const q = gsap.utils.selector(sectionRef);

      // Desktop only section zoom
      if (isDesktop) {
        gsap.set(sectionRef.current, {
          scale: 0.9,
          y: 80,
          borderRadius: 30,
          transformOrigin: "center center",
        });

        gsap.to(sectionRef.current, {
          scale: 1,
          y: 0,
          borderRadius: 0,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      }

      // Eyebrow
      gsap.from(q(".reviews-eyebrow"), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",

        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Heading
      gsap.from(q(".reviews-title"), {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",

        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Cards
      gsap.from(q(".review-card"), {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",

        scrollTrigger: {
          trigger: q(".reviews-grid")[0],
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    {
      scope: sectionRef,
      revertOnUpdate: true,
    }
  );

  return (
    <section ref={sectionRef} className="reviews-section">
      <div className="reviews-header">
        <p className="reviews-eyebrow">
          Best Quality Food
        </p>

        <h2 className="reviews-title">
          What people are saying
        </h2>
      </div>

      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-stars">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            <p className="review-quote">
              "{review.quote}"
            </p>

            <p className="review-name">
              {review.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}