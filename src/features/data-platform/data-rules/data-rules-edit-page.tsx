"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { MdButton, MdInput, MdSelect, MdCard } from "@/components/enterprise-ui";
import { dataRulesMockData } from "./mock-data";
import type { DataRuleItem, DataRuleStatus, RuleType, GateAction } from "./types";

const ruleTypeOptions = [
  { value: "空值检查", label: "空值检查" },
  { value: "唯一性检查", label: "唯一性检查" },
  { value: "范围检查", label: "范围检查" },
  { value: "格式检查", label: "格式检查" },
  { value: "自定义SQL", label: "自定义SQL" }
];

const gateActionOptions = [
  { value: "阻断", label: "阻断" },
  { value: "告警", label: "告警" },
  { value: "仅记录", label: "仅记录" }
];

const statusOptions = [
  { value: "启用", label: "启用" },
  { value: "停用", label: "停用" }
];

export default function DataRulesEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<DataRuleItem | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = dataRulesMockData.find((item) => item.id === id) || null;
      setFormData(found ? { ...found } : null);
      setLoading(false);
    }, 400);
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!formData) return;
    if (!formData.ruleName.trim()) {
      toast.error("请输入规则名称");
      return;
    }
    if (!formData.ruleCode.trim()) {
      toast.error("请输入规则编码");
      return;
    }
    if (!formData.targetTable.trim()) {
      toast.error("请输入目标表");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("规则更新成功");
      router.push("/categories/data-platform/data-quality/data-rules");
    } catch (error) {
      console.error("更新失败:", error);
      toast.error("更新失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">未找到规则信息</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background p-6 gap-6">
      <div className="flex items-center gap-3">
        <MdButton variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          返回
        </MdButton>
        <h1 className="text-2xl font-bold text-slate-900">编辑数据规则</h1>
      </div>

      <MdCard className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <MdInput
            label="规则名称 *"
            value={formData.ruleName}
            onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
          />
          <MdInput
            label="规则编码 *"
            value={formData.ruleCode}
            onChange={(e) => setFormData({ ...formData, ruleCode: e.target.value })}
          />
          <MdSelect
            label="规则类型"
            value={formData.ruleType}
            onChange={(value) => setFormData({ ...formData, ruleType: value as RuleType })}
            options={ruleTypeOptions}
          />
          <MdSelect
            label="门禁动作"
            value={formData.gateAction}
            onChange={(value) => setFormData({ ...formData, gateAction: value as GateAction })}
            options={gateActionOptions}
          />
          <MdInput
            label="目标表 *"
            value={formData.targetTable}
            onChange={(e) => setFormData({ ...formData, targetTable: e.target.value })}
          />
          <MdInput
            label="目标字段"
            value={formData.targetField ?? ""}
            onChange={(e) => setFormData({ ...formData, targetField: e.target.value || undefined })}
          />
          <MdInput
            label="规则参数说明"
            value={formData.ruleParams ?? ""}
            onChange={(e) => setFormData({ ...formData, ruleParams: e.target.value || undefined })}
          />
          <MdSelect
            label="状态"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as DataRuleStatus })}
            options={statusOptions}
          />
          <MdInput
            label="负责人"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-1">规则描述</label>
          <textarea
            value={formData.description ?? ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value || undefined })}
            rows={3}
            placeholder="说明规则业务含义及门禁策略"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <MdButton variant="outline" onClick={handleBack}>
            取消
          </MdButton>
          <MdButton onClick={handleSubmit} disabled={submitting} leftIcon={<Save className="h-4 w-4" />}>
            {submitting ? "保存中..." : "保存修改"}
          </MdButton>
        </div>
      </MdCard>
    </div>
  );
}
