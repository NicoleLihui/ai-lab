"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { ChevronDown, Check, X } from "lucide-react"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MdSelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  helperText?: string
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  clearable?: boolean
  variant?: "outlined" | "filled" | "standard"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function MdSelect({
  options,
  value,
  onChange,
  placeholder = "请选择",
  label,
  helperText,
  error,
  errorMessage,
  disabled,
  clearable,
  variant = "outlined",
  size = "md",
  className,
}: MdSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [dropdownStyle, setDropdownStyle] = React.useState<{ top: number; left: number; minWidth: number } | null>(null)
  const selectRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  }

  const variantClasses = {
    outlined: "border-2 border-input rounded-md hover:border-primary/50",
    filled: "border-0 border-b-2 border-input bg-muted rounded-t-md rounded-b-none",
    standard: "border-0 border-b-2 border-input bg-transparent rounded-none",
  }

  React.useLayoutEffect(() => {
    if (isOpen && triggerRef.current && typeof document !== "undefined") {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
      })
    } else {
      setDropdownStyle(null)
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        selectRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return
      }
      setIsOpen(false)
      setIsFocused(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const dropdownContent =
    isOpen &&
    dropdownStyle &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        ref={dropdownRef}
        className="fixed z-9999 rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95"
        style={{
          top: dropdownStyle.top,
          left: dropdownStyle.left,
          minWidth: dropdownStyle.minWidth,
          maxHeight: 240,
        }}
      >
        <div className="max-h-60 overflow-auto py-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                onChange?.(option.value)
                setIsOpen(false)
              }}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2 text-sm transition-colors",
                "hover:bg-primary-light",
                option.value === value && "bg-primary-light text-primary",
                option.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {option.label}
              {option.value === value && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>,
      document.body
    )

  return (
    <div className={cn("w-full space-y-1.5", className)} ref={selectRef}>
      {label && (
        <label
          className={cn(
            "block text-sm font-medium transition-colors duration-200",
            isFocused ? "text-primary" : "text-foreground",
            error && "text-destructive",
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => {
            setIsOpen(!isOpen)
            setIsFocused(true)
          }}
          className={cn(
            "flex w-full items-center justify-between transition-all duration-200",
            sizeClasses[size],
            variantClasses[variant],
            isFocused && "border-primary",
            error && "border-destructive",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <span className={cn(!selectedOption && "text-muted-foreground")}>{selectedOption?.label || placeholder}</span>
          <div className="flex items-center gap-1">
            {clearable && value && (
              <X
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange?.("")
                }}
              />
            )}
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
          </div>
        </button>
        {dropdownContent}
      </div>
      {(helperText || errorMessage) && (
        <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
          {error ? errorMessage : helperText}
        </p>
      )}
    </div>
  )
}
