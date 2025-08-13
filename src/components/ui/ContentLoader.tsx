import { Skeleton } from '@/components/ui/skeleton';
import { CyberCard } from '@/components/ui/CyberCard';

interface ContentLoaderProps {
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingContent?: React.ReactNode;
}

export function ContentLoader({ 
  isLoading, 
  error, 
  onRetry, 
  children, 
  loadingContent 
}: ContentLoaderProps) {
  
  if (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Unable to load content</h3>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return loadingContent || <DefaultContentSkeleton />;
  }

  return <>{children}</>;
}

function DefaultContentSkeleton() {
  const glowColors = ['blue', 'green', 'pink'] as const;
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-9 w-48 cyber-pulse" />
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CyberCard 
              key={i} 
              glow={glowColors[i % 3]} 
              scanLines={i % 2 === 0}
              dataStream={i % 2 === 1}
              className="p-6"
            >
              <Skeleton className="h-4 w-24 mb-2 cyber-pulse" />
              <Skeleton className="h-8 w-20 mb-1 cyber-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              <Skeleton className="h-3 w-32 cyber-pulse" style={{ animationDelay: `${i * 150}ms` }} />
            </CyberCard>
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <CyberCard className="col-span-4 p-6" glow="blue" scanLines>
            <Skeleton className="h-6 w-40 mb-4 cyber-pulse" />
            <Skeleton className="h-[300px] w-full cyber-pulse" style={{ animationDelay: '200ms' }} />
          </CyberCard>
          
          <CyberCard className="col-span-3 p-6" glow="green" dataStream>
            <Skeleton className="h-6 w-32 mb-2 cyber-pulse" />
            <Skeleton className="h-4 w-48 mb-4 cyber-pulse" style={{ animationDelay: '100ms' }} />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full cyber-pulse" style={{ animationDelay: `${i * 50}ms` }} />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full cyber-pulse" style={{ animationDelay: `${i * 75}ms` }} />
                    <Skeleton className="h-3 w-3/4 cyber-pulse" style={{ animationDelay: `${i * 125}ms` }} />
                  </div>
                  <Skeleton className="h-4 w-16 cyber-pulse" style={{ animationDelay: `${i * 175}ms` }} />
                </div>
              ))}
            </div>
          </CyberCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <CyberCard className="col-span-4 p-6" glow="pink" animatedBorder>
            <Skeleton className="h-6 w-36 mb-2 cyber-pulse" />
            <Skeleton className="h-4 w-56 mb-4 cyber-pulse" style={{ animationDelay: '150ms' }} />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-9 w-9 rounded-full cyber-pulse" style={{ animationDelay: `${i * 40}ms` }} />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32 cyber-pulse" style={{ animationDelay: `${i * 60}ms` }} />
                      <Skeleton className="h-3 w-20 cyber-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16 cyber-pulse" style={{ animationDelay: `${i * 120}ms` }} />
                </div>
              ))}
            </div>
          </CyberCard>
          
          <CyberCard className="col-span-3 p-6" glow="blue" scanLines animatedBorder>
            <Skeleton className="h-6 w-32 mb-2 cyber-pulse" />
            <Skeleton className="h-4 w-40 mb-4 cyber-pulse" style={{ animationDelay: '100ms' }} />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full cyber-pulse" style={{ animationDelay: `${i * 30}ms` }} />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-full cyber-pulse" style={{ animationDelay: `${i * 50}ms` }} />
                    <Skeleton className="h-3 w-2/3 cyber-pulse" style={{ animationDelay: `${i * 70}ms` }} />
                  </div>
                  <Skeleton className="h-4 w-12 cyber-pulse" style={{ animationDelay: `${i * 90}ms` }} />
                </div>
              ))}
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
}