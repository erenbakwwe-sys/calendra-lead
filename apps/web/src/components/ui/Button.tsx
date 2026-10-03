import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold-outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold transition-all duration-200 select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 disabled:pointer-events-none disabled:opacity-50",
          {
            "gold-button-gradient text-dark-950": variant === "primary",
            "bg-dark-850 hover:bg-dark-800 text-gray-200 border border-dark-border hover:border-gold-500/30 shadow-sm": variant === "secondary",
            "border border-gold-500/50 bg-gold-500/10 text-gold-300 hover:bg-gold-500/20 hover:border-gold-400": variant === "gold-outline",
            "bg-red-600/90 text-white hover:bg-red-600 shadow-md shadow-red-600/20": variant === "danger",
            "text-gray-400 hover:text-gold-400 hover:bg-dark-800/80": variant === "ghost",
            "h-8 px-3 text-[11px]": size === "sm",
            "h-10 px-4 py-2 text-xs": size === "md",
            "h-12 px-6 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
