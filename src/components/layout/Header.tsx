import { Bell, Moon, Sun, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const Header = () => {
  const { currentUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{type: string; id: string; title: string; amount?: string; balance?: string; progress?: string; target?: string; date?: string}[]>([]);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Transaction',
      description: 'Grocery Store purchase of $125.75',
      time: '5 minutes ago',
      read: false,
      type: 'transaction'
    },
    {
      id: '2', 
      title: 'Savings Goal Reached',
      description: 'Emergency Fund goal 50% complete!',
      time: '2 hours ago',
      read: false,
      type: 'achievement'
    },
    {
      id: '3',
      title: 'Bill Reminder',
      description: 'Internet bill due in 3 days',
      time: '1 day ago',
      read: true,
      type: 'reminder'
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Global search keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Perform search across different data types
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) return [];

    const results: {type: string; id: string; title: string; amount?: string; balance?: string; progress?: string; target?: string; date?: string}[] = [];
    const lowerQuery = query.toLowerCase();

    // Mock search results - in real app, this would query your APIs
    const mockTransactions = [
      { type: 'transaction', id: 'tx-1', title: 'Grocery Store', amount: '$125.75', date: '2024-03-25' },
      { type: 'transaction', id: 'tx-2', title: 'Coffee Shop', amount: '$8.50', date: '2024-03-24' },
      { type: 'transaction', id: 'tx-3', title: 'Amazon Purchase', amount: '$45.99', date: '2024-03-23' },
    ];

    const mockAccounts = [
      { type: 'account', id: 'acc-1', title: 'Checking Account', balance: '$2,450.00' },
      { type: 'account', id: 'acc-2', title: 'Savings Account', balance: '$12,500.00' },
      { type: 'account', id: 'acc-3', title: 'Investment Account', balance: '$8,750.00' },
    ];

    const mockGoals = [
      { type: 'goal', id: 'goal-1', title: 'Emergency Fund', progress: '50%', target: '$10,000' },
      { type: 'goal', id: 'goal-2', title: 'Vacation Fund', progress: '75%', target: '$4,000' },
    ];

    // Search transactions
    mockTransactions.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
    });

    // Search accounts
    mockAccounts.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
    });

    // Search goals
    mockGoals.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
    });

    return results.slice(0, 8); // Limit results
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const results = performSearch(searchTerm);
    setSearchResults(results);
    
    // If single result, navigate directly
    if (results.length === 1) {
      handleSearchResultClick(results[0]);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (result: {type: string; id: string; title: string}) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    
    switch (result.type) {
      case 'transaction':
        navigate('/transactions');
        break;
      case 'account':
        navigate('/dashboard');
        break;
      case 'goal':
        navigate('/savings');
        break;
      default:
        break;
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: {type: string; id: string; read: boolean}) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'transaction':
        navigate('/transactions');
        break;
      case 'achievement':
        navigate('/savings');
        break;
      case 'reminder':
        navigate('/dashboard');
        break;
      default:
        break;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Update search results when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = performSearch(searchTerm);
      console.log('Search results for:', searchTerm, results); // Debug log
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, performSearch]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">        
        {/* Left side - Search */}
        <div className="flex items-center flex-1 max-w-md">
          <div ref={searchContainerRef} className="relative w-full data-stream">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search transactions, accounts... (⌘K)"
              className="pl-10 pr-4 bg-background/50 border-border/50 focus-visible:bg-background cyber-border"
              value={searchTerm}
              onChange={(e) => {
                console.log('Search term changed:', e.target.value);
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => {
                console.log('Search focused, setting isSearchOpen to true');
                setIsSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  handleSearch();
                }
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                  setSearchTerm('');
                }
              }}
            />
            
            {/* Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background dark:bg-card border border-border rounded-md shadow-lg z-[9999] max-h-96 overflow-y-auto">
                {/* Debug info */}
                <div className="p-2 text-xs text-muted-foreground border-b">
                  Debug: term="{searchTerm}", results={searchResults.length}, isOpen={String(isSearchOpen)}
                </div>
                {searchResults.length > 0 ? (
                  <>
                    <div className="p-3 border-b text-xs text-muted-foreground font-medium">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{result.title}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {result.type}
                              {result.amount && ` • ${result.amount}`}
                              {result.balance && ` • ${result.balance}`}
                              {result.progress && ` • ${result.progress} of ${result.target}`}
                            </div>
                          </div>
                          {result.date && (
                            <div className="text-xs text-muted-foreground">
                              {result.date}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : searchTerm.trim() ? (
                  <div className="p-4">
                    <div className="text-center text-muted-foreground text-sm mb-4">
                      No results found for "{searchTerm}"
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Try searching for: grocery, checking, emergency, coffee, savings, investment
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground font-medium mb-2">
                      Quick Actions
                    </div>
                    <div className="space-y-1">
                      <div className="p-2 hover:bg-accent rounded cursor-pointer text-sm" onClick={() => navigate('/transactions')}>
                        View All Transactions
                      </div>
                      <div className="p-2 hover:bg-accent rounded cursor-pointer text-sm" onClick={() => navigate('/savings')}>
                        Manage Savings Goals
                      </div>
                      <div className="p-2 hover:bg-accent rounded cursor-pointer text-sm" onClick={() => navigate('/investments')}>
                        Check Investments
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Right side - User actions */}
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand border-2 border-background flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-background dark:bg-card" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold">Notifications</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 hover:bg-accent/50 cursor-pointer ${
                        !notification.read ? 'bg-accent/20' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-brand rounded-full mt-1 ml-2"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
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