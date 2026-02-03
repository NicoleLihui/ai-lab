"use client";

import React, { useEffect, useState } from "react";
import { MdButton, MdDrawer, MdInput, MdSelect } from "@/components/enterprise-ui";
import type { SensitiveDataRule, SensitiveLevel, SensitiveDataType, MaskAlgorithm, SensitiveRuleStatus } from "./types";

const dataTypeOptions = [
  { value: "个人身份信息", label: "个人身份信息" },
  { value: "财务信息", label: "财务信息" },
  { value: "商业机密", label: "商业机密" },
  { value: "其他敏感信息", label: "其他敏感信息" }
];

const levelOptions = [
  { value: "高", label: "高" },
  { value: "中", label: "中" },
  { value: "低", label: "低" }
];

const maskAlgorithmOptions = [
  { value: "掩码", label: "掩码" },
  { value: "加密", label: "加密" },
  { value: "替换", label: "替换" },
  { value: "哈希", label: "哈希" }
];

const statusOptions = [
  { value: "启用", label: "启用" },
  { value: "停用", label: "停用" }
];

const dataSourceOptions = [
  { value: "数采", label: "数采" },
  { value: "基础数据", label: "基础数据" },
  { value: "工单数据", label: "工单数据" },
  { value: "经营", label: "经营" }
];

export interface SensitiveDataRuleDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Omit<SensitiveDataRule, "id" | "creator" | "createTime" | "updateTime">) => void;
  editingRule: SensitiveDataRule | null;
  submitting?: boolean;
}

const defaultForm = {
  ruleCode: "",
  ruleName: "",
  dataType: "个人身份信息" as SensitiveDataType,
  sensitiveLevel: "中" as SensitiveLevel,
  matchPattern: "",
  maskAlgorithm: "掩码" as MaskAlgorithm,
  dataSource: "",
  description: "",
  status: "启用" as SensitiveRuleStatus
};

export function SensitiveDataRuleDrawer({
  open,
  onClose,
  onSubmit,
  editingRule,
  submitting = false
}: SensitiveDataRuleDrawerProps) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (editingRule) {
        setForm({
          ruleCode: editingRule.ruleCode,
          ruleName: editingRule.ruleName,
          dataType: editingRule.dataType,
          sensitiveLevel: editingRule.sensitiveLevel,
          matchPattern: editingRule.matchPattern,
          maskAlgorithm: editingRule.maskAlgorithm,
          dataSource: editingRule.dataSource ?? "",
          description: editingRule.description ?? "",
          status: editingRule.status
        });
      } else {
        setForm(defaultForm);
      }
      setErrors({});
    }
  }, [open, editingRule]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.ruleCode.trim()) next.ruleCode = "请输入规则编码";
    if (!form.ruleName.trim()) next.ruleName = "请输入规则名称";
    if (!form.matchPattern.trim()) next.matchPattern = "请输入匹配模式/正则或字段名";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <MdDrawer
      open={open}
      onClose={onClose}
      title={editingRule ? "编辑敏感数据规则" : "新增敏感数据规则"}
      width={560}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MdInput
              label="规则编码 *"
              placeholder="如 ID_CARD"
              value={form.ruleCode}
              onChange={(e) => setForm((prev) => ({ ...prev, ruleCode: e.target.value }))}
              error={errors.ruleCode}
              disabled={!!editingRule}
            />
            <MdInput
              label="规则名称 *"
              placeholder="如 身份证号识别"
              value={form.ruleName}
              onChange={(e) => setForm((prev) => ({ ...prev, ruleName: e.target.value }))}
              error={errors.ruleName}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MdSelect
              label="敏感数据类型"
              placeholder="请选择"
              value={form.dataType}
              onChange={(v) => setForm((prev) => ({ ...prev, dataType: v as SensitiveDataType }))}
              options={dataTypeOptions}
            />
            <MdSelect
              label="敏感级别"
              placeholder="请选择"
              value={form.sensitiveLevel}
              onChange={(v) => setForm((prev) => ({ ...prev, sensitiveLevel: v as SensitiveLevel }))}
              options={levelOptions}
            />
          </div>
          <MdInput
            label="匹配模式/正则或字段名 *"
            placeholder="正则或字段名，如 mobile、^\\d{17}[\\dXx]$"
            value={form.matchPattern}
            onChange={(e) => setForm((prev) => ({ ...prev, matchPattern: e.target.value }))}
            error={errors.matchPattern}
          />
          <div className="grid grid-cols-2 gap-4">
            <MdSelect
              label="脱敏算法"
              placeholder="请选择"
              value={form.maskAlgorithm}
              onChange={(v) => setForm((prev) => ({ ...prev, maskAlgorithm: v as MaskAlgorithm }))}
              options={maskAlgorithmOptions}
            />
            <MdSelect
              label="数据来源"
              placeholder="请选择"
              value={form.dataSource}
              onChange={(v) => setForm((prev) => ({ ...prev, dataSource: v as string }))}
              options={dataSourceOptions}
            />
          </div>
          <MdSelect
            label="状态"
            placeholder="请选择"
            value={form.status}
            onChange={(v) => setForm((prev) => ({ ...prev, status: v as SensitiveRuleStatus }))}
            options={statusOptions}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">规则描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="规则说明、适用场景等"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <MdButton variant="outline" onClick={onClose}>
            取消
          </MdButton>
          <MdButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? "保存中..." : "保存"}
          </MdButton>
        </div>
      </div>
    </MdDrawer>
  );
}
