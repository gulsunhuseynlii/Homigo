import Hero from "../../components/home/Hero";
import CategoriesSection from "../../components/home/CategoriesSection";
import FeatureSection from "../../components/FeatureSection";
import ProviderCTA from "../../components/ProviderCTA";
import AiAssistant from "../../components/ai/AiAssistant";

function GuestHome() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeatureSection />
      <ProviderCTA />

      <AiAssistant />
    </>
  );
}

export default GuestHome;