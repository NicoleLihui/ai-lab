"use client"
import { cn } from "@/lib/utils"
import { Check, Minus } from "lucide-react"

export interface MdCheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  color?: "primary" | "success" | "warning" | "danger"
  className?: string
}

export function MdCheckbox({
  checked = false,
  indeterminate = false,
  onChange,
  label,
  disabled,
  size = "md",
  color = "primary",
  className,
}: MdCheckboxProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  const colorClasses = {
    primary: "border-primary bg-primary",
    success: "border-success bg-success",
    warning: "border-warning bg-warning",
    danger: "border-destructive bg-destructive",
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
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative inline-flex items-center justify-center rounded border-2 transition-all duration-200",
          sizeClasses[size],
          checked || indeterminate
            ? cn(colorClasses[color], "text-white")
            : "border-input bg-transparent hover:border-primary/50",
        )}
      >
        {indeterminate ? (
          <Minus className={cn(iconSizeClasses[size], "text-white")} />
        ) : checked ? (
          <Check className={cn(iconSizeClasses[size], "text-white")} />
        ) : null}
      </button>
      {label && (
        <span className={cn("text-sm", size === "sm" && "text-xs", size === "lg" && "text-base")}>{label}</span>
      )}
    </label>
  )
}
