import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemStrip } from "@/components/landing/ProblemStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { SafetyManifesto } from "@/components/landing/SafetyManifesto";
import { ExperienceDiscovery } from "@/components/landing/ExperienceDiscovery";
import { TravelerStories } from "@/components/landing/TravelerStories";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <Helmet>
        <title>My Itinerary | AI Travel Planner & Verified Healthcare in India</title>
        <meta
          name="description"
          content="Experience India with confidence. My Itinerary combines AI-powered trip planning with a verified network of local guardians and English-speaking doctors for the safest, most authentic travel experience."
        />
        <meta
          name="keywords"
          content="AI travel planner india, safe travel for women india, medical tourism india, verified local guides india, authentic indian experiences"
        />
        <link rel="canonical" href="https://myitinerary.com/" />
      </Helmet>
      <Navbar />

      <main>
        <Hero />
        <ProblemStrip />
        <HowItWorks />
        <FeatureShowcase />
        <SafetyManifesto />
        <ExperienceDiscovery />
        <TravelerStories />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
