import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PiggyBank, 
  LineChart, 
  ListOrdered, 
  User, 
  LogOut, 
  Menu,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const NavItem = ({ icon, label, href, isActive }: NavItemProps) => (
  <Link to={href}>
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const { logOut } = useAuth();
  
  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard"
    },
    {
      icon: <PiggyBank size={20} />,
      label: "Savings",
      href: "/savings"
    },
    {
      icon: <LineChart size={20} />,
      label: "Investments",
      href: "/investments"
    },
    {
      icon: <ListOrdered size={20} />,
      label: "Transactions",
      href: "/transactions"
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
    <div className="hidden lg:flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 flex items-center space-x-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-sidebar-foreground">FinDash</h1>
      </div>
      <div className="flex-1 px-3 py-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={location.pathname === item.href}
          />
        ))}
      </div>
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  // Mobile drawer menu
  const MobileSidebar = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden fixed top-[14px] left-4 z-50">
          <Menu />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-sidebar p-0 w-[240px]">
        <SheetHeader className="p-4 border-b border-sidebar-border">
          <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
            <BarChart3 className="h-6 w-6 text-primary" />
            FinDash
          </SheetTitle>
        </SheetHeader>
        <div className="px-3 py-4 space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
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