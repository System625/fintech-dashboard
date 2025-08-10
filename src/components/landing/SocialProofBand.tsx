import React, { useEffect } from 'react';
import { MotionContainer } from '@/components/ui/motion-container';
import { useCounter, useInView } from '@/hooks';
import { motion } from 'motion/react';

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
        <MotionContainer variant="fade-scale" delay={0.2}>
          <p className="text-muted-foreground mb-12 text-center">
            Trusted by thousands of users worldwide
          </p>
        </MotionContainer>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <MotionContainer variant="flip-in" delay={0.4}>
            <motion.div 
              className="space-y-2 p-6 rounded-xl hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.p 
                className="text-4xl font-bold text-brand"
                animate={{ 
                  scale: socialProofInView ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  delay: 1 
                }}
              >
                {usersCount.count.toLocaleString()}+
              </motion.p>
              <p className="text-muted-foreground font-medium">Active Users</p>
            </motion.div>
          </MotionContainer>
          
          <MotionContainer variant="flip-in" delay={0.6}>
            <motion.div 
              className="space-y-2 p-6 rounded-xl hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.p 
                className="text-4xl font-bold text-brand"
                animate={{ 
                  scale: socialProofInView ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  delay: 1.5 
                }}
              >
                ${(transactionsCount.count / 1000000).toFixed(1)}M+
              </motion.p>
              <p className="text-muted-foreground font-medium">Transactions Processed</p>
            </motion.div>
          </MotionContainer>
          
          <MotionContainer variant="flip-in" delay={0.8}>
            <motion.div 
              className="space-y-2 p-6 rounded-xl hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.p 
                className="text-4xl font-bold text-brand"
                animate={{ 
                  scale: socialProofInView ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  delay: 2 
                }}
              >
                {uptimeCount.count}%
              </motion.p>
              <p className="text-muted-foreground font-medium">Uptime Guarantee</p>
            </motion.div>
          </MotionContainer>
        </div>
      </div>
    </section>
  );
};

export default SocialProofBand;