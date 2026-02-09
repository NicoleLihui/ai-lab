'use client';

import React, { useState } from 'react';
import { MdButton } from './md-button';
import { cn } from '@/lib/utils';

export interface TreeNodeProps {
  node: any;
  label: string;
  icon?: string;
  expanded?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  selected?: boolean;
  children?: React.ReactNode;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  label, 
  icon, 
  expanded, 
  onToggle, 
  onSelect, 
  selected = false, 
  children 
}) => {
  return (
    <div className="mb-1">
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100",
          selected && "bg-blue-100 border border-blue-300"
        )}
        onClick={onSelect}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span className="flex-1 truncate">{label}</span>
        {onToggle && (
          <MdButton
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="ml-2"
          >
            {expanded ? '▼' : '►'}
          </MdButton>
        )}
      </div>
      {children && expanded && (
        <div className="ml-4 border-l border-gray-200 pl-2 pt-1">
          {children}
        </div>
      )}
    </div>
  );
};

export interface TreeViewProps {
  data: any[];
  renderItem?: (node: any) => React.ReactNode;
  className?: string;
}

export const TreeView: React.FC<TreeViewProps> = ({ 
  data, 
  renderItem, 
  className 
}) => {
  const renderTreeNodes = (nodes: any[]) => {
    return nodes.map((node, index) => (
      <TreeNode
        key={node.id || index}
        node={node}
        label={node.name || `Node ${index}`}
        icon={node.icon}
        expanded={node.expanded}
        onToggle={node.onToggle}
        onSelect={node.onSelect}
        selected={node.selected}
      >
        {node.children && node.children.length > 0 && (
          <div className="ml-4 border-l border-gray-200 pl-2 pt-1">
            {renderTreeNodes(node.children)}
          </div>
        )}
      </TreeNode>
    ));
  };

  return (
    <div className={className}>
      {renderTreeNodes(data)}
    </div>
  );
};