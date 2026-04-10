import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  PiggyBank,
  LineChart,
  ListOrdered,
  User,
  LogOut,
  Receipt,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  HelpCircle,
  Crown,
  Zap,
} from 'lucide-react';
import { BudgetpunkLogo } from '@/components/logo/BudgetpunkLogo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  collapsed: boolean;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'secondary';
}

const NavItem = ({ icon, label, href, isActive, collapsed, badge, badgeVariant = 'default' }: NavItemProps) => (
  <Link to={href} className="block relative group">
    {/* Neon accent bar — glows on active */}
    <div
      className={cn(
        "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300 ease-[var(--motion-ease-spring)]",
        isActive
          ? "h-6 bg-brand opacity-100 shadow-[0_0_8px_hsl(var(--brand)/0.6),0_0_20px_hsl(var(--brand)/0.3)]"
          : "h-0 bg-brand opacity-0 group-hover:h-4 group-hover:opacity-50"
      )}
    />
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 h-11 transition-all duration-200 ease-[var(--motion-ease-out)] relative overflow-hidden",
        collapsed && "justify-center px-0",
        isActive
          ? "bg-brand/10 text-brand dark:bg-brand/15 dark:text-blue-300"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/80"
      )}
    >
      {/* Subtle scan-line shimmer on active */}
      {isActive && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)',
          }}
        />
      )}
      <span className={cn(
        "shrink-0 transition-transform duration-200",
        isActive && "drop-shadow-[0_0_4px_hsl(var(--brand)/0.5)]"
      )}>
        {icon}
      </span>
      {!collapsed && (
        <span className="font-medium text-sm truncate">{label}</span>
      )}
      {!collapsed && badge && (
        <span className={cn(
          "ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums leading-none",
          badgeVariant === 'success' && "bg-success/15 text-success",
          badgeVariant === 'warning' && "bg-warning/15 text-warning",
          badgeVariant === 'secondary' && "bg-secondary text-secondary-foreground",
          badgeVariant === 'default' && "bg-brand/15 text-brand"
        )}>
          {badge}
        </span>
      )}
    </div>
    {/* Tooltip for collapsed mode */}
    {collapsed && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md bg-popover text-popover-foreground text-xs font-medium shadow-lg border border-border/50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
        {label}
        {badge && <span className="ml-1.5 text-brand font-bold">({badge})</span>}
      </div>
    )}
  </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const { logOut, currentUser } = useAuthStore();
  const { isProUser } = useSubscription();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard" },
    { icon: <PiggyBank size={20} />, label: "Savings", href: "/savings" },
    { icon: <LineChart size={20} />, label: "Investments", href: "/investments" },
    { icon: <ListOrdered size={20} />, label: "Transactions", href: "/transactions" },
    { icon: <Receipt size={20} />, label: "Bills", href: "/bills" },
    { icon: <User size={20} />, label: "Profile", href: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const requestLogout = () => setIsConfirmOpen(true);
  const confirmLogout = async () => {
    setIsConfirmOpen(false);
    await handleLogout();
  };
  const cancelLogout = () => setIsConfirmOpen(false);

  const userInitial = currentUser?.email?.charAt(0).toUpperCase() || 'U';
  const userName = currentUser?.email?.split('@')[0] || 'User';

  return (
    <>
      {/* Desktop sidebar — hidden below lg */}
      <aside
        className={cn(
          "hidden lg:flex h-screen flex-col bg-sidebar border-r border-sidebar-border/40 transition-[width] duration-300 ease-[var(--motion-ease-out)] relative",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center h-16 border-b border-sidebar-border/30 shrink-0",
          collapsed ? "justify-center px-2" : "px-4 gap-3"
        )}>
          <BudgetpunkLogo size={collapsed ? 28 : 32} />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground cyberpunk-title">
              Budgetpunk
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              collapsed={collapsed}
              isActive={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
            />
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 py-1 border-t border-sidebar-border/30">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center gap-3 w-full h-9 rounded-lg px-3 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-all duration-200",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            {!collapsed && <span className="text-xs font-medium">Collapse</span>}
          </button>
        </div>

        {/* User section at bottom */}
        <div className="px-2 py-3 border-t border-sidebar-border/30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full rounded-lg px-2 py-2 hover:bg-sidebar-accent/60 transition-colors duration-150 outline-none",
                  collapsed && "justify-center px-0"
                )}
              >
                {/* Avatar with brand glow ring */}
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center text-brand text-sm font-bold shadow-[0_0_10px_hsl(var(--brand)/0.15)]">
                    {userInitial}
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-sidebar" />
                </div>
                {!collapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-semibold text-sidebar-foreground truncate">{userName}</div>
                    <div className="text-[10px] text-sidebar-foreground/40 flex items-center gap-1">
                      {isProUser ? (
                        <><Crown className="h-3 w-3 text-yellow-500" /> Punk Pro</>
                      ) : (
                        'Free plan'
                      )}
                    </div>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={collapsed ? "right" : "top"}
              align={collapsed ? "start" : "center"}
              className="w-56"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
              </div>
              <DropdownMenuSeparator />
              {!isProUser && (
                <DropdownMenuItem onClick={() => setShowUpgrade(true)} className="text-brand focus:text-brand">
                  <Zap size={14} className="mr-2" />
                  Upgrade to Pro
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <Settings size={14} className="mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle size={14} className="mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={requestLogout} className="text-destructive focus:text-destructive">
                <LogOut size={14} className="mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Upgrade modal */}
      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />

      {/* Logout confirmation dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              You will be signed out of your account and returned to the landing page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLogout}>Cancel</Button>
            <Button variant="destructive" onClick={confirmLogout}>Log out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
