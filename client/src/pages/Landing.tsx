import GalaxyBackground from '@/components/GalaxyBackground';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import UploadSection from '@/components/UploadSection';
import ResultsSection from '@/components/ResultsSection';
import Footer from '@/components/Footer';

export default function Landing() {
  return (
    <div className="relative min-h-screen">
      <GalaxyBackground />
      <Navigation isLanding={true} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UploadSection />
      <ResultsSection />
      <Footer />
    </div>
  );
}
