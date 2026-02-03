"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Power,
  Flame,
  Database,
  Activity,
  Layers
} from "lucide-react";
import { MdButton, MdBadge, MdCard, MdTable } from "@/components/enterprise-ui";
import type { Column } from "@/components/enterprise-ui";
import { featureRegistryMockData, featureUsageMockData, featureQualityMockData } from "./mock-data";
import type { FeatureRegistryItem, FeatureUsageRecord, FeatureStatus } from "./types";

export default function FeatureRegistryDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [feature, setFeature] = useState<FeatureRegistryItem | null>(null);
  const [usageRecords, setUsageRecords] = useState<FeatureUsageRecord[]>([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = featureRegistryMockData.find((item) => item.id === id) || null;
      setFeature(found);
      setUsageRecords(featureUsageMockData[id] || []);
      setLoading(false);
    }, 400);
  }, [id]);

  const qualityMetrics = useMemo(() => {
    if (!id) return null;
    return featureQualityMockData[id] || null;
  }, [id]);

  const handleBack = () => {
    router.push("/categories/data-platform/feature-quality/feature-registry");
  };

  const handleEdit = () => {
    if (feature) {
      router.push(`/categories/data-platform/feature-quality/feature-registry-edit?id=${feature.id}`);
    }
  };

  const handleToggleStatus = () => {
    if (!feature) return;
    const nextStatus: FeatureStatus = feature.status === "启用" ? "停用" : "启用";
    const actionText = nextStatus === "启用" ? "启用" : "停用";
    if (!confirm(`确定要${actionText}特征 "${feature.featureName}" 吗？`)) return;
    setFeature({ ...feature, status: nextStatus });
    toast.success(`特征已${actionText}`);
  };

  const usageColumns: Column<FeatureUsageRecord>[] = [
    {
      key: "scenario",
      title: "场景",
      dataIndex: "scenario",
      width: 160
    },
    {
      key: "modelName",
      title: "模型名称",
      dataIndex: "modelName",
      width: 180
    },
    {
      key: "modelVersion",
      title: "版本",
      dataIndex: "modelVersion",
      width: 80
    },
    {
      key: "usedBy",
      title: "使用部门",
      dataIndex: "usedBy",
      width: 120
    },
    {
      key: "usageCount",
      title: "复用次数",
      dataIndex: "usageCount",
      width: 100,
      render: (value: unknown) => (
        <div className="text-amber-600 flex items-center gap-1">
          <Flame className="h-4 w-4" />
          {String(value)}
        </div>
      )
    },
    {
      key: "lastUsedTime",
      title: "最近使用",
      dataIndex: "lastUsedTime",
      width: 160
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Database className="h-12 w-12 text-muted-foreground" />
        <p className="mt-3 text-muted-foreground">未找到特征信息</p>
        <MdButton variant="outline" className="mt-4" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          返回列表
        </MdButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background p-6 gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MdButton variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            返回列表
          </MdButton>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{feature.featureName}</h1>
            <p className="text-sm text-muted-foreground mt-1">{feature.featureCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MdButton variant="outline" onClick={handleEdit} leftIcon={<Edit className="h-4 w-4" />}>
            编辑
          </MdButton>
          <MdButton
            variant="primary"
            onClick={handleToggleStatus}
            leftIcon={<Power className="h-4 w-4" />}
          >
            {feature.status === "启用" ? "停用" : "启用"}
          </MdButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Layers className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">状态</div>
              <MdBadge variant={feature.status === "启用" ? "success" : "danger"}>{feature.status}</MdBadge>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Flame className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">复用次数</div>
              <div className="text-lg font-semibold">{feature.reuseCount}</div>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">最近复用</div>
              <div className="text-sm font-medium">{feature.lastUsedTime}</div>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100">
              <Database className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">计算方式</div>
              <MdBadge variant={feature.computeMode === "实时" ? "success" : "outline"}>
                {feature.computeMode}
              </MdBadge>
            </div>
          </div>
        </MdCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MdCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">基本信息</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">业务域</div>
              <div className="font-medium">{feature.businessDomain}</div>
            </div>
            <div>
              <div className="text-muted-foreground">特征类型</div>
              <div className="font-medium">{feature.featureType}</div>
            </div>
            <div>
              <div className="text-muted-foreground">数据来源</div>
              <div className="font-medium">{feature.dataSource}</div>
            </div>
            <div>
              <div className="text-muted-foreground">落表/视图</div>
              <div className="font-medium">{feature.storageTable}</div>
            </div>
            <div>
              <div className="text-muted-foreground">特征负责人</div>
              <div className="font-medium">{feature.owner}</div>
            </div>
            <div>
              <div className="text-muted-foreground">数据负责人</div>
              <div className="font-medium">{feature.dataOwner}</div>
            </div>
            <div>
              <div className="text-muted-foreground">创建时间</div>
              <div className="font-medium">{feature.createTime}</div>
            </div>
            <div>
              <div className="text-muted-foreground">更新时间</div>
              <div className="font-medium">{feature.updateTime}</div>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <div className="text-muted-foreground">特征描述</div>
            <div className="mt-1 text-foreground">{feature.description}</div>
          </div>
          <div className="mt-4 text-sm">
            <div className="text-muted-foreground">计算逻辑</div>
            <div className="mt-1 text-foreground">{feature.computeLogic}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {feature.tags.map((tag) => (
              <MdBadge key={tag} variant="outline">
                {tag}
              </MdBadge>
            ))}
          </div>
        </MdCard>

        <MdCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">质量与稳定性</h3>
          {qualityMetrics ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-muted-foreground">数据新鲜度</div>
                <div className="text-lg font-semibold">{qualityMetrics.freshnessHours} 小时</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-muted-foreground">覆盖率</div>
                <div className="text-lg font-semibold">{qualityMetrics.coverage}%</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-muted-foreground">稳定性</div>
                <div className="text-lg font-semibold">{qualityMetrics.stability}%</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="text-muted-foreground">空值率</div>
                <div className="text-lg font-semibold">{qualityMetrics.nullRate}%</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-4 col-span-2">
                <div className="text-muted-foreground">漂移得分</div>
                <div className="text-lg font-semibold">{qualityMetrics.driftScore}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">暂无质量指标数据</div>
          )}
        </MdCard>
      </div>

      <MdCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">复用明细</h3>
          <MdBadge variant="info">共 {usageRecords.length} 条</MdBadge>
        </div>
        <MdTable<FeatureUsageRecord> columns={usageColumns} data={usageRecords} />
      </MdCard>
    </div>
  );
}
