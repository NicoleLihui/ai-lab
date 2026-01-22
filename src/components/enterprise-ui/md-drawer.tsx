'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { MdButton } from './md-button';
import { cn } from '@/lib/utils';

export interface MdDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  width?: string | number;
  className?: string;
  closeOnOverlayClick?: boolean;
}

export const MdDrawer: React.FC<MdDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 'auto',
  className,
  closeOnOverlayClick = true,
}) => {
  // 阻止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC 键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* 抽屉 */}
      <div
        className={cn(
          "relative ml-auto h-full bg-card border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-out",
          className
        )}
        style={{
          width: widthStyle === 'auto' ? 'auto' : widthStyle,
          minWidth: widthStyle === 'auto' ? '400px' : undefined,
          maxWidth: widthStyle === 'auto' ? '90vw' : undefined,
        }}
      >
        {/* 头部 */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-none">
            <div className="text-lg font-semibold text-foreground">{title}</div>
            <MdButton variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </MdButton>
          </div>
        )}
        
        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
