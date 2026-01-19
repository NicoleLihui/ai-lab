"use client";

import * as React from "react";
import { MdCard, MdCardHeader, MdCardTitle, MdCardDescription, MdCardContent } from "./md-card";
import { MdBadge } from "./md-badge";
import { cn } from "@/lib/utils";

export interface CardInfoProps {
  data: any;
  onClick?: () => void;
  className?: string;
}

export function CardInfo({ data, onClick, className }: CardInfoProps) {
  return (
    <MdCard 
      className={cn("cursor-pointer hover:shadow-md transition-shadow", className)} 
      onClick={onClick}
    >
      <MdCardHeader>
        <MdCardTitle className="truncate">{data.name || data.modelName || data.taskName || '未知名称'}</MdCardTitle>
        <MdCardDescription className="truncate">
          {data.description || data.remarks || '暂无描述'}
        </MdCardDescription>
      </MdCardHeader>
      <MdCardContent>
        <div className="space-y-2">
          {data.version && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">版本:</span>
              <span className="text-sm">{data.version}</span>
            </div>
          )}
          {data.modelType && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">类型:</span>
              <span className="text-sm">{data.modelType}</span>
            </div>
          )}
          {data.statusName && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">状态:</span>
              <MdBadge variant={data.statusName === '启用' || data.statusName === '已完成' ? 'success' : 'danger'}>
                {data.statusName}
              </MdBadge>
            </div>
          )}
          {data.createTime && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">创建时间:</span>
              <span className="text-sm">{data.createTime}</span>
            </div>
          )}
          {data.orgName && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">组织:</span>
              <span className="text-sm">{data.orgName}</span>
            </div>
          )}
        </div>
      </MdCardContent>
    </MdCard>
  );
}