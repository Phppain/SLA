// src/pages/Home.jsx
import React from "react";
import HeroCarousel from '../components/HeroCarousel';
import HeroSection from '../components/HeroSection';
import InspirationSection from "../components/InspirationSection";

const Home = () => {
  return (
    <div className="p-4">
      <HeroCarousel />
      <HeroSection />
      <InspirationSection />
    </div>
  );
};

export default Home;
