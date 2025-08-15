import { createPortal } from 'react-dom';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

function LoadingOverlay({ visible, message = 'Loading' }: LoadingOverlayProps) {
  if (!visible) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[1000] bg-background/95 backdrop-blur-sm flex items-center justify-center overflow-hidden"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--brand)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--brand)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: 'slideGrid 8s linear infinite',
          }}
        />
      </div>

      <div className="relative flex flex-col items-center w-full px-4">
        {/* Global Cyber Buddy Face - exact copy from ContentAreaLoader but larger */}
        <svg width="160" height="160" viewBox="0 0 120 120" className="animate-pulse block mx-auto">
          <defs>
            <linearGradient id="globalCyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220, 89%, 51%)" stopOpacity="0.8">
                <animate
                  attributeName="stop-color"
                  values="hsl(220, 89%, 51%);hsl(285, 85%, 58%);hsl(190, 84%, 70%);hsl(220, 89%, 51%)"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="hsl(285, 85%, 58%)" stopOpacity="0.8">
                <animate
                  attributeName="stop-color"
                  values="hsl(285, 85%, 58%);hsl(190, 84%, 70%);hsl(220, 89%, 51%);hsl(285, 85%, 58%)"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          <path
            d="M 60 35 Q 75 35 80 45 L 80 65 Q 80 80 60 85 Q 40 80 40 65 L 40 45 Q 45 35 60 35"
            fill="none"
            stroke="url(#globalCyberGrad)"
            strokeWidth="2"
          />
          <path
            d="M 60 35 Q 75 35 80 45 L 80 65 Q 80 80 60 85 Q 40 80 40 65 L 40 45 Q 45 35 60 35"
            fill="url(#globalCyberGrad)"
            opacity="0.05"
          />

          <rect x="45" y="50" width="30" height="8" rx="4" fill="url(#globalCyberGrad)" opacity="0.9">
            <animate attributeName="width" values="30;25;30" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="x" values="45;47.5;45" dur="1.2s" repeatCount="indefinite" />
          </rect>

          <circle cx="35" cy="58" r="3" fill="url(#globalCyberGrad)">
            <animate attributeName="r" values="3;4;3" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="58" r="3" fill="url(#globalCyberGrad)">
            <animate attributeName="r" values="3;4;3" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
          </circle>

          <line
            x1="52"
            y1="70"
            x2="68"
            y2="70"
            stroke="url(#globalCyberGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          >
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
          </line>
        </svg>

        <div className="mt-6 w-full flex justify-center">
          <div className="inline-flex items-baseline text-brand text-xl font-mono tracking-wider">
            <span>{message}</span>
            <span className="w-[0.4em] inline-block animate-pulse">.</span>
            <span className="w-[0.4em] inline-block animate-pulse delay-200">.</span>
            <span className="w-[0.4em] inline-block animate-pulse delay-500">.</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LoadingOverlay;


