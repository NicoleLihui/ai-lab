"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Plus, RotateCcw, Eye, Edit, Power } from "lucide-react";
import {
  MdButton,
  MdInput,
  MdSelect,
  MdTable,
  MdBadge,
  MdCard,
  MdDrawer
} from "@/components/enterprise-ui";
import type { Column } from "@/components/enterprise-ui";
import { dataRulesMockData } from "./mock-data";
import type {
  DataRuleItem,
  DataRuleStatus,
  RuleType,
  GateAction,
  LastRunResult
} from "./types";

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

const defaultFormData = {
  ruleName: "",
  ruleCode: "",
  ruleType: "空值检查" as RuleType,
  gateAction: "阻断" as GateAction,
  targetTable: "",
  targetField: "",
  ruleParams: "",
  owner: "",
  description: ""
};

export default function DataRulesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<DataRuleItem[]>([]);
  const [tableData, setTableData] = useState<DataRuleItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    keyword: "",
    ruleType: "",
    gateAction: "",
    status: "",
    owner: ""
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setAllData(dataRulesMockData);
  }, []);

  const loadData = useCallback(
    async (page = 1, size = pagination.pageSize) => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        let filtered = [...allData];
        if (filters.keyword) {
          const k = filters.keyword.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.ruleName.toLowerCase().includes(k) ||
              item.ruleCode.toLowerCase().includes(k) ||
              (item.targetTable?.toLowerCase().includes(k) ?? false)
          );
        }
        if (filters.ruleType) filtered = filtered.filter((item) => item.ruleType === filters.ruleType);
        if (filters.gateAction) filtered = filtered.filter((item) => item.gateAction === filters.gateAction);
        if (filters.status) filtered = filtered.filter((item) => item.status === filters.status);
        if (filters.owner) {
          filtered = filtered.filter((item) =>
            item.owner.toLowerCase().includes(filters.owner.toLowerCase())
          );
        }
        const total = filtered.length;
        const start = (page - 1) * size;
        const slice = filtered.slice(start, start + size);
        setTableData(slice);
        setPagination((prev) => ({ ...prev, current: page, pageSize: size, total }));
      } catch (e) {
        console.error(e);
        toast.error("加载数据失败");
      } finally {
        setLoading(false);
      }
    },
    [allData, filters, pagination.pageSize]
  );

  useEffect(() => {
    if (allData.length >= 0) loadData(1);
  }, [allData, loadData]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize);
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      ruleType: "",
      gateAction: "",
      status: "",
      owner: ""
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    setTimeout(() => loadData(1, pagination.pageSize), 0);
  };

  const handleAdd = () => {
    setFormData({ ...defaultFormData });
    setShowDrawer(true);
  };

  const handleSave = async () => {
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
      await new Promise((resolve) => setTimeout(resolve, 400));
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const newItem: DataRuleItem = {
        id: `DR-${Date.now()}`,
        ruleName: formData.ruleName,
        ruleCode: formData.ruleCode,
        ruleType: formData.ruleType,
        gateAction: formData.gateAction,
        targetTable: formData.targetTable,
        targetField: formData.targetField || undefined,
        ruleParams: formData.ruleParams || undefined,
        status: "停用",
        owner: formData.owner || "未指定",
        description: formData.description || undefined,
        createTime: now,
        updateTime: now
      };
      setAllData((prev) => [newItem, ...prev]);
      toast.success("规则创建成功，默认状态为停用，可在详情页启用");
      setShowDrawer(false);
    } catch (error) {
      console.error("创建失败:", error);
      toast.error("创建失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = (record: DataRuleItem) => {
    router.push(`/categories/data-platform/data-quality/data-rules-detail?id=${record.id}`);
  };

  const handleEdit = (record: DataRuleItem) => {
    router.push(`/categories/data-platform/data-quality/data-rules-edit?id=${record.id}`);
  };

  const handleToggleStatus = (record: DataRuleItem) => {
    const nextStatus: DataRuleStatus = record.status === "启用" ? "停用" : "启用";
    const actionText = nextStatus === "启用" ? "启用" : "停用";
    if (!confirm(`确定要${actionText}规则 "${record.ruleName}" 吗？`)) return;
    setAllData((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? {
              ...item,
              status: nextStatus,
              updateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
            }
          : item
      )
    );
    toast.success(`规则已${actionText}`);
  };

  const renderRunResult = (value: unknown) => {
    const v = value as LastRunResult | undefined;
    if (!v || v === "未执行") return <MdBadge variant="outline">未执行</MdBadge>;
    if (v === "通过") return <MdBadge variant="success">通过</MdBadge>;
    if (v === "未通过") return <MdBadge variant="danger">未通过</MdBadge>;
    return <MdBadge variant="secondary">{v}</MdBadge>;
  };

  const columns: Column<DataRuleItem>[] = [
    {
      key: "ruleName",
      title: "规则名称",
      width: 200,
      render: (value: unknown, record) => (
        <div className="space-y-1">
          <div className="font-medium text-slate-900">{String(value)}</div>
          <div className="text-xs text-slate-500">{record.ruleCode}</div>
        </div>
      )
    },
    {
      key: "ruleType",
      title: "规则类型",
      width: 110,
      render: (value: unknown) => <MdBadge variant="secondary">{String(value)}</MdBadge>
    },
    {
      key: "gateAction",
      title: "门禁动作",
      width: 100,
      render: (value: unknown) => {
        const v = value as GateAction;
        if (v === "阻断") return <MdBadge variant="danger">阻断</MdBadge>;
        if (v === "告警") return <MdBadge variant="warning">告警</MdBadge>;
        return <MdBadge variant="outline">仅记录</MdBadge>;
      }
    },
    {
      key: "targetTable",
      title: "目标表/字段",
      width: 180,
      render: (_: unknown, record) => (
        <div className="text-sm">
          <div>{record.targetTable}</div>
          {record.targetField && (
            <div className="text-xs text-slate-500">{record.targetField}</div>
          )}
        </div>
      )
    },
    {
      key: "status",
      title: "状态",
      width: 90,
      render: (value: unknown) => (
        <MdBadge variant={value === "启用" ? "success" : "danger"}>{String(value)}</MdBadge>
      )
    },
    {
      key: "lastRunResult",
      title: "最近执行",
      width: 100,
      render: (value: unknown) => renderRunResult(value)
    },
    {
      key: "owner",
      title: "负责人",
      width: 100
    },
    {
      key: "updateTime",
      title: "更新时间",
      width: 160
    },
    {
      key: "actions",
      title: "操作",
      width: 240,
      render: (_: unknown, record: DataRuleItem) => (
        <div className="flex flex-wrap items-center gap-2">
          <MdButton variant="ghost" size="sm" onClick={() => handleViewDetail(record)}>
            <Eye className="h-4 w-4 mr-1" />
            详情
          </MdButton>
          <MdButton variant="ghost" size="sm" onClick={() => handleEdit(record)}>
            <Edit className="h-4 w-4 mr-1" />
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(record)}
            className={record.status === "启用" ? "text-orange-600" : "text-emerald-600"}
          >
            <Power className="h-4 w-4 mr-1" />
            {record.status === "启用" ? "停用" : "启用"}
          </MdButton>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-4">
      <div className="space-y-4">
        <MdCard className="p-4 space-y-3 bg-white rounded-xl border border-border shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex-1">
              <MdInput
                placeholder="搜索规则名称/编码/目标表"
                value={filters.keyword}
                onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                leftIcon={<Search className="h-4 w-4" />}
                clearable
                onClear={() => setFilters((prev) => ({ ...prev, keyword: "" }))}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <MdButton onClick={handleSearch} leftIcon={<Search className="h-4 w-4" />}>
                查询
              </MdButton>
              <MdButton variant="outline" onClick={handleReset} leftIcon={<RotateCcw className="h-4 w-4" />}>
                重置
              </MdButton>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            <MdSelect
              placeholder="规则类型"
              value={filters.ruleType}
              onChange={(value) => setFilters((prev) => ({ ...prev, ruleType: value as string }))}
              options={[{ value: "", label: "全部" }, ...ruleTypeOptions]}
            />
            <MdSelect
              placeholder="门禁动作"
              value={filters.gateAction}
              onChange={(value) => setFilters((prev) => ({ ...prev, gateAction: value as string }))}
              options={[{ value: "", label: "全部" }, ...gateActionOptions]}
            />
            <MdSelect
              placeholder="状态"
              value={filters.status}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value as string }))}
              options={[{ value: "", label: "全部" }, ...statusOptions]}
            />
            <MdInput
              placeholder="负责人"
              value={filters.owner}
              onChange={(e) => setFilters((prev) => ({ ...prev, owner: e.target.value }))}
            />
          </div>
        </MdCard>

        {/* 批量操作：列表上方、查询项下方 */}
        <div className="flex justify-end">
          <MdButton size="sm" onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
            新建规则
          </MdButton>
        </div>

        <MdCard className="p-0 overflow-hidden bg-white rounded-xl border border-border shadow-sm">
          <MdTable<DataRuleItem>
            columns={columns}
            data={tableData}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, size) => loadData(page, size)
            }}
            rowKey="id"
          />
        </MdCard>
      </div>

      <MdDrawer open={showDrawer} onClose={() => setShowDrawer(false)} title="新建数据规则" width={640}>
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <MdInput
              label="规则名称 *"
              placeholder="如：用户手机号非空检查"
              value={formData.ruleName}
              onChange={(e) => setFormData((prev) => ({ ...prev, ruleName: e.target.value }))}
            />
            <MdInput
              label="规则编码 *"
              placeholder="如：user_phone_not_null"
              value={formData.ruleCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, ruleCode: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MdSelect
              label="规则类型"
              value={formData.ruleType}
              onChange={(value) => setFormData((prev) => ({ ...prev, ruleType: value as RuleType }))}
              options={ruleTypeOptions}
            />
            <MdSelect
              label="门禁动作"
              value={formData.gateAction}
              onChange={(value) => setFormData((prev) => ({ ...prev, gateAction: value as GateAction }))}
              options={gateActionOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MdInput
              label="目标表 *"
              placeholder="如：ods.user_info 或 dwd.order_detail"
              value={formData.targetTable}
              onChange={(e) => setFormData((prev) => ({ ...prev, targetTable: e.target.value }))}
            />
            <MdInput
              label="目标字段"
              placeholder="可选，如：phone / order_id"
              value={formData.targetField}
              onChange={(e) => setFormData((prev) => ({ ...prev, targetField: e.target.value }))}
            />
          </div>
          <MdInput
            label="规则参数说明"
            placeholder="如：空值率阈值≤0%、唯一性列、范围上下界、正则表达式等"
            value={formData.ruleParams}
            onChange={(e) => setFormData((prev) => ({ ...prev, ruleParams: e.target.value }))}
          />
          <MdInput
            label="负责人"
            placeholder="规则负责人"
            value={formData.owner}
            onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">规则描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="说明规则业务含义及门禁策略"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <MdButton variant="outline" onClick={() => setShowDrawer(false)}>
            取消
          </MdButton>
          <MdButton onClick={handleSave} disabled={submitting}>
            {submitting ? "保存中..." : "保存"}
          </MdButton>
        </div>
      </MdDrawer>
    </div>
  );
}
