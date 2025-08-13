import { Bell, Moon, Sun, Search, Plus, ArrowUpRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { GlitchText } from '@/components/ui/GlitchText';

const Header = () => {
  const { currentUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">        
        {/* Left side - Search */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full data-stream">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions, accounts... (⌘K)"
              className="pl-10 pr-4 bg-background/50 border-border/50 focus-visible:bg-background cyber-border"
            />
          </div>
        </div>

        {/* Center - Quick Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button size="sm" className="gap-2 cyber-glow-blue">
            <Plus className="h-4 w-4" />
            <GlitchText intensity="low" trigger="hover">Add Transaction</GlitchText>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 cyber-border">
            <ArrowUpRight className="h-4 w-4" />
            <GlitchText intensity="low" trigger="hover">Transfer</GlitchText>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 cyber-border">
            <CreditCard className="h-4 w-4" />
            <GlitchText intensity="low" trigger="hover">Pay Bill</GlitchText>
          </Button>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand border-2 border-background"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="flex items-center space-x-3 pl-2 border-l border-border/50">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-brand-foreground font-semibold">
              {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-foreground">
                {currentUser?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-muted-foreground">
                Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 