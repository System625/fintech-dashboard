import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BudgetpunkLogo } from '@/components/logo/BudgetpunkLogo';
import { AnimatePresence, motion } from 'motion/react';

interface LandingNavProps {
  onGetStarted: () => void;
}

const LandingNav: React.FC<LandingNavProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Initialize with system preference synchronously to avoid flash
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    // Quick synchronous check - avoid flash
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Apply theme class immediately after mount (non-blocking)
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <header className="fixed md:sticky top-0 left-0 right-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <BudgetpunkLogo size={58} />
          <span className="text-xl font-bold text-foreground">Budgetpunk</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-sm font-medium hover:text-brand transition-colors">Features</a>
          <a href="#calculator" className="text-sm font-medium hover:text-brand transition-colors">Calculator</a>
          <a href="#pricing" className="text-sm font-medium hover:text-brand transition-colors">Pricing</a>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {currentUser ? (
            <Button onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={onGetStarted}>
                Get Started
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation with transition */}
      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.div
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md shadow-sm"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
         >
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <a href="#features" className="block text-sm font-medium hover:text-brand transition-colors">Features</a>
              <a href="#calculator" className="block text-sm font-medium hover:text-brand transition-colors">Calculator</a>
              <a href="#pricing" className="block text-sm font-medium hover:text-brand transition-colors">Pricing</a>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                {currentUser ? (
                  <Button onClick={() => navigate('/dashboard')} className="flex-1 ml-4 min-w-0">
                    Dashboard
                  </Button>
                ) : (
                  <div className="flex space-x-2 flex-1 ml-4 min-w-0">
                    <Button variant="outline" onClick={() => navigate('/login')} className="flex-1 min-w-0 text-sm">
                      Sign In
                    </Button>
                    <Button onClick={onGetStarted} className="flex-1 min-w-0 text-sm">
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingNav;