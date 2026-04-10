import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PiggyBank,
  LineChart,
  ListOrdered,
  Receipt,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: PiggyBank, label: "Savings", href: "/savings" },
  { icon: ListOrdered, label: "Activity", href: "/transactions" },
  { icon: LineChart, label: "Invest", href: "/investments" },
  { icon: Receipt, label: "Bills", href: "/bills" },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/90 backdrop-blur-xl safe-area-bottom">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

      <div className="flex items-stretch justify-around h-16 px-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = location.pathname === href || location.pathname.startsWith(href + '/');

          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 min-w-[44px] min-h-[44px] relative transition-colors duration-200",
                isActive
                  ? "text-brand"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {/* Active glow dot */}
              {isActive && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand shadow-[0_0_6px_2px_hsl(var(--brand)/0.5)]" />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={cn(
                  "transition-all duration-200",
                  isActive && "drop-shadow-[0_0_4px_hsl(var(--brand)/0.4)]"
                )}
              />
              <span className={cn(
                "text-[10px] leading-none font-medium",
                isActive && "font-semibold"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
