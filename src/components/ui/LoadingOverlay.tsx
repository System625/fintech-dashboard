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
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--brand)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--brand)) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'slideGrid 10s linear infinite',
          }}
        />
      </div>

      <div className="relative flex flex-col items-center w-full px-4">
        {/* Cyber Buddy Face (brand-colored) */}
        <svg width="200" height="200" viewBox="0 0 120 120" className="animate-pulse block mx-auto">
          <defs>
            <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220, 89%, 51%)" stopOpacity="1">
                <animate
                  attributeName="stop-color"
                  values="hsl(220, 89%, 51%);hsl(285, 85%, 58%);hsl(190, 84%, 70%);hsl(220, 89%, 51%)"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="hsl(285, 85%, 58%)" stopOpacity="1">
                <animate
                  attributeName="stop-color"
                  values="hsl(285, 85%, 58%);hsl(190, 84%, 70%);hsl(220, 89%, 51%);hsl(285, 85%, 58%)"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          <path
            d="M 60 25 Q 80 25 85 40 L 85 65 Q 85 85 60 90 Q 35 85 35 65 L 35 40 Q 40 25 60 25"
            fill="none"
            stroke="url(#cyberGrad)"
            strokeWidth="2"
          />
          <path
            d="M 60 25 Q 80 25 85 40 L 85 65 Q 85 85 60 90 Q 35 85 35 65 L 35 40 Q 40 25 60 25"
            fill="url(#cyberGrad)"
            opacity="0.08"
          />

          <rect x="40" y="45" width="40" height="12" rx="6" fill="url(#cyberGrad)" opacity="0.9">
            <animate attributeName="width" values="40;35;40" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="x" values="40;42.5;40" dur="1.5s" repeatCount="indefinite" />
          </rect>

          <circle cx="30" cy="55" r="4" fill="url(#cyberGrad)">
            <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="90" cy="55" r="4" fill="url(#cyberGrad)">
            <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" begin="0.5s" />
          </circle>

          <line
            x1="50"
            y1="70"
            x2="70"
            y2="70"
            stroke="url(#cyberGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          >
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
          </line>
          <line
            x1="48"
            y1="75"
            x2="72"
            y2="75"
            stroke="url(#cyberGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur="2s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </line>
          <line
            x1="52"
            y1="80"
            x2="68"
            y2="80"
            stroke="url(#cyberGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          >
            <animate
              attributeName="opacity"
              values="0.4;0.1;0.4"
              dur="2s"
              repeatCount="indefinite"
              begin="0.6s"
            />
          </line>
        </svg>

        <div className="mt-8 w-full flex justify-center">
          <div className="inline-flex items-baseline text-brand text-xl font-mono tracking-wider">
            <span>{message}</span>
            <span className="w-[0.5em] inline-block animate-pulse">.</span>
            <span className="w-[0.5em] inline-block animate-pulse delay-200">.</span>
            <span className="w-[0.5em] inline-block animate-pulse delay-500">.</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LoadingOverlay;


