"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { MdButton, MdInput, MdSelect, MdCard } from "@/components/enterprise-ui";
import { featureRegistryMockData } from "./mock-data";
import type { FeatureComputeMode, FeatureRegistryItem, FeatureStatus, FeatureType } from "./types";

const featureTypeOptions = [
  { value: "统计特征", label: "统计特征" },
  { value: "时序特征", label: "时序特征" },
  { value: "画像特征", label: "画像特征" },
  { value: "衍生特征", label: "衍生特征" }
];

const computeModeOptions = [
  { value: "实时", label: "实时" },
  { value: "离线", label: "离线" }
];

const businessDomainOptions = [
  { value: "水量", label: "水量" },
  { value: "水质", label: "水质" },
  { value: "设备", label: "设备" },
  { value: "药剂", label: "药剂" },
  { value: "工单", label: "工单" },
  { value: "经营", label: "经营" }
];

const dataSourceOptions = [
  { value: "数采", label: "数采" },
  { value: "基础数据", label: "基础数据" },
  { value: "工单数据", label: "工单数据" },
  { value: "台账数据", label: "台账数据" }
];

const statusOptions = [
  { value: "启用", label: "启用" },
  { value: "停用", label: "停用" }
];

export default function FeatureRegistryEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FeatureRegistryItem | null>(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = featureRegistryMockData.find((item) => item.id === id) || null;
      setFormData(found);
      setTagInput(found ? found.tags.join(",") : "");
      setLoading(false);
    }, 400);
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!formData) return;
    if (!formData.featureName.trim()) {
      toast.error("请输入特征名称");
      return;
    }
    if (!formData.featureCode.trim()) {
      toast.error("请输入特征编码");
      return;
    }
    if (!formData.businessDomain) {
      toast.error("请选择业务域");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("特征更新成功");
      router.push("/categories/data-platform/feature-quality/feature-registry");
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
        <div className="text-muted-foreground">未找到特征信息</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background p-6 gap-6">
      <div className="flex items-center gap-3">
        <MdButton variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          返回
        </MdButton>
        <h1 className="text-2xl font-bold text-slate-900">编辑特征</h1>
      </div>

      <MdCard className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <MdInput
            label="特征名称 *"
            value={formData.featureName}
            onChange={(e) => setFormData({ ...formData, featureName: e.target.value })}
          />
          <MdInput
            label="特征编码 *"
            value={formData.featureCode}
            onChange={(e) => setFormData({ ...formData, featureCode: e.target.value })}
          />
          <MdSelect
            label="特征类型"
            value={formData.featureType}
            onChange={(value) => setFormData({ ...formData, featureType: value as FeatureType })}
            options={featureTypeOptions}
          />
          <MdSelect
            label="计算方式"
            value={formData.computeMode}
            onChange={(value) => setFormData({ ...formData, computeMode: value as FeatureComputeMode })}
            options={computeModeOptions}
          />
          <MdSelect
            label="业务域 *"
            value={formData.businessDomain}
            onChange={(value) => setFormData({ ...formData, businessDomain: value as string })}
            options={businessDomainOptions}
          />
          <MdSelect
            label="数据来源"
            value={formData.dataSource}
            onChange={(value) => setFormData({ ...formData, dataSource: value as string })}
            options={dataSourceOptions}
          />
          <MdInput
            label="特征负责人"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          />
          <MdInput
            label="数据负责人"
            value={formData.dataOwner}
            onChange={(e) => setFormData({ ...formData, dataOwner: e.target.value })}
          />
          <MdSelect
            label="状态"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as FeatureStatus })}
            options={statusOptions}
          />
          <MdInput
            label="落表/视图"
            value={formData.storageTable}
            onChange={(e) => setFormData({ ...formData, storageTable: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-1">特征描述</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-1">计算逻辑</label>
          <textarea
            value={formData.computeLogic}
            onChange={(e) => setFormData({ ...formData, computeLogic: e.target.value })}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mt-4">
          <MdInput
            label="标签"
            value={tagInput}
            onChange={(e) => {
              const value = e.target.value;
              setTagInput(value);
              setFormData({
                ...formData,
                tags: value.split(",").map((tag) => tag.trim()).filter(Boolean)
              });
            }}
            placeholder="用逗号分隔多个标签"
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
