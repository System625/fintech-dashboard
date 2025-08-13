import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  LandingNav,
  LandingHero,
  SocialProofBand,
  FeaturesGrid,
  ROICalculator,
  TrustSection,
  TestimonialSection,
  PricingSection,
  FooterCTA,
  LandingFooter
} from '@/components/landing';

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav onGetStarted={handleGetStarted} />
      {/* Account for fixed header on mobile with top padding */}
      <div className="pt-16 md:pt-0">
      <LandingHero onGetStarted={handleGetStarted} />
      <SocialProofBand />
      <FeaturesGrid />
      <ROICalculator onGetStarted={handleGetStarted} />      
      <TrustSection />
      <TestimonialSection />
      <PricingSection onGetStarted={handleGetStarted} />
      <FooterCTA onGetStarted={handleGetStarted} />
      <LandingFooter />
      </div>
    </div>
  );
};

export default LandingPage;