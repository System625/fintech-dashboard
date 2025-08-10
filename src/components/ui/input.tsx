import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-all duration-[var(--motion-duration-micro)] ease-[var(--motion-ease-out)] outline-none",
        
        // Typography and selection
        "placeholder:text-muted-foreground selection:bg-brand selection:text-brand-foreground font-medium",
        
        // File input styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        
        // Focus states with new focus-ring token
        "focus-visible:border-brand focus-visible:ring-focus-ring focus-visible:ring-[3px] focus-visible:shadow-sm",
        
        // Hover state
        "hover:border-border/80 hover:shadow-sm",
        
        // Error states
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/30",
        
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        
        // Dark mode enhancements
        "dark:border-input dark:bg-background/50",
        
        className
      )}
      {...props}
    />
  )
}

export { Input }
