"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  Plus,
  RotateCcw,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  MdButton,
  MdInput,
  MdSelect,
  MdTable,
  MdBadge,
  MdCard,
  MdCheckbox
} from "@/components/enterprise-ui";
import type { Column } from "@/components/enterprise-ui";
import { sensitiveDataMockData } from "./mock-data";
import type { SensitiveDataRule, SensitiveLevel, SensitiveDataType, MaskAlgorithm, SensitiveRuleStatus } from "./types";
import { SensitiveDataRuleDrawer } from "./sensitive-data-rule-drawer";
import { SensitiveDataDetailModal } from "./sensitive-data-detail-modal";

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

const statusOptions = [
  { value: "启用", label: "启用" },
  { value: "停用", label: "停用" }
];

export default function SensitiveDataPage() {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<SensitiveDataRule[]>([]);
  const [tableData, setTableData] = useState<SensitiveDataRule[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    keyword: "",
    dataType: "" as SensitiveDataType | "",
    sensitiveLevel: "" as SensitiveLevel | "",
    status: "" as SensitiveRuleStatus | ""
  });
  const [showRuleDrawer, setShowRuleDrawer] = useState(false);
  const [editingRule, setEditingRule] = useState<SensitiveDataRule | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRule, setDetailRule] = useState<SensitiveDataRule | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAllData(sensitiveDataMockData);
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
              (item.description?.toLowerCase().includes(k) ?? false)
          );
        }
        if (filters.dataType) filtered = filtered.filter((item) => item.dataType === filters.dataType);
        if (filters.sensitiveLevel) filtered = filtered.filter((item) => item.sensitiveLevel === filters.sensitiveLevel);
        if (filters.status) filtered = filtered.filter((item) => item.status === filters.status);

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
      dataType: "",
      sensitiveLevel: "",
      status: ""
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    setTimeout(() => loadData(1, pagination.pageSize), 0);
  };

  const handleAddRule = () => {
    setEditingRule(null);
    setShowRuleDrawer(true);
  };

  const handleEditRule = (record: SensitiveDataRule) => {
    setEditingRule(record);
    setShowRuleDrawer(true);
  };

  const handleRuleSubmit = async (
    form: Omit<SensitiveDataRule, "id" | "creator" | "createTime" | "updateTime">
  ) => {
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      if (editingRule) {
        setAllData((prev) =>
          prev.map((item) =>
            item.id === editingRule.id
              ? {
                  ...item,
                  ...form,
                  updateTime: now
                }
              : item
          )
        );
        toast.success("规则已更新");
      } else {
        const newItem: SensitiveDataRule = {
          id: `SDR-${Date.now()}`,
          ...form,
          dataSource: form.dataSource || undefined,
          description: form.description || undefined,
          creator: "当前用户",
          createTime: now,
          updateTime: now
        };
        setAllData((prev) => [newItem, ...prev]);
        toast.success("规则已新增");
      }
      setShowRuleDrawer(false);
    } catch (e) {
      toast.error(editingRule ? "更新失败" : "新增失败");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = (record: SensitiveDataRule) => {
    setDetailRule(record);
    setShowDetailModal(true);
  };

  const handleDelete = (record: SensitiveDataRule) => {
    if (!confirm(`确定删除敏感数据规则「${record.ruleName}」？`)) return;
    setAllData((prev) => prev.filter((item) => item.id !== record.id));
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      next.delete(record.id);
      return next;
    });
    toast.success("已删除");
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.size === 0) {
      toast.error("请先勾选要删除的规则");
      return;
    }
    if (!confirm(`确定删除选中的 ${selectedRowKeys.size} 条规则？`)) return;
    setAllData((prev) => prev.filter((item) => !selectedRowKeys.has(item.id)));
    setSelectedRowKeys(new Set());
    toast.success("批量删除成功");
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(new Set(tableData.map((r) => r.id)));
    } else {
      setSelectedRowKeys(new Set());
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const allSelected = tableData.length > 0 && tableData.every((r) => selectedRowKeys.has(r.id));
  const someSelected = selectedRowKeys.size > 0;

  const columns: Column<SensitiveDataRule>[] = [
    {
      key: "select",
      title: (
        <MdCheckbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={(checked) => toggleSelectAll(!!checked)}
        />
      ),
      width: 48,
      align: "center",
      render: (_: unknown, record: SensitiveDataRule) => (
        <MdCheckbox
          checked={selectedRowKeys.has(record.id)}
          onChange={(checked) => toggleSelectRow(record.id, !!checked)}
        />
      )
    },
    {
      key: "ruleName",
      title: "规则名称",
      width: 160,
      render: (value: unknown, record) => (
        <div className="space-y-0.5">
          <div className="font-medium text-slate-900">{String(value)}</div>
          <div className="text-xs text-slate-500">{record.ruleCode}</div>
        </div>
      )
    },
    {
      key: "dataType",
      title: "敏感数据类型",
      width: 120,
      render: (value: unknown) => <MdBadge variant="secondary">{String(value)}</MdBadge>
    },
    {
      key: "sensitiveLevel",
      title: "敏感级别",
      width: 90,
      render: (value: unknown) => (
        <MdBadge
          variant={
            value === "高" ? "danger" : value === "中" ? "warning" : "outline"
          }
        >
          {String(value)}
        </MdBadge>
      )
    },
    {
      key: "maskAlgorithm",
      title: "脱敏算法",
      width: 90
    },
    {
      key: "dataSource",
      title: "数据来源",
      width: 100,
      render: (value: unknown) => String(value ?? "-")
    },
    {
      key: "status",
      title: "状态",
      width: 80,
      render: (value: unknown) => (
        <MdBadge variant={value === "启用" ? "success" : "danger"}>{String(value)}</MdBadge>
      )
    },
    {
      key: "updateTime",
      title: "更新时间",
      width: 160
    },
    {
      key: "actions",
      title: "操作",
      width: 220,
      render: (_: unknown, record: SensitiveDataRule) => (
        <div className="flex flex-wrap items-center gap-2">
          <MdButton variant="ghost" size="sm" onClick={() => handleViewDetail(record)}>
            <Eye className="h-4 w-4 mr-1" />
            详情
          </MdButton>
          <MdButton variant="ghost" size="sm" onClick={() => handleEditRule(record)}>
            <Edit className="h-4 w-4 mr-1" />
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(record)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            删除
          </MdButton>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-4">
      <MdCard className="p-4 space-y-3 overflow-visible bg-white rounded-xl border border-border shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex-1">
            <MdInput
              placeholder="搜索规则名称/编码/描述"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <MdSelect
            placeholder="敏感数据类型"
            value={filters.dataType}
            onChange={(v) => setFilters((prev) => ({ ...prev, dataType: v as SensitiveDataType | "" }))}
            options={dataTypeOptions}
          />
          <MdSelect
            placeholder="敏感级别"
            value={filters.sensitiveLevel}
            onChange={(v) => setFilters((prev) => ({ ...prev, sensitiveLevel: v as SensitiveLevel | "" }))}
            options={levelOptions}
          />
          <MdSelect
            placeholder="状态"
            value={filters.status}
            onChange={(v) => setFilters((prev) => ({ ...prev, status: v as SensitiveRuleStatus | "" }))}
            options={statusOptions}
          />
        </div>
      </MdCard>

      <div className="flex items-center gap-2">
        <MdButton
          variant="outline"
          size="sm"
          onClick={handleBatchDelete}
          disabled={selectedRowKeys.size === 0}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          批量删除
        </MdButton>
        <MdButton onClick={handleAddRule} leftIcon={<Plus className="h-4 w-4" />}>
          新增规则
        </MdButton>
      </div>

      <MdCard className="p-0 overflow-hidden bg-white rounded-xl border border-border shadow-sm">
        <MdTable<SensitiveDataRule>
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

      <SensitiveDataRuleDrawer
        open={showRuleDrawer}
        onClose={() => setShowRuleDrawer(false)}
        onSubmit={handleRuleSubmit}
        editingRule={editingRule}
        submitting={submitting}
      />

      <SensitiveDataDetailModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        rule={detailRule}
      />
    </div>
  );
}
