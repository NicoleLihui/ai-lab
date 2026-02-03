"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Power,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Clock
} from "lucide-react";
import { MdButton, MdBadge, MdCard, MdTable } from "@/components/enterprise-ui";
import type { Column } from "@/components/enterprise-ui";
import { dataRulesMockData, dataRuleRunRecordsMock } from "./mock-data";
import type { DataRuleItem, DataRuleStatus, DataRuleRunRecord, LastRunResult } from "./types";

export default function DataRulesDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [rule, setRule] = useState<DataRuleItem | null>(null);
  const [runRecords, setRunRecords] = useState<DataRuleRunRecord[]>([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = dataRulesMockData.find((item) => item.id === id) || null;
      setRule(found);
      setRunRecords(dataRuleRunRecordsMock[id] || []);
      setLoading(false);
    }, 400);
  }, [id]);

  const handleBack = () => {
    router.push("/categories/data-platform/data-quality/data-rules");
  };

  const handleEdit = () => {
    if (rule) {
      router.push(`/categories/data-platform/data-quality/data-rules-edit?id=${rule.id}`);
    }
  };

  const handleToggleStatus = () => {
    if (!rule) return;
    const nextStatus: DataRuleStatus = rule.status === "启用" ? "停用" : "启用";
    const actionText = nextStatus === "启用" ? "启用" : "停用";
    if (!confirm(`确定要${actionText}规则 "${rule.ruleName}" 吗？`)) return;
    setRule({ ...rule, status: nextStatus });
    toast.success(`规则已${actionText}`);
  };

  const runResultBadge = (result: LastRunResult | string) => {
    if (result === "通过") return <MdBadge variant="success">通过</MdBadge>;
    if (result === "未通过") return <MdBadge variant="danger">未通过</MdBadge>;
    return <MdBadge variant="outline">{result}</MdBadge>;
  };

  const gateActionBadge = (action: string) => {
    if (action === "阻断") return <MdBadge variant="danger">阻断</MdBadge>;
    if (action === "告警") return <MdBadge variant="warning">告警</MdBadge>;
    return <MdBadge variant="outline">仅记录</MdBadge>;
  };

  const runColumns: Column<DataRuleRunRecord>[] = useMemo(
    () => [
      { key: "runTime", title: "执行时间", dataIndex: "runTime", width: 180 },
      {
        key: "result",
        title: "结果",
        dataIndex: "result",
        width: 100,
        render: (value: unknown) => runResultBadge(String(value))
      },
      {
        key: "violationCount",
        title: "违规条数",
        dataIndex: "violationCount",
        width: 100,
        render: (value: unknown) => (value != null ? String(value) : "-")
      },
      { key: "durationMs", title: "耗时(ms)", dataIndex: "durationMs", width: 100 },
      { key: "taskId", title: "任务ID", dataIndex: "taskId", width: 140 },
      { key: "message", title: "说明", dataIndex: "message", width: 200 }
    ],
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FileCheck className="h-12 w-12 text-muted-foreground" />
        <p className="mt-3 text-muted-foreground">未找到规则信息</p>
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
            <h1 className="text-2xl font-bold text-slate-900">{rule.ruleName}</h1>
            <p className="text-sm text-muted-foreground mt-1">{rule.ruleCode}</p>
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
            {rule.status === "启用" ? "停用" : "启用"}
          </MdButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Power className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">状态</div>
              <MdBadge variant={rule.status === "启用" ? "success" : "danger"}>{rule.status}</MdBadge>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <ShieldCheck className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">门禁动作</div>
              {gateActionBadge(rule.gateAction)}
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">最近执行</div>
              {runResultBadge(rule.lastRunResult || "未执行")}
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">最近执行时间</div>
              <div className="text-sm font-medium">{rule.lastRunTime || "-"}</div>
            </div>
          </div>
        </MdCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MdCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">规则配置</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">规则类型</div>
              <MdBadge variant="secondary" className="mt-1">{rule.ruleType}</MdBadge>
            </div>
            <div>
              <div className="text-muted-foreground">目标表</div>
              <div className="font-medium">{rule.targetTable}</div>
            </div>
            <div>
              <div className="text-muted-foreground">目标字段</div>
              <div className="font-medium">{rule.targetField || "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">规则参数</div>
              <div className="font-medium">{rule.ruleParams || "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">负责人</div>
              <div className="font-medium">{rule.owner}</div>
            </div>
            <div>
              <div className="text-muted-foreground">创建时间</div>
              <div className="font-medium">{rule.createTime}</div>
            </div>
            <div>
              <div className="text-muted-foreground">更新时间</div>
              <div className="font-medium">{rule.updateTime}</div>
            </div>
            {rule.lastViolationCount != null && rule.lastRunResult === "未通过" && (
              <div>
                <div className="text-muted-foreground">最近违规条数</div>
                <div className="font-medium text-destructive">{rule.lastViolationCount}</div>
              </div>
            )}
          </div>
          {rule.description && (
            <div className="mt-4 text-sm">
              <div className="text-muted-foreground">规则描述</div>
              <div className="mt-1 text-foreground">{rule.description}</div>
            </div>
          )}
        </MdCard>

        <MdCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">业务价值</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>· 建立数据信任：通过规则约束保障数据完整性、唯一性、格式与范围。</li>
            <li>· 门禁阻断：发现脏数据可自动停止任务，避免脏数据流入下游。</li>
            <li>· 提升数据可用性：减少因脏数据导致的报表与模型错误。</li>
          </ul>
        </MdCard>
      </div>

      <MdCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">执行记录</h3>
          <MdBadge variant="info">共 {runRecords.length} 条</MdBadge>
        </div>
        <MdTable<DataRuleRunRecord> columns={runColumns} data={runRecords} />
      </MdCard>
    </div>
  );
}
