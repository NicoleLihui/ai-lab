'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface MdTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
}

export function MdTooltip({
  content,
  children,
  placement = 'top',
  delay = 200,
  disabled = false,
}: MdTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
        
        let top = 0;
        let left = 0;
        
        switch (placement) {
          case 'top':
            top = rect.top - tooltipRect.height - 8;
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 8;
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
            left = rect.left - tooltipRect.width - 8;
            break;
          case 'right':
            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
            left = rect.right + 8;
            break;
        }
        
        // 边界检查，确保tooltip不会超出视口
        const padding = 8;
        if (top < padding) top = padding;
        if (left < padding) left = padding;
        if (top + tooltipRect.height > window.innerHeight - padding) {
          top = window.innerHeight - tooltipRect.height - padding;
        }
        if (left + tooltipRect.width > window.innerWidth - padding) {
          left = window.innerWidth - tooltipRect.width - padding;
        }
        
        setPosition({ top, left });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 更新位置
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (placement) {
        case 'top':
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + 8;
          break;
      }
      
      const padding = 8;
      if (top < padding) top = padding;
      if (left < padding) left = padding;
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding;
      }
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      
      setPosition({ top, left });
    }
  }, [isVisible, placement]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-9999 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg pointer-events-none animate-in fade-in-0 zoom-in-95 max-w-xs"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {content}
            {placement === 'top' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900" />
            )}
            {placement === 'bottom' && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-b-gray-900" />
            )}
            {placement === 'left' && (
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-0 h-0 border-4 border-transparent border-l-gray-900" />
            )}
            {placement === 'right' && (
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-0 h-0 border-4 border-transparent border-r-gray-900" />
            )}
          </div>,
          document.body
        )}
    </>
  );
}
