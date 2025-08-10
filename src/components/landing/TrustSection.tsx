import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AnimatedDiv } from '@/components/ui/animated';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import {
  Shield,
  Award,
  Building,
  Users,
  Quote
} from 'lucide-react';

interface TrustItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const TrustItem = ({ area, icon, title, description }: TrustItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <div className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const TrustSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <AnimatedDiv
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <AnimatedDiv variants={fadeInUp}>
          <Badge variant="secondary" className="mb-4">Security & Trust</Badge>
          <h3 className="text-2xl md:text-4xl font-bold mb-4">
            Your money is
            <span className="block text-brand">safe with us</span>
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We use industry-leading security measures to protect your financial data and privacy.
          </p>
        </AnimatedDiv>
      </AnimatedDiv>

      <AnimatedDiv
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <TrustItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<Shield className="h-4 w-4" />}
            title="256-bit Encryption"
            description="Bank-level security protects all your sensitive financial information with military-grade encryption."
          />
          <TrustItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={<Award className="h-4 w-4" />}
            title="SOC 2 Certified"
            description="Independently audited for security, availability, and confidentiality by top security firms."
          />
          <TrustItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={<Building className="h-4 w-4" />}
            title="FDIC Insured"
            description={
              <div>
                <strong>$250,000</strong> deposit protection backed by federal insurance for complete peace of mind.
              </div>
            }
          />
          <TrustItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={<Users className="h-4 w-4" />}
            title="Trusted by 50,000+"
            description="Join thousands of satisfied customers who trust us with their financial future every day."
          />
          <TrustItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={<Quote className="h-4 w-4" />}
            title="5-Star Reviews"
            description={
              <div>
                <b>4.9/5 rating</b> from verified users. "The most secure and user-friendly platform I've ever used."
              </div>
            }
          />
        </ul>
      </AnimatedDiv>
    </section>
  );
};

export default TrustSection;