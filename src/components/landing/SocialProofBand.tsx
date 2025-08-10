import React, { useEffect } from 'react';
import { AnimatedDiv } from '@/components/ui/animated';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { useCounter, useInView } from '@/hooks';

const SocialProofBand: React.FC = () => {
  // Counter hooks
  const usersCount = useCounter(50000, 2000);
  const transactionsCount = useCounter(2500000, 2500);
  const uptimeCount = useCounter(99.9, 2000);
  
  // Intersection observer for scroll animations
  const [socialProofRef, socialProofInView] = useInView();

  // Trigger counters when social proof section is in view
  useEffect(() => {
    if (socialProofInView) {
      usersCount.setIsVisible(true);
      transactionsCount.setIsVisible(true);
      uptimeCount.setIsVisible(true);
    }
  }, [socialProofInView]);

  return (
    <section 
      ref={socialProofRef}
      className="border-y border-border/50 bg-muted/50 py-16"
    >
      <div className="container mx-auto px-4">
        <AnimatedDiv
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <AnimatedDiv variants={fadeInUp}>
            <p className="text-muted-foreground mb-8">
              Trusted by thousands of users worldwide
            </p>
          </AnimatedDiv>
        </AnimatedDiv>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <AnimatedDiv variants={fadeInUp} custom={0}>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-brand">
                {usersCount.count.toLocaleString()}+
              </p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
          </AnimatedDiv>
          
          <AnimatedDiv variants={fadeInUp} custom={1}>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-brand">
                ${(transactionsCount.count / 1000000).toFixed(1)}M+
              </p>
              <p className="text-muted-foreground">Transactions Processed</p>
            </div>
          </AnimatedDiv>
          
          <AnimatedDiv variants={fadeInUp} custom={2}>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-brand">
                {uptimeCount.count}%
              </p>
              <p className="text-muted-foreground">Uptime Guarantee</p>
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
};

export default SocialProofBand;