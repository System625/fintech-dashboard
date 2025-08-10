import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BudgetpunkLogo } from '@/components/logo/BudgetpunkLogo';

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const footerSections = [
  {
    label: 'Product',
    links: [
      { title: 'Features', href: '#' },
      { title: 'Pricing', href: '#' },
      { title: 'Security', href: '#' },
      { title: 'Mobile Apps', href: '#' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'About Us', href: '#' },
      { title: 'Careers', href: '#' },
      { title: 'Press', href: '#' },
      { title: 'Contact', href: '#' },
    ],
  },
  {
    label: 'Support',
    links: [
      { title: 'Help Center', href: '#' },
      { title: 'Privacy Policy', href: '#' },
      { title: 'Terms of Service', href: '#' },
      { title: 'API Docs', href: '#' },
    ],
  },
];

const LandingFooter: React.FC = () => {
  return (
    <footer className="md:rounded-t-6xl relative w-full flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid container mx-auto gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="flex items-center">
            <BudgetpunkLogo size={58} />
            <span className="text-lg font-bold text-foreground">Budgetpunk</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Transforming how you manage, save, and invest your money with intelligent financial tools.
          </p>
          <p className="text-muted-foreground mt-8 text-sm md:mt-4">
            © {new Date().getFullYear()} Budgetpunk. All rights reserved.
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
          {footerSections.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs font-semibold mb-4">{section.label}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="hover:text-foreground inline-flex items-center transition-all duration-300"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;