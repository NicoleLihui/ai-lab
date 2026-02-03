"use client";

import React from "react";
import { MdDrawer, MdBadge } from "@/components/enterprise-ui";
import type { SensitiveDataRule } from "./types";

export interface SensitiveDataDetailModalProps {
  open: boolean;
  onClose: () => void;
  rule: SensitiveDataRule | null;
}

export function SensitiveDataDetailModal({ open, onClose, rule }: SensitiveDataDetailModalProps) {
  if (!rule) return null;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "规则编码", value: rule.ruleCode },
    { label: "规则名称", value: rule.ruleName },
    { label: "敏感数据类型", value: <MdBadge variant="secondary">{rule.dataType}</MdBadge> },
    { label: "敏感级别", value: <MdBadge variant={rule.sensitiveLevel === "高" ? "danger" : rule.sensitiveLevel === "中" ? "warning" : "outline"}>{rule.sensitiveLevel}</MdBadge> },
    { label: "匹配模式", value: <code className="text-xs bg-slate-100 px-2 py-1 rounded break-all">{rule.matchPattern}</code> },
    { label: "脱敏算法", value: rule.maskAlgorithm },
    { label: "数据来源", value: rule.dataSource || "-" },
    { label: "状态", value: <MdBadge variant={rule.status === "启用" ? "success" : "danger"}>{rule.status}</MdBadge> },
    { label: "创建人", value: rule.creator },
    { label: "创建时间", value: rule.createTime },
    { label: "更新时间", value: rule.updateTime }
  ];

  return (
    <MdDrawer open={open} onClose={onClose} title="敏感数据规则详情" width={520}>
      <div className="p-6 space-y-4">
        {rule.description && (
          <div>
            <div className="text-sm font-medium text-slate-700 mb-1">规则描述</div>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-md p-3">{rule.description}</p>
          </div>
        )}
        <div className="space-y-3">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-sm text-slate-500 w-28 flex-shrink-0">{label}</span>
              <span className="text-sm text-slate-900 flex-1">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </MdDrawer>
  );
}
