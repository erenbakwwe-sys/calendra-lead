import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-300">
              {label}
            </label>
            {hint && <span className="text-[10px] text-gray-500">{hint}</span>}
          </div>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-dark-border bg-dark-900/90 px-3.5 py-2 text-xs text-gray-100 placeholder:text-gray-500/80 transition-all duration-200",
              "hover:border-gray-700",
              "focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 shadow-inner",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[11px] font-medium text-red-400 mt-1 flex items-center gap-1">
            <span>•</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
