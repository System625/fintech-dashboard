import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  PiggyBank,
  ListOrdered,
  X,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type Step = 'welcome' | 'account' | 'transaction' | 'goal';

const STEPS: Step[] = ['welcome', 'account', 'transaction', 'goal'];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const userName = currentUser?.email?.split('@')[0] || 'punk';

  // Form state for each step
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings' | 'investment'>('checking');
  const [txDescription, setTxDescription] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const goTo = (step: Step, dir: 'forward' | 'back' = 'forward') => {
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsAnimating(false);
    }, 150);
  };

  const next = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      goTo(STEPS[nextIndex], 'forward');
    } else {
      onComplete();
    }
  };

  const prev = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      goTo(STEPS[prevIndex], 'back');
    }
  };

  const skip = () => onComplete();

  const handleFinish = () => {
    onComplete();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--brand)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--brand)) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Top bar: progress + skip */}
      <div className="relative flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex-1 max-w-xs">
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500 ease-[var(--motion-ease-spring)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">
            {stepIndex + 1}/{STEPS.length}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={skip}
          className="text-muted-foreground hover:text-foreground text-xs gap-1"
        >
          Skip setup
          <X size={14} />
        </Button>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
        <div
          className={cn(
            "w-full max-w-md transition-all duration-200 ease-[var(--motion-ease-out)]",
            isAnimating && direction === 'forward' && "opacity-0 translate-x-8",
            isAnimating && direction === 'back' && "opacity-0 -translate-x-8",
            !isAnimating && "opacity-100 translate-x-0"
          )}
        >
          {/* WELCOME */}
          {currentStep === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand/10 border border-brand/20 mb-2">
                <Sparkles size={36} className="text-brand drop-shadow-[0_0_8px_hsl(var(--brand)/0.5)]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Welcome, <span className="text-brand">{userName}</span>
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Let's set up your financial dashboard in under a minute. You can always change these later.
                </p>
              </div>
              <Button
                size="lg"
                onClick={next}
                className="bg-brand hover:bg-brand/90 text-white gap-2 w-full max-w-xs mx-auto h-12 text-base"
              >
                Let's go
                <ArrowRight size={18} />
              </Button>
            </div>
          )}

          {/* STEP 1: Account */}
          {currentStep === 'account' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <Wallet size={20} className="text-brand" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Name your account</h2>
                  <p className="text-sm text-muted-foreground">Where does your money live?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="cyber-label block mb-2">Account Name</label>
                  <Input
                    placeholder="e.g. Main Checking, Cash Stash"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="cyber-label block mb-2">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['checking', 'savings', 'investment'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setAccountType(type)}
                        className={cn(
                          "h-11 rounded-lg border text-sm font-medium capitalize transition-all duration-150",
                          accountType === type
                            ? "border-brand bg-brand/10 text-brand shadow-[0_0_8px_hsl(var(--brand)/0.15)]"
                            : "border-border/50 text-muted-foreground hover:border-brand/30 hover:text-foreground"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Transaction */}
          {currentStep === 'transaction' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <ListOrdered size={20} className="text-brand" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Add a transaction</h2>
                  <p className="text-sm text-muted-foreground">Record your first spend or earning</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="cyber-label block mb-2">Description</label>
                  <Input
                    placeholder="e.g. Coffee, Salary, Groceries"
                    value={txDescription}
                    onChange={(e) => setTxDescription(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="cyber-label block mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="h-12 pl-8 font-mono tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Savings Goal */}
          {currentStep === 'goal' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <PiggyBank size={20} className="text-brand" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Set a savings goal</h2>
                  <p className="text-sm text-muted-foreground">What are you saving toward?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="cyber-label block mb-2">Goal Name</label>
                  <Input
                    placeholder="e.g. Emergency Fund, Vacation, New Laptop"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="cyber-label block mb-2">Target Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                    <Input
                      type="number"
                      placeholder="10,000"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      className="h-12 pl-8 font-mono tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav buttons */}
      <div className="relative px-6 py-6 shrink-0">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {stepIndex > 0 ? (
            <Button variant="ghost" onClick={prev} className="gap-1.5 text-muted-foreground">
              <ArrowLeft size={16} />
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep !== 'welcome' && (
            <div className="flex items-center gap-2">
              {currentStep !== 'goal' ? (
                <>
                  <Button variant="ghost" onClick={next} className="text-muted-foreground text-sm">
                    Skip this step
                  </Button>
                  <Button
                    onClick={next}
                    className="bg-brand hover:bg-brand/90 text-white gap-1.5 h-11 px-6"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleFinish}
                  className="bg-brand hover:bg-brand/90 text-white gap-1.5 h-11 px-6"
                >
                  <Check size={16} />
                  Finish Setup
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
