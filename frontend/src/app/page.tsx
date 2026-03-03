"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorks from "../components/HowItWorks";
import StatsSection from "../components/StatsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Home() {
  useEffect(() => {
    // Initialize smooth scrolling with Lenis
    const initLenis = async () => {
      try {
        const LenisModule = await import("@studio-freight/lenis");
        const Lenis = LenisModule.default;
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          duration: 0.2,
          lerp: 0.1,
          smoothWheel: true,
        });

        // Sync Lenis scroll position with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time: number) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
          gsap.ticker.remove((time: number) => {
            lenis.raf(time * 1000);
          });
          lenis.destroy();
        };
      } catch {
        // Fallback: Lenis not available, use native scroll
        console.log("Lenis not available, using native scroll");
      }
    };

    initLenis();
  }, []);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
