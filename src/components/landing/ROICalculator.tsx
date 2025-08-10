import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MotionContainer } from '@/components/ui/motion-container';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import DisplayCards from '@/components/ui/display-cards';
import {
  TrendingUp,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle,
  Award
} from 'lucide-react';

interface ROICalculatorProps {
  onGetStarted: () => void;
}

const successCards = [
  {
    icon: <TrendingUp className="size-4 text-green-300" />,
    title: "Portfolio Growth",
    description: "Average 18.4% annual returns",
    date: "Last 12 months",
    iconClassName: "text-green-500",
    titleClassName: "text-green-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Trophy className="size-4 text-amber-300" />,
    title: "Top Performer",
    description: "Outperformed S&P 500 by 12%",
    date: "YTD 2024",
    iconClassName: "text-amber-500",
    titleClassName: "text-amber-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Target className="size-4 text-blue-300" />,
    title: "Goal Achievement",
    description: "95% of users hit their targets",
    date: "This quarter",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

const ROICalculator: React.FC<ROICalculatorProps> = ({ onGetStarted }) => {
  return (
    <section id="success-showcase" className="py-20 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center overflow-visible">
          <MotionContainer variant="slide-right" delay={0.1}>
            <Badge variant="secondary" className="mb-4 text-center w-fit lg:text-left mx-auto lg:mx-0 flex justify-center lg:justify-start items-center">
              <Award className="h-3 w-3 mr-1" />
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center lg:text-left">
              Real results from
              <span className="block text-brand">real people</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 text-center lg:text-left">
              Join thousands of successful investors who have transformed their financial future with our platform.
            </p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground mb-8 items-center lg:items-start">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Average 18.4% annual returns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Over 50,000 successful investors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>$2.1B+ in managed assets</span>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <HoverBorderGradient
                onClick={onGetStarted}
                className="px-8 py-3 bg-brand hover:bg-brand/90 dark:bg-brand dark:hover:bg-brand/90 cursor-pointer"
                containerClassName="rounded-full"
                duration={2}
              >
                <span className="flex items-center text-white font-medium">
                  Join the Success
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </HoverBorderGradient>
            </div>
          </MotionContainer>

          <MotionContainer
            variant="slide-left"
            delay={0.2}
            className="w-full flex justify-center"
          >
            <DisplayCards cards={successCards} />
          </MotionContainer>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;