import { useId } from 'react';
import { Link } from 'react-router-dom';

interface BudgetpunkLogoProps {
  size?: number;
  className?: string;
  title?: string;
  to?: string; // Optional override for link destination
}

export function BudgetpunkLogo({
  size = 28,
  className,
  title = 'Budgetpunk',
  to = '/',
}: BudgetpunkLogoProps) {
  const id = useId();
  const gradientId = `brand-${id}`;
  const visorId = `brand-visor-${id}`;

  // Wrap the SVG in a Link to the landing page ("/")
  return (
    <Link to={to} aria-label={title} tabIndex={0} className={className} style={{ display: 'inline-block', lineHeight: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(var(--brand))`} />
            <stop offset="100%" stopColor={`hsl(var(--brand-foreground-glow))`} />
          </linearGradient>
          <linearGradient id={visorId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`hsl(var(--brand-foreground-glow))`} stopOpacity={0.85} />
            <stop offset="100%" stopColor={`hsl(var(--brand))`} stopOpacity={0.85} />
          </linearGradient>
        </defs>

        {/* Head outline */}
        <path
          d="M 60 25 Q 80 25 85 40 L 85 65 Q 85 85 60 90 Q 35 85 35 65 L 35 40 Q 40 25 60 25"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={2}
        />
        {/* Inner head */}
        <path
          d="M 60 25 Q 80 25 85 40 L 85 65 Q 85 85 60 90 Q 35 85 35 65 L 35 40 Q 40 25 60 25"
          fill={`url(#${gradientId})`}
          opacity={0.1}
        />
        {/* Visor/Eyes */}
        <rect x={40} y={45} width={40} height={12} rx={6} fill={`url(#${visorId})`} />
        {/* Scan lines in visor */}
        <line x1={42} y1={51} x2={78} y2={51} stroke="#fff" strokeWidth={1} opacity={0.4}>
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </line>
        {/* Tech ears/nodes */}
        <circle cx={30} cy={55} r={4} fill={`url(#${gradientId})`} />
        <circle cx={90} cy={55} r={4} fill={`url(#${gradientId})`} />
        <line x1={34} y1={55} x2={40} y2={51} stroke={`url(#${gradientId})`} strokeWidth={1} />
        <line x1={86} y1={55} x2={80} y2={51} stroke={`url(#${gradientId})`} strokeWidth={1} />
        {/* Mouth/Speaker grille */}
        <line x1={50} y1={70} x2={70} y2={70} stroke={`url(#${gradientId})`} strokeWidth={2} strokeLinecap="round" />
        <line x1={48} y1={75} x2={72} y2={75} stroke={`url(#${gradientId})`} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        <line x1={52} y1={80} x2={68} y2={80} stroke={`url(#${gradientId})`} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
        {/* Tech mohawk/antenna */}
        <path d="M 50 25 L 50 15 M 60 25 L 60 10 M 70 25 L 70 15" stroke={`url(#${gradientId})`} strokeWidth={2} strokeLinecap="round" />
        <circle cx={60} cy={10} r={3} fill={`url(#${gradientId})`}>
          <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </Link>
  );
}

export default BudgetpunkLogo;
