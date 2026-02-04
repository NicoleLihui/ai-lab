'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { MdCheckbox } from './md-checkbox';
import { cn } from '@/lib/utils';

// 组织树节点接口
export interface OrgTreeNode {
  id: string;
  name: string;
  children?: OrgTreeNode[];
}

interface OrganizationTreeProps {
  data: OrgTreeNode[];
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  defaultExpanded?: boolean;
  readonly?: boolean; // 只读模式，不显示复选框，只显示已选中的节点
  className?: string;
}

export const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  data,
  selectedIds = [],
  onSelectionChange,
  defaultExpanded = false,
  readonly = false,
  className
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set(selectedIds));

  // 同步外部传入的选中状态
  useEffect(() => {
    setCheckedKeys(new Set(selectedIds));
  }, [selectedIds]);

  // 初始化展开状态
  useEffect(() => {
    if (defaultExpanded) {
      const allKeys = new Set<string>();
      const collectKeys = (nodes: OrgTreeNode[]) => {
        nodes.forEach(node => {
          if (node.children && node.children.length > 0) {
            allKeys.add(node.id);
            collectKeys(node.children);
          }
        });
      };
      collectKeys(data);
      setExpandedKeys(allKeys);
    }
  }, [data, defaultExpanded]);

  // 切换节点展开/收起
  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // 处理节点选中
  const handleCheck = (nodeId: string, checked: boolean) => {
    const newCheckedKeys = new Set(checkedKeys);
    
    if (checked) {
      newCheckedKeys.add(nodeId);
      // 选中父节点时，自动选中所有子节点
      const addChildren = (nodes: OrgTreeNode[]) => {
        nodes.forEach(node => {
          if (node.id === nodeId || isDescendant(node, nodeId)) {
            newCheckedKeys.add(node.id);
            if (node.children) {
              addChildren(node.children);
            }
          }
        });
      };
      addChildren(data);
    } else {
      newCheckedKeys.delete(nodeId);
      // 取消选中时，取消所有子节点
      const removeChildren = (nodes: OrgTreeNode[]) => {
        nodes.forEach(node => {
          if (node.id === nodeId || isDescendant(node, nodeId)) {
            newCheckedKeys.delete(node.id);
            if (node.children) {
              removeChildren(node.children);
            }
          }
        });
      };
      removeChildren(data);
    }
    
    setCheckedKeys(newCheckedKeys);
    onSelectionChange?.(Array.from(newCheckedKeys));
  };

  // 检查节点是否是某个ID的后代
  const isDescendant = (node: OrgTreeNode, ancestorId: string): boolean => {
    if (!node.children) return false;
    if (node.children.some(child => child.id === ancestorId)) return true;
    return node.children.some(child => isDescendant(child, ancestorId));
  };

  // 检查节点或其子节点是否被选中（用于只读模式过滤）
  const hasSelectedDescendant = (node: OrgTreeNode): boolean => {
    if (checkedKeys.has(node.id)) return true;
    if (node.children) {
      return node.children.some(child => hasSelectedDescendant(child));
    }
    return false;
  };

  // 过滤树节点，只保留已选中的节点及其父节点（只读模式）
  const filterTreeNodes = (nodes: OrgTreeNode[]): OrgTreeNode[] => {
    if (!readonly) return nodes;
    
    return nodes
      .filter(node => hasSelectedDescendant(node))
      .map(node => {
        if (node.children) {
          const filteredChildren = filterTreeNodes(node.children);
          return {
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : undefined
          };
        }
        return node;
      });
  };

  // 渲染树节点
  const renderTreeNode = (node: OrgTreeNode, level = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedKeys.has(node.id);
    const isChecked = checkedKeys.has(node.id);

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded transition-colors",
            !readonly && "cursor-pointer hover:bg-muted/50",
            level > 0 && "ml-4"
          )}
          onClick={(e) => {
            if (!readonly && !hasChildren) {
              handleCheck(node.id, !isChecked);
            }
          }}
        >
          {hasChildren ? (
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform shrink-0",
                  !readonly && "cursor-pointer",
                  isExpanded && "rotate-90"
                )}
                onClick={(e) => {
                  if (!readonly) {
                    toggleExpand(node.id, e);
                  }
                }}
              />
          ) : (
            <div className="w-4" />
          )}
          {!readonly && (
            <MdCheckbox
              checked={isChecked}
              onChange={(checked) => handleCheck(node.id, checked)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <span className="text-sm flex-1">{node.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 border-l border-border/50 pl-2">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 在只读模式下，过滤树节点
  const displayData = readonly ? filterTreeNodes(data) : data;

  return (
    <div className={cn("space-y-1", className)}>
      {displayData.map(node => renderTreeNode(node))}
    </div>
  );
};
