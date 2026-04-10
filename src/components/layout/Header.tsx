import { Bell, Moon, Sun, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/stores/useThemeStore';
import { useRecentTransactions, useSavings, useUpcomingBills } from '@/hooks/useApi';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'transaction' | 'achievement' | 'reminder';
}

// ─── Component ────────────────────────────────────────────────────────────────

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  // ── Search state ──────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{type: string; id: string; title: string; subtitle: string; href: string; keywords: string[]}[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // ── Notification state ────────────────────────────────────────────────────
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const notifContainerRef = useRef<HTMLDivElement>(null);

  // ── Real data from Firestore ──────────────────────────────────────────────
  const { data: recentTxs = [] } = useRecentTransactions();
  const { data: savingsGoals = [] } = useSavings();
  const { data: upcomingBills = [] } = useUpcomingBills();

  // ── Derive notifications from real data ───────────────────────────────────
  const notifications = useMemo<Notification[]>(() => {
    const items: Notification[] = [];

    // Last 3 transactions
    recentTxs.slice(0, 3).forEach((tx) => {
      items.push({
        id: `tx-${tx.id}`,
        title: tx.type === 'income' ? 'Income Received' : 'New Transaction',
        description: `${tx.description} — ${formatCurrency(tx.amount)}`,
        time: relativeTime(tx.date),
        type: 'transaction',
      });
    });

    // Savings milestones (25 / 50 / 75 / 100 %)
    savingsGoals.forEach((goal) => {
      if (goal.targetAmount <= 0) return;
      const pct = Math.floor((goal.currentAmount / goal.targetAmount) * 100);
      const milestone = [100, 75, 50, 25].find((m) => pct >= m);
      if (!milestone) return;
      items.push({
        id: `goal-${goal.id}`,
        title: pct >= 100 ? 'Savings Goal Completed!' : 'Savings Milestone Reached',
        description: `${goal.name} is ${pct}% complete`,
        time: relativeTime(goal.createdAt),
        type: 'achievement',
      });
    });

    // Bills due within 7 days
    upcomingBills
      .filter((b) => { const d = daysUntil(b.dueDate); return d >= 0 && d <= 7; })
      .forEach((b) => {
        const d = daysUntil(b.dueDate);
        items.push({
          id: `bill-${b.id}`,
          title: d === 0 ? 'Bill Due Today' : 'Bill Due Soon',
          description: `${b.name} — ${formatCurrency(b.amount)} due in ${d} day${d !== 1 ? 's' : ''}`,
          time: new Date(b.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          type: 'reminder',
        });
      });

    return items;
  }, [recentTxs, savingsGoals, upcomingBills]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds]
  );

  // ── Search ────────────────────────────────────────────────────────────────

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

  // All searchable items — pages always surface first
  const searchableItems = [
    { type: 'page', id: 'dashboard',    title: 'Dashboard',         subtitle: 'Overview of your finances',       href: '/dashboard',    keywords: ['home', 'overview', 'summary', 'balance', 'accounts'] },
    { type: 'page', id: 'transactions', title: 'Transactions',      subtitle: 'View all transactions',           href: '/transactions', keywords: ['payments', 'spending', 'history', 'expenses', 'income'] },
    { type: 'page', id: 'savings',      title: 'Savings Goals',     subtitle: 'Track your savings progress',     href: '/savings',      keywords: ['goals', 'fund', 'save', 'target', 'piggybank'] },
    { type: 'page', id: 'investments',  title: 'Investments',       subtitle: 'Portfolio & performance',         href: '/investments',  keywords: ['portfolio', 'stocks', 'assets', 'returns', 'market'] },
    { type: 'page', id: 'bills',        title: 'Bills',             subtitle: 'Upcoming bills & reminders',      href: '/bills',        keywords: ['payments', 'upcoming', 'reminders', 'subscriptions', 'utilities', 'internet', 'rent', 'due'] },
    { type: 'page', id: 'profile',      title: 'Profile',           subtitle: 'Account settings & preferences',  href: '/profile',      keywords: ['settings', 'account', 'personal', 'preferences', 'email', 'password'] },
  ];

  // Fuzzy search: every word must appear somewhere in the item
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) return [];
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return searchableItems
      .filter((item) => {
        const haystack = [item.title, item.subtitle, ...item.keywords].join(' ').toLowerCase();
        return words.every((word) => haystack.includes(word));
      })
      .slice(0, 8);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    const results = performSearch(searchTerm);
    setSearchResults(results);
    if (results.length === 1) handleSearchResultClick(results[0]);
  };

  const handleSearchResultClick = (result: { href: string }) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    navigate(result.href);
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      setSearchResults(performSearch(searchTerm));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, performSearch]);

  // ── Notifications ─────────────────────────────────────────────────────────

  const handleNotificationClick = (notification: Notification) => {
    setIsNotifOpen(false);
    setReadIds((prev) => new Set([...prev, notification.id]));
    switch (notification.type) {
      case 'transaction': navigate('/transactions'); break;
      case 'achievement':  navigate('/savings'); break;
      case 'reminder':     navigate('/bills'); break;
    }
  };

  const markAllAsRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  // ── Click-outside handler ─────────────────────────────────────────────────

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setTimeout(() => setIsSearchOpen(false), 100);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        {/* Search */}
        <div className="flex items-center flex-1 max-w-md pl-0">
          <div ref={searchContainerRef} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              ref={searchInputRef}
              placeholder="Search pages, bills, goals... (⌘K)"
              className="pl-10 pr-4 bg-background/50 border-border/50 focus-visible:bg-background"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setIsSearchOpen(true); }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) handleSearch();
                if (e.key === 'Escape') { setIsSearchOpen(false); setSearchTerm(''); }
              }}
            />

            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background dark:bg-card border border-border rounded-md shadow-lg z-[9999] max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    <div className="p-3 border-b text-xs text-muted-foreground font-medium">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    {searchResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="p-3 hover:bg-accent/50 cursor-pointer border-b last:border-b-0 transition-colors"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="font-medium text-sm text-foreground">{result.title}</div>
                        <div className="text-xs text-muted-foreground capitalize mt-0.5">
                          {result.type} · {result.subtitle}
                        </div>
                      </div>
                    ))}
                  </>
                ) : searchTerm.trim() ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No results for "{searchTerm}"
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground font-medium mb-2">Quick links</div>
                    <div className="space-y-1">
                      {[
                        { label: 'Transactions', href: '/transactions' },
                        { label: 'Bills', href: '/bills' },
                        { label: 'Savings Goals', href: '/savings' },
                      ].map((link) => (
                        <div
                          key={link.href}
                          className="p-2 hover:bg-accent/50 rounded cursor-pointer text-sm transition-colors"
                          onClick={() => { setIsSearchOpen(false); navigate(link.href); }}
                        >
                          {link.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-2">

          {/* Notifications */}
          <div ref={notifContainerRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative overflow-visible"
              onClick={() => setIsNotifOpen((prev) => !prev)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand border-2 border-background flex items-center justify-center pointer-events-none">
                  <span className="text-[8px] text-white font-bold leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>

            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-[9999] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      Nothing here yet — add a transaction, bill, or savings goal to get started.
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const isRead = readIds.has(notification.id);
                      return (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b last:border-b-0 hover:bg-accent/50 cursor-pointer transition-colors ${
                            !isRead ? 'bg-accent/20' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notification.description}</p>
                              <p className="text-xs text-muted-foreground/60 mt-1">{notification.time}</p>
                            </div>
                            {!isRead && (
                              <div className="w-2 h-2 bg-brand rounded-full mt-1 shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
