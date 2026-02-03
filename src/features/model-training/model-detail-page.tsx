"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, BarChart3, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, X } from "lucide-react";
import { MdInput, MdButton, MdTable, MdCard, MdBadge } from "@/components/enterprise-ui";
import type { Column } from "@/components/enterprise-ui";
import { toast } from "sonner";

// 定义模型详情数据类型
interface ModelDetailItem {
  id: string;
  modelId: string;
  modelName: string;
  modelType: string;
  notes: string;
  paramInStr: string;
  paramOutStr: string;
  applicableScenario: string;
  paramEva: string;
  releaseStatus: string;
  deploymentStatus: string;
  createTime: string;
  version: string;
  updateTime: string;
}

// Mock数据
const mockModelDetails: ModelDetailItem[] = [
  {
    id: "1",
    modelId: "MLM001",
    modelName: "水质预测模型",
    modelType: "回归模型",
    notes: "用于预测水质各项指标",
    paramInStr: "温度, PH值, 浊度",
    paramOutStr: "COD, BOD, 氨氮",
    applicableScenario: "污水处理",
    paramEva: "RMSE: 0.15, MAE: 0.08",
    releaseStatus: "未发布",
    deploymentStatus: "已部署",
    createTime: "2026-01-10 14:30:25",
    version: "1.0.0",
    updateTime: "2026-01-10 15:45:12"
  },
  {
    id: "2",
    modelId: "MLM002",
    modelName: "污泥浓度识别模型",
    modelType: "分类模型",
    notes: "自动识别污泥浓度水平",
    paramInStr: "浊度, 颜色, 粘度",
    paramOutStr: "浓度等级",
    applicableScenario: "污泥处理",
    paramEva: "准确率: 94.2%, 召回率: 95.1%",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2026-01-12 09:15:42",
    version: "2.1.3",
    updateTime: "2026-01-12 10:20:30"
  },
  {
    id: "3",
    modelId: "MLM003",
    modelName: "COD去除率优化模型",
    modelType: "强化学习",
    notes: "优化COD去除效率",
    paramInStr: "进水COD, pH, 温度",
    paramOutStr: "最优参数",
    applicableScenario: "工艺优化",
    paramEva: "提升率: 15.2%",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    createTime: "2026-01-13 16:45:18",
    version: "1.2.0",
    updateTime: "2026-01-13 17:10:05"
  },
  {
    id: "4",
    modelId: "MLM004",
    modelName: "曝气池溶解氧预测",
    modelType: "时间序列",
    notes: "预测曝气池溶解氧浓度",
    paramInStr: "时间, 温度, 水量",
    paramOutStr: "溶解氧值",
    applicableScenario: "曝气控制",
    paramEva: "MAPE: 8.3%, RMSE: 0.22",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2026-01-08 11:20:33",
    version: "3.0.1",
    updateTime: "2026-01-08 12:15:45"
  },
  {
    id: "5",
    modelId: "MLM005",
    modelName: "污水处理厂能耗预测",
    modelType: "深度学习",
    notes: "预测处理厂整体能耗",
    paramInStr: "处理量, 工艺参数",
    paramOutStr: "能耗值",
    applicableScenario: "能耗管理",
    paramEva: "R²: 0.89, MAE: 2.1",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    createTime: "2026-01-11 13:42:17",
    version: "1.5.2",
    updateTime: "2026-01-11 14:30:22"
  },
  {
    id: "6",
    modelId: "MLM006",
    modelName: "出水氨氮浓度监测",
    modelType: "异常检测",
    notes: "实时监测氨氮超标",
    paramInStr: "氨氮值, 时间, 温度",
    paramOutStr: "异常标志",
    applicableScenario: "水质监控",
    paramEva: "准确率: 96.7%, 误报率: 2.1%",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2026-01-09 15:30:45",
    version: "2.0.0",
    updateTime: "2026-01-09 16:25:18"
  }
];

// 分页配置常量
const TABLE_LIST_PAGE_RANGE = [10, 20, 50, 100];

export function ModelDetailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<ModelDetailItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const { current: currentPage, pageSize } = pagination;

  // 加载数据
  const loadData = async (page = currentPage, size = pageSize, query = searchQuery) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟数据过滤和分页
      let filteredData = [...mockModelDetails];
      
      // 搜索过滤
      if (query) {
        const searchLower = query.toLowerCase();
        filteredData = filteredData.filter(model => 
          model.modelName.toLowerCase().includes(searchLower) ||
          model.modelId.toLowerCase().includes(searchLower)
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
  };

  useEffect(() => {
    loadData(1);
  }, []);

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
      key: "modelId",
      title: "模型ID",
      align: "center" as const,
      width: 120,
    },
    {
      key: "modelName",
      title: "模型名称",
      align: "center" as const,
      width: 120,
    },
    {
      key: "modelType",
      title: "分类",
      align: "center" as const,
      width: 120,
    },
    {
      key: "notes",
      title: "功能描述",
      align: "center" as const,
      width: 120,
    },
    {
      key: "paramInStr",
      title: "输入参数",
      align: "center" as const,
      width: 120,
    },
    {
      key: "paramOutStr",
      title: "输出参数",
      align: "center" as const,
      width: 120,
    },
    {
      key: "applicableScenario",
      title: "应用场景",
      align: "center" as const,
      width: 120,
    },
    {
      key: "paramEva",
      title: "评估指标",
      align: "center" as const,
      width: 120,
    },
    {
      key: "releaseStatus",
      title: "发布状态",
      align: "center" as const,
      width: 120,
    },
    {
      key: "deploymentStatus",
      title: "部署状态",
      align: "center" as const,
      width: 120,
    },
    {
      key: "createTime",
      title: "创建时间",
      align: "center" as const,
      width: 120,
    },
    {
      key: "version",
      title: "当前版本",
      align: "center" as const,
      width: 80,
    },
    {
      key: "updateTime",
      title: "更新时间",
      align: "center" as const,
      width: 120,
    },
    {
      key: "actions",
      title: "操作",
      width: 120,
      align: "center" as const,
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center justify-center gap-1">
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

  const handleDetail = (row: Record<string, unknown>) => {
    console.log('查看详情:', row);
    toast.info(`查看模型 "${row.modelName}" 详情`);
  };

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-4 gap-3">
      <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索模型名称、模型ID"
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
    </div>
  );
}