import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import {
  ArrowRight,
  Mail
} from 'lucide-react';

interface FooterCTAProps {
  onGetStarted: () => void;
}

const FooterCTA: React.FC<FooterCTAProps> = ({ onGetStarted }) => {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="overflow-hidden pt-0 md:pt-0 border-t border-border/50">
      <div className="relative flex w-full flex-col items-center gap-6 text-center sm:gap-8 py-12 md:py-24 px-4">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
          {/* Badge */}
          <Badge variant="outline">
            <span className="text-muted-foreground">Get started</span>
          </Badge>

          {/* Title */}
          <h3 className="text-2xl font-semibold sm:text-5xl">
            Ready to transform your
            <span className="block text-brand">financial future?</span>
          </h3>

          {/* Description */}
          <p className="text-muted-foreground max-w-2xl">
            Join thousands of users who have already started their journey to financial freedom.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <HoverBorderGradient
              onClick={onGetStarted}
              className="text-lg px-4 py-2 h-auto group bg-button-gradient cursor-pointer transform hover:scale-105 transition-transform"
              containerClassName="rounded-full"
              duration={2}
            >
              <span className="flex items-center text-white">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </HoverBorderGradient>
            <HoverBorderGradient
              className="text-lg px-4 py-2 h-auto group bg-background hover:bg-muted/50 text-foreground cursor-pointer transform hover:scale-105 transition-transform"
              containerClassName="rounded-full"
              duration={2}
            >
              <span className="flex items-center">
                Schedule Demo
              </span>
            </HoverBorderGradient>
          </div>

          {/* Newsletter Section */}
          <div className="max-w-md mx-auto w-full">
            <p className="text-sm text-muted-foreground mb-4">
              Get updates and financial tips delivered to your inbox
            </p>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <HoverBorderGradient
                as="button"
                className="px-4 py-2 h-auto bg-background hover:bg-muted/50 text-foreground"
                containerClassName="rounded-full"
                duration={2}
                aria-label="Subscribe"
              >
                <Mail className="h-4 w-4" />
              </HoverBorderGradient>
            </form>
          </div>
        </div>

        {/* Glow Effect - Outside motion wrapper */}
        <div className="fade-top-lg pointer-events-none absolute inset-0 rounded-2xl shadow-glow" />
      </div>
    </section>
  );
};

export default FooterCTA;