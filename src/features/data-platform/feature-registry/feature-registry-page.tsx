"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Plus,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  Power,
  Flame,
  Database,
  Layers,
  Activity
} from "lucide-react";
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
import { featureRegistryMockData } from "./mock-data";
import type {
  FeatureRegistryItem,
  FeatureStatus,
  FeatureType,
  FeatureComputeMode
} from "./types";

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

const defaultFormData = {
  featureName: "",
  featureCode: "",
  featureType: "统计特征" as FeatureType,
  computeMode: "离线" as FeatureComputeMode,
  businessDomain: "",
  dataSource: "",
  owner: "",
  dataOwner: "",
  storageTable: "",
  description: "",
  computeLogic: "",
  tags: ""
};

export default function FeatureRegistryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<FeatureRegistryItem[]>([]);
  const [tableData, setTableData] = useState<FeatureRegistryItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    keyword: "",
    businessDomain: "",
    featureType: "",
    computeMode: "",
    status: "",
    owner: ""
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [submitting, setSubmitting] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setAllData(featureRegistryMockData);
  }, []);

  const loadData = useCallback(
    async (page = 1, size = pagination.pageSize) => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let filtered = [...allData];

        if (filters.keyword) {
          const keyword = filters.keyword.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.featureName.toLowerCase().includes(keyword) ||
              item.featureCode.toLowerCase().includes(keyword)
          );
        }
        if (filters.businessDomain) {
          filtered = filtered.filter((item) => item.businessDomain === filters.businessDomain);
        }
        if (filters.featureType) {
          filtered = filtered.filter((item) => item.featureType === filters.featureType);
        }
        if (filters.computeMode) {
          filtered = filtered.filter((item) => item.computeMode === filters.computeMode);
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }
        if (filters.owner) {
          filtered = filtered.filter((item) =>
            item.owner.toLowerCase().includes(filters.owner.toLowerCase())
          );
        }

        const total = filtered.length;
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, total);
        const paginatedData = filtered.slice(startIndex, endIndex);

        setTableData(paginatedData);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: size,
          total
        }));
      } catch (error) {
        console.error("加载特征数据失败:", error);
        toast.error("加载特征数据失败");
      } finally {
        setLoading(false);
      }
    },
    [allData, filters, pagination.pageSize]
  );

  useEffect(() => {
    if (allData.length) {
      loadData(1);
    }
  }, [allData, loadData]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize);
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      businessDomain: "",
      featureType: "",
      computeMode: "",
      status: "",
      owner: ""
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    setTimeout(() => {
      loadData(1, pagination.pageSize);
    }, 0);
  };

  const handleAdd = () => {
    setFormData({ ...defaultFormData });
    setShowDrawer(true);
  };

  const handleSave = async () => {
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
    if (!formData.dataSource) {
      toast.error("请选择数据来源");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const newItem: FeatureRegistryItem = {
        id: `FTR-${Date.now()}`,
        featureName: formData.featureName,
        featureCode: formData.featureCode,
        featureType: formData.featureType,
        computeMode: formData.computeMode,
        businessDomain: formData.businessDomain,
        dataSource: formData.dataSource,
        owner: formData.owner || "未指定",
        dataOwner: formData.dataOwner || "未指定",
        storageTable: formData.storageTable || "-",
        status: "停用",
        reuseCount: 0,
        lastUsedTime: "-",
        description: formData.description || "-",
        computeLogic: formData.computeLogic || "-",
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        createTime: now,
        updateTime: now
      };
      setAllData((prev) => [newItem, ...prev]);
      toast.success("特征注册成功");
      setShowDrawer(false);
    } catch (error) {
      console.error("特征注册失败:", error);
      toast.error("特征注册失败");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = (record: FeatureRegistryItem) => {
    router.push(`/categories/data-platform/feature-quality/feature-registry-detail?id=${record.id}`);
  };

  const handleEdit = (record: FeatureRegistryItem) => {
    router.push(`/categories/data-platform/feature-quality/feature-registry-edit?id=${record.id}`);
  };

  const handleToggleStatus = (record: FeatureRegistryItem) => {
    const nextStatus: FeatureStatus = record.status === "启用" ? "停用" : "启用";
    const confirmText = record.status === "启用" ? "停用" : "启用";
    if (!confirm(`确定要${confirmText}特征 "${record.featureName}" 吗？`)) {
      return;
    }
    setAllData((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? { ...item, status: nextStatus, updateTime: new Date().toISOString().slice(0, 19).replace("T", " ") }
          : item
      )
    );
    toast.success(`特征已${confirmText}`);
  };

  const handleDelete = (record: FeatureRegistryItem) => {
    if (!confirm(`确定删除特征 "${record.featureName}"?`)) return;
    setAllData((prev) => prev.filter((item) => item.id !== record.id));
    toast.success("特征删除成功");
  };

  const stats = useMemo(() => {
    const total = allData.length;
    const enabled = allData.filter((item) => item.status === "启用").length;
    const highReuse = allData.filter((item) => item.reuseCount >= 10).length;
    const avgReuse =
      total === 0 ? 0 : Math.round((allData.reduce((sum, item) => sum + item.reuseCount, 0) / total) * 10) / 10;
    return { total, enabled, highReuse, avgReuse };
  }, [allData]);

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    allData.forEach((item) => {
      map.set(item.featureType, (map.get(item.featureType) || 0) + 1);
    });
    return featureTypeOptions.map((opt) => ({
      label: opt.label,
      value: map.get(opt.value) || 0
    }));
  }, [allData]);

  const computeModeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    allData.forEach((item) => {
      map.set(item.computeMode, (map.get(item.computeMode) || 0) + 1);
    });
    return computeModeOptions.map((opt) => ({
      label: opt.label,
      value: map.get(opt.value) || 0
    }));
  }, [allData]);

  const topReuseFeatures = useMemo(
    () => [...allData].sort((a, b) => b.reuseCount - a.reuseCount).slice(0, 5),
    [allData]
  );

  const columns: Column<FeatureRegistryItem>[] = [
    {
      key: "featureName",
      title: "特征名称",
      width: 200,
      render: (value: unknown, record) => (
        <div className="space-y-1">
          <div className="font-medium text-slate-900">{String(value)}</div>
          <div className="text-xs text-slate-500">{record.featureCode}</div>
        </div>
      )
    },
    {
      key: "businessDomain",
      title: "业务域",
      width: 100
    },
    {
      key: "featureType",
      title: "类型",
      width: 110,
      render: (value: unknown) => <MdBadge variant="secondary">{String(value)}</MdBadge>
    },
    {
      key: "computeMode",
      title: "计算方式",
      width: 110,
      render: (value: unknown) => (
        <MdBadge variant={value === "实时" ? "success" : "outline"}>{String(value)}</MdBadge>
      )
    },
    {
      key: "owner",
      title: "特征负责人",
      width: 120
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
      key: "reuseCount",
      title: "复用次数",
      width: 100,
      render: (value: unknown) => (
        <div className="flex items-center gap-1 text-amber-600">
          <Flame className="h-4 w-4" />
          {String(value)}
        </div>
      )
    },
    {
      key: "lastUsedTime",
      title: "最近复用",
      width: 150
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
      render: (_: unknown, record: FeatureRegistryItem) => (
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
      {!showList && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">特征库概况</h1>
              <p className="text-sm text-muted-foreground mt-1">
                沉淀 AI 特征资产，掌握复用热度与实时离线覆盖情况。
              </p>
            </div>
            <MdButton leftIcon={<Layers className="h-4 w-4" />} onClick={() => setShowList(true)}>
              查看特征库列表
            </MdButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MdCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">特征总量</div>
                  <div className="text-2xl font-semibold">{stats.total}</div>
                </div>
              </div>
            </MdCard>
            <MdCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Layers className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">启用特征</div>
                  <div className="text-2xl font-semibold">{stats.enabled}</div>
                </div>
              </div>
            </MdCard>
            <MdCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Activity className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">高频复用</div>
                  <div className="text-2xl font-semibold">
                    {stats.highReuse} / Avg {stats.avgReuse}
                  </div>
                </div>
              </div>
            </MdCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MdCard className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">按特征类型分布</h3>
                <span className="text-xs text-muted-foreground">单位：条</span>
              </div>
              <div className="space-y-3">
                {typeDistribution.map((item) => {
                  const maxValue = Math.max(...typeDistribution.map((t) => t.value), 1);
                  const percent = Math.round((item.value / maxValue) * 100);
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </MdCard>
            <MdCard className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">实时 vs 离线</h3>
                <span className="text-xs text-muted-foreground">单位：条</span>
              </div>
              <div className="space-y-3">
                {computeModeDistribution.map((item) => {
                  const total = computeModeDistribution.reduce((sum, cur) => sum + cur.value, 0) || 1;
                  const percent = Math.round((item.value / total) * 100);
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <MdBadge variant={item.label === "实时" ? "success" : "outline"}>{percent}%</MdBadge>
                      </div>
                      <div className="text-sm font-semibold">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </MdCard>
          </div>

          <MdCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">复用分析 Top 5</h3>
              <span className="text-xs text-muted-foreground">聚焦高频复用特征</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {topReuseFeatures.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="text-sm font-medium text-slate-900">{item.featureName}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.featureCode}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <MdBadge variant={item.status === "启用" ? "success" : "danger"}>{item.status}</MdBadge>
                    <div className="text-sm text-amber-600 flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      {item.reuseCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MdCard>
        </div>
      )}

      {showList && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MdButton variant="outline" onClick={() => setShowList(false)}>
              返回概况
            </MdButton>
            <h2 className="text-xl font-semibold text-slate-900">特征库列表</h2>
          </div>

          <MdCard className="p-4 space-y-3 bg-white rounded-xl border border-border shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex-1">
                <MdInput
                  placeholder="搜索特征名称/编码"
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
                placeholder="业务域"
                value={filters.businessDomain}
                onChange={(value) => setFilters((prev) => ({ ...prev, businessDomain: value as string }))}
                options={businessDomainOptions}
              />
              <MdSelect
                placeholder="特征类型"
                value={filters.featureType}
                onChange={(value) => setFilters((prev) => ({ ...prev, featureType: value as string }))}
                options={featureTypeOptions}
              />
              <MdSelect
                placeholder="计算方式"
                value={filters.computeMode}
                onChange={(value) => setFilters((prev) => ({ ...prev, computeMode: value as string }))}
                options={computeModeOptions}
              />
              <MdSelect
                placeholder="状态"
                value={filters.status}
                onChange={(value) => setFilters((prev) => ({ ...prev, status: value as string }))}
                options={statusOptions}
              />
              <MdInput
                placeholder="负责人"
                value={filters.owner}
                onChange={(e) => setFilters((prev) => ({ ...prev, owner: e.target.value }))}
              />
            </div>
          </MdCard>

          {/* 批量操作：列表上方、查询项下方 */}
          <div className="flex items-center gap-2">
            <MdButton onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
              特征注册
            </MdButton>
          </div>

          <MdCard className="p-0 overflow-hidden bg-white rounded-xl border border-border shadow-sm">
            <MdTable<FeatureRegistryItem>
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
      )}

      {/* 特征注册抽屉 */}
      <MdDrawer open={showDrawer} onClose={() => setShowDrawer(false)} title="特征注册" width={640}>
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <MdInput
              label="特征名称 *"
              placeholder="请输入特征名称"
              value={formData.featureName}
              onChange={(e) => setFormData((prev) => ({ ...prev, featureName: e.target.value }))}
            />
            <MdInput
              label="特征编码 *"
              placeholder="请输入特征编码"
              value={formData.featureCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, featureCode: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MdSelect
              label="特征类型"
              placeholder="请选择"
              value={formData.featureType}
              onChange={(value) => setFormData((prev) => ({ ...prev, featureType: value as FeatureType }))}
              options={featureTypeOptions}
            />
            <MdSelect
              label="计算方式"
              placeholder="请选择"
              value={formData.computeMode}
              onChange={(value) => setFormData((prev) => ({ ...prev, computeMode: value as FeatureComputeMode }))}
              options={computeModeOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MdSelect
              label="业务域 *"
              placeholder="请选择"
              value={formData.businessDomain}
              onChange={(value) => setFormData((prev) => ({ ...prev, businessDomain: value as string }))}
              options={businessDomainOptions}
            />
            <MdSelect
              label="数据来源 *"
              placeholder="请选择"
              value={formData.dataSource}
              onChange={(value) => setFormData((prev) => ({ ...prev, dataSource: value as string }))}
              options={dataSourceOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MdInput
              label="特征负责人"
              placeholder="请输入负责人"
              value={formData.owner}
              onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
            />
            <MdInput
              label="数据负责人"
              placeholder="请输入数据负责人"
              value={formData.dataOwner}
              onChange={(e) => setFormData((prev) => ({ ...prev, dataOwner: e.target.value }))}
            />
          </div>
          <MdInput
            label="落表/视图"
            placeholder="请输入特征落表/视图"
            value={formData.storageTable}
            onChange={(e) => setFormData((prev) => ({ ...prev, storageTable: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">特征描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="请输入特征业务含义"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">计算逻辑</label>
            <textarea
              value={formData.computeLogic}
              onChange={(e) => setFormData((prev) => ({ ...prev, computeLogic: e.target.value }))}
              rows={3}
              placeholder="示例：avg(flow, 7d) / stddev(flow, 7d)"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <MdInput
            label="标签"
            placeholder="用逗号分隔多个标签"
            value={formData.tags}
            onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          />
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
