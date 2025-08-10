import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tileVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)] hover:shadow-md",
  {
    variants: {
      variant: {
        default: "shadow-sm border-border/50 hover:border-border",
        emphasis: "shadow-sm border-border/50 hover:border-border relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-brand before:rounded-t-xl",
        metric: "shadow-sm border-border/50 hover:border-border hover:scale-[1.01] active:scale-[0.99]",
        glass: "backdrop-blur-md bg-card/80 border-border/30 shadow-lg",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        metric: "p-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Tile({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof tileVariants>) {
  return (
    <div
      data-slot="tile"
      className={cn(tileVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function TileHeader({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tile-header"
      className={cn(
        "flex flex-col space-y-2 pb-4 border-b border-border/50 mb-4 last:border-0 last:pb-0 last:mb-0",
        className
      )}
      {...props}
    />
  )
}

function TileTitle({ 
  className, 
  ...props 
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="tile-title"
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function TileDescription({ 
  className, 
  ...props 
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="tile-description"
      className={cn(
        "text-sm text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function TileContent({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tile-content"
      className={cn("space-y-4", className)}
      {...props}
    />
  )
}

function TileFooter({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tile-footer"
      className={cn(
        "flex items-center justify-between pt-4 border-t border-border/50 mt-4 first:border-0 first:pt-0 first:mt-0",
        className
      )}
      {...props}
    />
  )
}

function TileMetric({ 
  className,
  value,
  label,
  change,
  trend = "neutral",
  sparkline,
  ...props
}: React.ComponentProps<"div"> & {
  value: string | number
  label: string
  change?: string | number
  trend?: "up" | "down" | "neutral"
  sparkline?: React.ReactNode
}) {
  return (
    <Tile variant="metric" className={cn("space-y-3", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
          {change && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trend === "up" && "text-green-600 dark:text-green-400",
              trend === "down" && "text-red-600 dark:text-red-400",
              trend === "neutral" && "text-muted-foreground"
            )}>
              {trend === "up" && "↗"}
              {trend === "down" && "↘"}
              {change}
            </div>
          )}
        </div>
        {sparkline && (
          <div className="h-12 w-20 flex items-center justify-end">
            {sparkline}
          </div>
        )}
      </div>
    </Tile>
  )
}

export {
  Tile,
  TileHeader,
  TileTitle,
  TileDescription,
  TileContent,
  TileFooter,
  TileMetric,
  tileVariants,
}