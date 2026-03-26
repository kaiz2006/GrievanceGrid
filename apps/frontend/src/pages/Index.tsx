import HeroSection from "@/components/HeroSection";
import LogoMarquee from "@/components/LogoMarquee";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import ComparisonSection from "@/components/ComparisonSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <>
      <div id="home"><HeroSection /></div>
      <LogoMarquee />
      <div id="impact"><StatsSection /></div>
      <div id="monitoring"><HowItWorks /></div>
      <div id="solutions"><FeaturesSection /></div>
      <WhyChooseUs />
      <TestimonialsSection />
      <div id="pricing"><PricingSection /></div>
      <ComparisonSection />
      <div id="resources"><FAQSection /></div>
    </>
  );
};

export default Index;
