import { useEffect, useState } from "react";

import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import SignatureDishes from "./components/Signature/SignatureDishes";
import Reviews from "./components/Reviews/Reviews";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";

import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 3500); // Keep loader visible for at least 2.5 seconds
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Hero />
      <About />
      <SignatureDishes />
      <Reviews />
      <Footer />
    </>
  );
}