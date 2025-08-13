import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PiggyBank, 
  LineChart, 
  ListOrdered, 
  User, 
  LogOut, 
  Menu
} from 'lucide-react';
import { BudgetpunkLogo } from '@/components/logo/BudgetpunkLogo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useAuthStore } from '@/stores/useAuthStore';
import { GlitchText } from '@/components/ui/GlitchText';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'secondary';
}

const NavItem = ({ icon, label, href, isActive, badge, badgeVariant = 'default' }: NavItemProps) => (
  <Link to={href}>
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "w-full justify-between h-11 px-3 rounded-lg gap-3 transition-all duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)]",
        isActive 
          ? "bg-brand text-white shadow-sm hover:shadow-md" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">
          <GlitchText intensity="low" trigger="hover">{label}</GlitchText>
        </span>
      </div>
      {badge && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums",
          badgeVariant === 'success' && "bg-success/20 text-success",
          badgeVariant === 'warning' && "bg-warning/20 text-warning",
          badgeVariant === 'secondary' && "bg-secondary text-secondary-foreground",
          badgeVariant === 'default' && (
            isActive 
              ? "bg-white/20 text-brand-foreground" 
              : "bg-sidebar-accent text-sidebar-accent-foreground"
          )
        )}>
          {badge}
        </span>
      )}
    </Button>
  </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const { logOut } = useAuthStore();
  
  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard",
      badge: "$24.8K",
      badgeVariant: "success" as const
    },
    {
      icon: <PiggyBank size={20} />,
      label: "Savings",
      href: "/savings",
      badge: "$12.5K",
      badgeVariant: "success" as const
    },
    {
      icon: <LineChart size={20} />,
      label: "Investments",
      href: "/investments",
      badge: "+8.4%",
      badgeVariant: "success" as const
    },
    {
      icon: <ListOrdered size={20} />,
      label: "Transactions",
      href: "/transactions",
      badge: "12",
      badgeVariant: "secondary" as const
    },
    {
      icon: <User size={20} />,
      label: "Profile",
      href: "/profile"
    }
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      // Success toast is shown in AuthContext
    } catch (error) {
      // Error is already handled in the AuthContext with toast
      console.error("Logout error:", error);
    }
  };

  // Desktop sidebar
  const DesktopSidebar = (
    <div className="hidden lg:flex h-screen w-72 flex-col bg-sidebar border-r border-sidebar-border/50 shadow-sm">
      <div className="p-4 flex items-center">
        <BudgetpunkLogo size={58} />
        <h4 className="text-xl font-bold text-sidebar-foreground">Budgetpunk</h4>                  
      </div>
      <div className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            badge={item.badge}
            badgeVariant={item.badgeVariant}
            isActive={location.pathname === item.href}
          />
        ))}
      </div>
      <div className="p-4 border-t border-sidebar-border/50">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 transition-all duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)]"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="font-medium">
            <GlitchText intensity="low" trigger="hover">Logout</GlitchText>
          </span>
        </Button>
      </div>
    </div>
  );

  // Mobile drawer menu
  const MobileSidebar = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden fixed top-[14px] left-4 z-50 rounded-lg">
          <Menu />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-sidebar p-0 w-[280px]">
        <SheetHeader className="p-6 border-b border-sidebar-border/50">
          <SheetTitle className="flex items-center gap-3 text-sidebar-foreground">
            <BudgetpunkLogo size={24} />
            <div className="text-left">
              <div className="text-sm font-bold">Budgetpunk</div>
              <div className="text-xs text-muted-foreground">Financial Dashboard</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              badge={item.badge}
              badgeVariant={item.badgeVariant}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
        <div className="p-4 border-t border-sidebar-border/50">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-11 px-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 transition-all duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)]"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium">
              <GlitchText intensity="low" trigger="hover">Logout</GlitchText>
            </span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  );
};

export default Sidebar; 