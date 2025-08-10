import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedDiv } from '@/components/ui/animated';
import { Marquee } from '@/components/ui/3d-testimonials';
import { fadeInUp, staggerContainer } from '@/lib/motion';

// Budgetpunk testimonials data
const testimonials = [
  {
    name: 'Sarah Chen',
    username: '@sarahc',
    body: 'Finally saved $15K for my dream home down payment using the smart goals feature!',
    img: 'https://randomuser.me/api/portraits/women/32.jpg',
    country: '🇺🇸 USA',
  },
  {
    name: 'Marcus Johnson',
    username: '@marcus',
    body: 'The AI investment recommendations increased my returns by 23% this year.',
    img: 'https://randomuser.me/api/portraits/men/68.jpg',
    country: '🇺🇸 USA',
  },
  {
    name: 'Elena Rodriguez',
    username: '@elena',
    body: 'Love how it tracks my spending automatically. Saved me 5 hours per month!',
    img: 'https://randomuser.me/api/portraits/women/51.jpg',
    country: '🇪🇸 Spain',
  },
  {
    name: 'David Kim',
    username: '@davidk',
    body: 'Best budgeting app ever! The insights are incredibly accurate.',
    img: 'https://randomuser.me/api/portraits/men/53.jpg',
    country: '🇰🇷 Korea',
  },
  {
    name: 'Jessica Williams',
    username: '@jess',
    body: 'Paid off $30K in debt using their debt optimization strategy. Life-changing!',
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    country: '🇨🇦 Canada',
  },
  {
    name: 'Alexandre Dubois',
    username: '@alex',
    body: 'The expense categorization is so smart. It learns my spending patterns perfectly.',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    country: '🇫🇷 France',
  },
  {
    name: 'Yuki Tanaka',
    username: '@yuki',
    body: 'Mobile app is incredibly smooth. I can manage everything on the go.',
    img: 'https://randomuser.me/api/portraits/women/85.jpg',
    country: '🇯🇵 Japan',
  },
  {
    name: 'Michael Brown',
    username: '@mikeb',
    body: 'Security features give me complete peace of mind with my finances.',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    country: '🇬🇧 UK',
  },
  {
    name: 'Sofia Andersson',
    username: '@sofia',
    body: 'The investment portfolio grew 18% last year. Amazing automated rebalancing!',
    img: 'https://randomuser.me/api/portraits/women/61.jpg',
    country: '🇸🇪 Sweden',
  },
  {
    name: 'Carlos Santos',
    username: '@carlos',
    body: 'Emergency fund tracking motivated me to save $10K in just 8 months.',
    img: 'https://randomuser.me/api/portraits/men/75.jpg',
    country: '🇧🇷 Brazil',
  },
  {
    name: 'Priya Patel',
    username: '@priya',
    body: 'The financial insights helped me optimize my tax strategy and save $3K.',
    img: 'https://randomuser.me/api/portraits/women/25.jpg',
    country: '🇮🇳 India',
  },
  {
    name: 'James Wilson',
    username: '@james',
    body: 'Retirement planning tool showed me exactly how to reach my goals 5 years early.',
    img: 'https://randomuser.me/api/portraits/men/42.jpg',
    country: '🇦🇺 Australia',
  },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-64 mx-2">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="text-sm text-foreground leading-relaxed">"{body}"</blockquote>
      </CardContent>
    </Card>
  );
}

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedDiv
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <AnimatedDiv variants={fadeInUp}>
            <Badge variant="secondary" className="mb-4">Success Stories</Badge>
            <h3 className="text-2xl md:text-4xl font-bold mb-4 flex items-center gap-2 justify-center">
              Real people,
              <span className="block text-brand">real results</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who have transformed their financial lives with our platform.
            </p>
          </AnimatedDiv>
        </AnimatedDiv>

        <AnimatedDiv
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="border border-border rounded-2xl relative flex h-96 w-full max-w-[1200px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px] bg-background/50 backdrop-blur-sm">
            <div
              className="flex flex-row items-center gap-4"
              style={{
                transform:
                  'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
              }}
            >
              {/* Vertical Marquee (downwards) */}
              <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              {/* Vertical Marquee (upwards) */}
              <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              {/* Vertical Marquee (downwards) */}
              <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              {/* Vertical Marquee (upwards) */}
              <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
            </div>
            
            {/* Gradient overlays for smooth fade effect */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background/50"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/50"></div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background/50"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background/50"></div>
          </div>
        </AnimatedDiv>
      </div>
    </section>
  );
};

export default TestimonialSection;