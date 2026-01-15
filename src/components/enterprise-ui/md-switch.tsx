"use client"
import { cn } from "@/lib/utils"

export interface MdSwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  color?: "primary" | "success" | "warning" | "danger"
  className?: string
}

export function MdSwitch({
  checked = false,
  onChange,
  label,
  disabled,
  size = "md",
  color = "primary",
  className,
}: MdSwitchProps) {
  const trackSizeClasses = {
    sm: "h-4 w-7",
    md: "h-5 w-9",
    lg: "h-6 w-11",
  }

  const thumbSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const translateClasses = {
    sm: "translate-x-3.5",
    md: "translate-x-4",
    lg: "translate-x-5",
  }

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  }

  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 cursor-pointer",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative inline-flex shrink-0 rounded-full transition-colors duration-200",
          trackSizeClasses[size],
          checked ? colorClasses[color] : "bg-input",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-md transition-transform duration-200",
            thumbSizeClasses[size],
            "translate-x-0.5 translate-y-0.5",
            checked && translateClasses[size],
          )}
        />
      </button>
      {label && (
        <span className={cn("text-sm", size === "sm" && "text-xs", size === "lg" && "text-base")}>{label}</span>
      )}
    </label>
  )
}
