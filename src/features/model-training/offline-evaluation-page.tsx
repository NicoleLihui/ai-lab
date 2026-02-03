"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, RotateCcw, BarChart3, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, X } from "lucide-react";
import { MdInput, MdButton, MdTable, MdCard, MdBadge } from "@/components/enterprise-ui";
import type { Column } from "@/components/enterprise-ui";
import { toast } from "sonner";

// 定义离线评估数据类型
interface OfflineEvaluationItem {
  id: string;
  taskName: string;
  modelName: string;
  modelId: string;
  version: string;
  modelType: string;
  developLanguage: string;
  statusName: string;
  evalStartTime: string;
  evalEndTime: string;
  evaluateIndexData?: Record<string, any>;
  createTime: string;
  duration: number; // 评估持续时间（分钟）
}

// Mock数据
const mockOfflineEvaluationData: OfflineEvaluationItem[] = [
  {
    id: "1",
    taskName: "水质预测模型离线评估_v1.0",
    modelName: "WaterQualityPredictor",
    modelId: "model_001",
    version: "1.0.0",
    modelType: "回归模型",
    developLanguage: "Python",
    statusName: "评估完成",
    evalStartTime: "2026-01-10 10:00:00",
    evalEndTime: "2026-01-10 12:30:00",
    duration: 150,
    evaluateIndexData: {
      "准确率": "92.5%",
      "召回率": "89.3%",
      "F1分数": "90.8%"
    },
    createTime: "2026-01-10 14:30:25"
  },
  {
    id: "2",
    taskName: "污泥浓度识别模型离线评估_v2.1",
    modelName: "SludgeConcentrationClassifier",
    modelId: "model_002",
    version: "2.1.3",
    modelType: "分类模型",
    developLanguage: "Python",
    statusName: "评估中",
    evalStartTime: "2026-01-12 09:15:00",
    evalEndTime: "2026-01-12 11:45:00",
    duration: 150,
    evaluateIndexData: {
      "准确率": "94.2%",
      "精确率": "92.8%",
      "召回率": "95.1%"
    },
    createTime: "2026-01-12 09:15:42"
  },
  {
    id: "3",
    taskName: "COD去除率优化模型离线评估",
    modelName: "CODOptimizationModel",
    modelId: "model_003",
    version: "1.2.0",
    modelType: "强化学习",
    developLanguage: "Python",
    statusName: "待评估",
    evalStartTime: "",
    evalEndTime: "",
    duration: 0,
    createTime: "2026-01-13 16:45:18"
  },
  {
    id: "4",
    taskName: "曝气池溶解氧预测离线评估",
    modelName: "DOPredictionModel",
    modelId: "model_004",
    version: "3.0.1",
    modelType: "时间序列",
    developLanguage: "R",
    statusName: "评估完成",
    evalStartTime: "2026-01-08 08:00:00",
    evalEndTime: "2026-01-08 10:15:00",
    duration: 135,
    evaluateIndexData: {
      "MAPE": "8.3%",
      "RMSE": "0.22"
    },
    createTime: "2026-01-08 11:20:33"
  },
  {
    id: "5",
    taskName: "污水处理厂能耗预测离线评估",
    modelName: "EnergyConsumptionForecaster",
    modelId: "model_005",
    version: "1.5.2",
    modelType: "深度学习",
    developLanguage: "Python",
    statusName: "评估失败",
    evalStartTime: "2026-01-11 14:00:00",
    evalEndTime: "2026-01-11 14:30:00",
    duration: 30,
    createTime: "2026-01-11 13:42:17"
  },
  {
    id: "6",
    taskName: "出水氨氮浓度监测离线评估",
    modelName: "AmmoniaMonitor",
    modelId: "model_006",
    version: "2.0.0",
    modelType: "异常检测",
    developLanguage: "Python",
    statusName: "评估完成",
    evalStartTime: "2026-01-09 15:00:00",
    evalEndTime: "2026-01-09 16:45:00",
    duration: 105,
    evaluateIndexData: {
      "准确率": "96.7%",
      "误报率": "2.1%"
    },
    createTime: "2026-01-09 15:30:45"
  }
];

// 分页配置常量
const TABLE_LIST_PAGE_RANGE = [10, 20, 50, 100];

export function OfflineEvaluationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<OfflineEvaluationItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  
  // 抽屉状态
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  
  // 当前选中的项目
  const [currentItem, setCurrentItem] = useState<OfflineEvaluationItem | null>(null);

  const { current: currentPage, pageSize } = pagination;

  // 加载数据
  const loadData = useCallback(async (page = currentPage, size = pageSize, query = searchQuery) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟数据过滤和分页
      let filteredData = [...mockOfflineEvaluationData];
      
      // 搜索过滤
      if (query) {
        const searchLower = query.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.modelName.toLowerCase().includes(searchLower) ||
          item.taskName.toLowerCase().includes(searchLower)
        );
      }

      // 分页
      const total = filteredData.length;
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setTableData(paginatedData);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: total,
      }));
    } catch (error) {
      console.error("加载数据失败:", error);
      toast.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleSearch = () => {
    loadData(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    loadData(1, pagination.pageSize, "");
  };

  // 定义表格列
  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center" as const,
      render: (_: unknown, __: Record<string, unknown>, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "modelName",
      title: "模型名称",
      width: 140,
      align: "center" as const,
      render: (value: unknown, row: Record<string, unknown>) => (
        <div className="text-left">
          <div className="font-medium">{row.modelName as string}</div>
          <div className="text-xs text-muted-foreground">ID: {row.modelId as string}</div>
        </div>
      )
    },
    {
      key: "modelType",
      title: "模型类型",
      width: 150,
      align: "center" as const,
      render: (value: unknown) => (
        <MdBadge variant="secondary">{value as string}</MdBadge>
      )
    },
    {
      key: "version",
      title: "版本号",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => (
        <span className="font-mono">{value as string}</span>
      )
    },
    {
      key: "evalStartTime",
      title: "评估开始时间",
      width: 160,
      align: "center" as const,
    },
    {
      key: "evalEndTime",
      title: "评估结束时间",
      width: 160,
      align: "center" as const,
    },
    {
      key: "duration",
      title: "评估时长(分钟)",
      width: 120,
      align: "center" as const,
      render: (value: unknown) => {
        const duration = Number(value) || 0;
        return <span className="font-medium">{duration}</span>;
      }
    },
    {
      key: "evaluateIndexData",
      title: "核心评估指标",
      align: "center" as const,
      render: (value: unknown) => {
        if (!value || typeof value !== 'object') return "-";
        
        const metrics = Object.entries(value as Record<string, string>)
          .slice(0, 3) // 只显示前3个指标
          .map(([key, val]) => `${key}: ${val}`)
          .join(", ");
        
        return (
          <div className="text-left">
            <div className="text-xs">{metrics}</div>
            {Object.keys(value as Record<string, string>).length > 3 && (
              <div className="text-xs text-muted-foreground">+{Object.keys(value as Record<string, string>).length - 3} 更多</div>
            )}
          </div>
        );
      }
    },
    {
      key: "statusName",
      title: "状态",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => {
        const status = String(value);
        let variant: "success" | "warning" | "danger" | "info" | "secondary" = "secondary";
        if (status === "评估完成") variant = "success";
        if (status === "评估中") variant = "info";
        if (status === "待评估") variant = "warning";
        if (status === "评估失败") variant = "danger";
        return <MdBadge variant={variant}>{status}</MdBadge>;
      }
    },
    {
      key: "actions",
      title: "操作",
      width: 100,
      align: "center" as const,
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center justify-center gap-2">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleDetail(row)}
          >
            详情
          </MdButton>
        </div>
      ),
    },
  ];

  // 操作处理函数
  const handleDetail = (row: Record<string, unknown>) => {
    const item = row as unknown as OfflineEvaluationItem;
    setCurrentItem(item);
    setDetailDrawerOpen(true);
  };
  
  // 关闭抽屉函数
  const closeDetailDrawer = () => {
    setDetailDrawerOpen(false);
    setCurrentItem(null);
  };

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-4 gap-3">
      <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索模型名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            leftIcon={<Search className="h-4 w-4" />}
            className="h-9"
          />
        </div>
        <MdButton
          onClick={handleSearch}
          leftIcon={<Search className="h-4 w-4" />}
          className="h-9 px-3"
        >
          查询
        </MdButton>
        <MdButton
          variant="outline"
          onClick={handleReset}
          leftIcon={<RotateCcw className="h-4 w-4" />}
          className="h-9 px-3"
        >
          重置
        </MdButton>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable
          columns={columns}
          data={tableData as any}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, size) => loadData(page, size),
          }}
          className="h-full"
        />
      </div>
      
      {/* 抽屉组件 - 详情 */}
      {detailDrawerOpen && currentItem && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={closeDetailDrawer} />
          <div className="relative ml-auto h-full w-[600px] bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="text-lg font-semibold text-foreground">
                离线评估详情
              </div>
              <MdButton variant="text" size="sm" onClick={closeDetailDrawer}>
                <X className="h-4 w-4" />
              </MdButton>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <MdCard className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">模型名称</h4>
                      <p>{currentItem.modelName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">模型ID</h4>
                      <p>{currentItem.modelId}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">模型类型</h4>
                      <p>{currentItem.modelType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">版本号</h4>
                      <p>{currentItem.version}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">开发语言</h4>
                      <p>{currentItem.developLanguage}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">状态</h4>
                      <p>{currentItem.statusName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">评估开始时间</h4>
                      <p>{currentItem.evalStartTime || '-'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">评估结束时间</h4>
                      <p>{currentItem.evalEndTime || '-'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">评估时长(分钟)</h4>
                      <p>{currentItem.duration}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">创建时间</h4>
                      <p>{currentItem.createTime}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">核心评估指标</h4>
                      <div className="mt-1 space-y-1">
                        {currentItem.evaluateIndexData ? (
                          Object.entries(currentItem.evaluateIndexData).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">暂无评估指标</p>
                        )}
                      </div>
                    </div>
                  </div>
                </MdCard>
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end gap-2">
              <MdButton variant="outline" onClick={closeDetailDrawer}>关闭</MdButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}