import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LandingNav,
  LandingHero,
  SocialProofBand,
  FeaturesGrid,
  ROICalculator,
  TrustSection,
  TestimonialSection,
  FooterCTA,
  LandingFooter
} from '@/components/landing';

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/register');
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
      <FooterCTA onGetStarted={handleGetStarted} />
      <LandingFooter />
      </div>
    </div>
  );
};

export default LandingPage;