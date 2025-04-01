import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, BarChart3, PiggyBank, LineChart, ShieldCheck, Clock, CreditCard, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  // Handle auth navigation
  const handleAuthNavigation = (path: string) => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container max-w-screen-xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-semibold">FinDash</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="#products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </Link>
          </nav>
          
          {/* Desktop Login/SignUp Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {currentUser ? (
              <Button onClick={() => navigate('/dashboard')} size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="ghost" size="sm">
                  Login
                </Button>
                <Button onClick={() => navigate('/signup')} size="sm">
                  Sign Up
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <nav className="flex flex-col gap-2">
                  <Link 
                    to="#features" 
                    className="text-sm font-medium p-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    to="#products" 
                    className="text-sm font-medium p-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link 
                    to="#" 
                    className="text-sm font-medium p-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="#" 
                    className="text-sm font-medium p-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Resources
                  </Link>
                </nav>
                <div className="flex flex-col gap-2 mt-4">
                  {currentUser ? (
                    <Button 
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }} 
                      className="w-full"
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={() => {
                          navigate('/login');
                          setIsMenuOpen(false);
                        }} 
                        variant="outline" 
                        className="w-full"
                      >
                        Login
                      </Button>
                      <Button 
                        onClick={() => {
                          navigate('/signup');
                          setIsMenuOpen(false);
                        }} 
                        className="w-full"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <motion.div 
              className="flex flex-col justify-center space-y-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Smart Money Management for Your Future
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Simplify your financial journey with our all-in-one platform for savings, investments, and tracking your money.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button onClick={() => handleAuthNavigation('/signup')} size="lg" className="text-primary-foreground">
                  {currentUser ? 'Go to Dashboard' : 'Get Started'} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                {!currentUser && (
                  <Button onClick={() => navigate('/login')} variant="outline" size="lg">
                    Log In
                  </Button>
                )}
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="w-full max-w-md border-2 border-primary/20 shadow-xl">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-center text-2xl">Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <h3 className="text-3xl font-bold">$24,850.00</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Savings</p>
                      <p className="text-xl font-semibold">$12,500.00</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Investments</p>
                      <p className="text-xl font-semibold">$12,350.00</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%]"></div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">65% of yearly savings goal reached</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={1}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Everything you need to manage your finances in one place
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn} custom={1}>
              <Card className="h-full">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <PiggyBank className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Smart Savings</CardTitle>
                  <CardDescription>Create and track savings goals with automatic contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Set personalized savings goals and track your progress with visual indicators and milestone rewards.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} custom={2}>
              <Card className="h-full">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Investment Portfolio</CardTitle>
                  <CardDescription>Track performance and manage investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Monitor your investment portfolio with real-time data and insights to make informed financial decisions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} custom={3}>
              <Card className="h-full">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Financial Insights</CardTitle>
                  <CardDescription>Visualize spending patterns and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get detailed analytics on your spending habits and income sources with interactive charts and reports.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} custom={4}>
              <Card className="h-full">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Automated Tracking</CardTitle>
                  <CardDescription>Automatic categorization of transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Save time with intelligent transaction categorization and automatic spending reports.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} custom={5}>
              <Card className="h-full">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Budget Management</CardTitle>
                  <CardDescription>Create and manage monthly budgets</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Set budgets for different categories and receive alerts when you're approaching your limits.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} custom={6}>
              <Card className="h-full">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Secure & Private</CardTitle>
                  <CardDescription>Bank-level security for your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your financial data is protected with the latest encryption and security practices.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section id="products" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={1}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Experience the Platform</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                See how our platform helps you manage your finances
              </p>
            </div>
          </motion.div>

          <div className="mt-12">
            <Tabs defaultValue="savings" className="w-full">
              <div className="flex justify-center">
                <TabsList className="mb-8">
                  <TabsTrigger value="savings">Savings</TabsTrigger>
                  <TabsTrigger value="investments">Investments</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="savings" className="mt-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl"
                >
                  <div className="bg-card p-6">
                    <h3 className="text-2xl font-bold mb-6">Savings Goals Dashboard</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="bg-background/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Emergency Fund</CardTitle>
                          <CardDescription>$5,000 of $10,000</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-primary w-[50%]"></div>
                          </div>
                          <p className="text-sm text-muted-foreground">50% complete</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-background/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Vacation</CardTitle>
                          <CardDescription>$2,500 of $3,000</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-primary w-[83%]"></div>
                          </div>
                          <p className="text-sm text-muted-foreground">83% complete</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="investments" className="mt-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl"
                >
                  <div className="bg-card p-6">
                    <h3 className="text-2xl font-bold mb-6">Investment Portfolio</h3>
                    <div className="grid gap-6">
                      <div className="bg-background/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Portfolio Value: $12,350.00</h4>
                        <div className="h-16 bg-background rounded-md overflow-hidden">
                          {/* Simplified chart representation */}
                          <div className="h-full w-full flex items-end">
                            <div className="h-[30%] w-[10%] bg-primary"></div>
                            <div className="h-[50%] w-[10%] bg-primary"></div>
                            <div className="h-[60%] w-[10%] bg-primary"></div>
                            <div className="h-[40%] w-[10%] bg-primary"></div>
                            <div className="h-[70%] w-[10%] bg-primary"></div>
                            <div className="h-[65%] w-[10%] bg-primary"></div>
                            <div className="h-[80%] w-[10%] bg-primary"></div>
                            <div className="h-[90%] w-[10%] bg-primary"></div>
                            <div className="h-[85%] w-[10%] bg-primary"></div>
                            <div className="h-[95%] w-[10%] bg-primary"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Jan</span>
                          <span>Dec</span>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-background/50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Tech ETF</CardTitle>
                            <CardDescription>10.5 shares @ $105.80</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-lg font-bold text-green-500">+11.13%</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-background/50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">S&P 500 Index</CardTitle>
                            <CardDescription>5.2 shares @ $450.25</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-lg font-bold text-green-500">+8.45%</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="transactions" className="mt-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl"
                >
                  <div className="bg-card p-6">
                    <h3 className="text-2xl font-bold mb-6">Recent Transactions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Grocery Store</p>
                            <p className="text-sm text-muted-foreground">Oct 2, 2023</p>
                          </div>
                        </div>
                        <span className="text-red-500 font-medium">-$85.25</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Coffee Shop</p>
                            <p className="text-sm text-muted-foreground">Oct 1, 2023</p>
                          </div>
                        </div>
                        <span className="text-red-500 font-medium">-$4.50</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-500/10">
                            <ArrowRight className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium">Salary Deposit</p>
                            <p className="text-sm text-muted-foreground">Oct 1, 2023</p>
                          </div>
                        </div>
                        <span className="text-green-500 font-medium">+$3,500.00</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center space-y-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={1}
          >
            <div className="space-y-2">
              {currentUser ? (
                <>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Continue Managing Your Finances</h2>
                  <p className="max-w-[600px] md:text-xl/relaxed">
                    Return to your dashboard to track your financial progress
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Start Managing Your Finances Today</h2>
                  <p className="max-w-[600px] md:text-xl/relaxed">
                    Join thousands of users who are taking control of their financial future
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {currentUser ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  size="lg" 
                  variant="secondary"
                  className="font-medium"
                >
                  Go to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/signup')} 
                    size="lg" 
                    variant="secondary"
                    className="font-medium"
                  >
                    Create Account <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')} 
                    variant="outline" 
                    size="lg"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-background border-t">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Finance Dashboard</h3>
              <p className="text-sm text-muted-foreground">Smart financial management for everyone</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Testimonials</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Licenses</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-800 md:h-16 md:flex-row mt-8 pt-6">
            <p className="text-xs text-muted-foreground">© 2023 Finance Dashboard. All rights reserved.</p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link to="#" className="text-sm hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 