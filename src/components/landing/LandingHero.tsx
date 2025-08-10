import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { useTypewriter } from '@/hooks';
import {
  Zap,
  ArrowRight,
  Play,
  TrendingUp
} from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ onGetStarted }) => {
  // Instant text for FCP, then animate after page loads
  const { displayText: heroText } = useTypewriter(
    'Transform Your Financial Future Today',
    80,
    { instantOnMount: true, delay: 1500 } // Show immediately, animate later
  );

  return (
    <section className="relative overflow-hidden">
      {/* Background Paths */}
      <div className="absolute inset-0 opacity-30">
        <BackgroundPaths backgroundOnly={true} />
      </div>

      <div className="relative container mx-auto px-4 py-10 lg:pb-10 lg:pt-0">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="mb-4 mx-auto lg:mx-0 flex justify-center lg:justify-start items-center w-fit">
              <Zap className="h-3 w-3 mr-1" />
              New: AI-Powered Insights
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-brand text-center lg:text-left">
              {heroText}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-center lg:text-left">
              Smart budgeting meets intelligent investing. Build wealth with precision.
            </p>

            <div className="flex flex-row gap-4 justify-center lg:justify-start">
              <HoverBorderGradient
                onClick={onGetStarted}
                className="text-lg px-4 py-2 h-auto group bg-button-gradient cursor-pointer hover:scale-105 transition-transform"
                containerClassName="rounded-full"
                duration={2}
              >
                <span className="flex items-center text-white">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </HoverBorderGradient>
              <HoverBorderGradient
                className="text-lg px-4 py-2 h-auto group bg-background hover:bg-muted/50 text-foreground cursor-pointer hover:scale-105 transition-transform"
                containerClassName="rounded-full"
                duration={2}
              >
                <span className="flex items-center">
                  <Play className="mr-2 h-5 w-5" />
                  See Demo
                </span>
              </HoverBorderGradient>
            </div>
          </div>

          {/* Product Preview - 3D Card */}
          <div className="relative">
            <CardContainer className="inter-var py-0">
              <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-brand/[0.1] dark:bg-card dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[30rem] h-auto rounded-2xl p-8 border shadow-2xl">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-foreground mb-2 text-center lg:text-left"
                >
                  Portfolio Overview
                </CardItem>

                <CardItem
                  translateZ="20"
                  className="mb-4 flex justify-center lg:justify-start"
                >
                  <Badge variant="secondary" className="text-xs">Live</Badge>
                </CardItem>

                <CardItem translateZ="100" className="w-full mb-6">
                  <div className="bg-gradient-to-br from-brand/10 via-transparent to-brand/5 p-6 rounded-xl">
                    <div className="space-y-6">
                      <div className="text-center lg:text-left">
                        <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                        <p className="text-3xl font-bold">$47,823.45</p>
                        <p className="text-sm text-green-600 flex items-center justify-center lg:justify-start">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12.5% this month
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-center lg:text-left">
                          <p className="text-xs text-muted-foreground">Savings</p>
                          <p className="font-semibold">$28,450</p>
                        </div>
                        <div className="space-y-1 text-center lg:text-left">
                          <p className="text-xs text-muted-foreground">Investments</p>
                          <p className="font-semibold">$19,373</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardItem>

                <CardItem translateZ="80" className="w-full">
                  <div className="h-20 bg-gradient-to-r from-brand/20 to-brand/10 rounded-lg flex items-end justify-between p-2">
                    {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                      <div
                        key={i}
                        className="bg-brand rounded-sm w-3 transition-all duration-1000"
                        style={{
                          height: `${height}%`,
                          transitionDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;