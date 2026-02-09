"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Eye, X, Plus, RotateCcw, Search } from "lucide-react";
import { MdButton, MdCard, MdBadge, type SelectOption } from "@/components/enterprise-ui";
import { MdInput } from "@/components/enterprise-ui/md-input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 定义指标数据类型
interface IndicatorData {
  metricStr: string; // 指标名称
  base: number; // 应用前均值
  applied: number; // 应用期均值
  rate: string; // 变化率
}

// 定义模型数据类型
interface ModelData {
  id: string;
  modelName: string; // 模型名称
  modelType: string; // 模型类型
  version: string; // 版本号
  lastEvaluationTime: string; // 最后一次评估时间
  evaluationCount: number; // 评估次数
  summaryData: IndicatorData[]; // 核心评估指标列表
}

// 定义评估任务数据类型
interface EvaluationTask {
  id: string;
  taskId: string; // 任务ID
  modelId: string; // 关联的模型ID
  dataset: string; // 使用的数据集（单个）
  evaluationTime: string; // 评估时间
  status: "completed" | "running" | "failed"; // 任务状态
  metrics: IndicatorData[]; // 评估指标结果
  duration: string; // 评估耗时
}

// Mock评估任务数据
const mockEvaluationTasks: EvaluationTask[] = [
  {
    id: "task-1",
    taskId: "TASK-20241215001",
    modelId: "model-1",
    dataset: "2024年Q1生产数据集",
    evaluationTime: "2024-12-15 14:30:00",
    status: "completed",
    duration: "2分35秒",
    metrics: [
      { metricStr: "R² Score (拟合度)", base: 0.7523, applied: 0.8916, rate: "+18.5%" },
      { metricStr: "MAE (平均绝对误差)", base: 12.56, applied: 8.34, rate: "-33.6%" },
      { metricStr: "RMAE (相对误差率)", base: 0.1523, applied: 0.0987, rate: "-35.2%" }
    ]
  },
  {
    id: "task-2",
    taskId: "TASK-20241210001",
    modelId: "model-1",
    dataset: "2024年Q2生产数据集",
    evaluationTime: "2024-12-10 09:20:00",
    status: "completed",
    duration: "1分48秒",
    metrics: [
      { metricStr: "R² Score (拟合度)", base: 0.7434, applied: 0.8845, rate: "+19.0%" },
      { metricStr: "MAE (平均绝对误差)", base: 13.12, applied: 8.76, rate: "-33.2%" },
      { metricStr: "RMSE (均方根误差)", base: 16.78, applied: 11.23, rate: "-33.1%" }
    ]
  },
  {
    id: "task-3",
    taskId: "TASK-20241208001",
    modelId: "model-1",
    dataset: "2024年Q3生产数据集",
    evaluationTime: "2024-12-08 16:45:00",
    status: "completed",
    duration: "3分12秒",
    metrics: [
      { metricStr: "R² Score (拟合度)", base: 0.7612, applied: 0.9034, rate: "+18.7%" },
      { metricStr: "MAE (平均绝对误差)", base: 11.89, applied: 7.92, rate: "-33.4%" },
      { metricStr: "RMAE (相对误差率)", base: 0.1489, applied: 0.0956, rate: "-35.8%" }
    ]
  },
  {
    id: "task-4",
    taskId: "TASK-20241205001",
    modelId: "model-1",
    dataset: "历史验证数据集_v1",
    evaluationTime: "2024-12-05 11:20:00",
    status: "failed",
    duration: "0分45秒",
    metrics: []
  },
  {
    id: "task-5",
    taskId: "TASK-20241212001",
    modelId: "model-2",
    dataset: "2024年Q2生产数据集",
    evaluationTime: "2024-12-12 15:30:00",
    status: "completed",
    duration: "2分18秒",
    metrics: [
      { metricStr: "R² Score (拟合度)", base: 0.8134, applied: 0.9245, rate: "+13.7%" },
      { metricStr: "MAE (平均绝对误差)", base: 15.23, applied: 9.87, rate: "-35.2%" },
      { metricStr: "RMSE (均方根误差)", base: 18.45, applied: 12.36, rate: "-33.0%" }
    ]
  },
  {
    id: "task-6",
    taskId: "TASK-20241214001",
    modelId: "model-3",
    dataset: "2024年Q1生产数据集",
    evaluationTime: "2024-12-14 10:15:00",
    status: "running",
    duration: "进行中",
    metrics: []
  }
];

// Mock数据
const mockModelData: ModelData[] = [
  {
    id: "model-1",
    modelName: "智能调度优化模型",
    modelType: "机器学习",
    version: "v2.1.0",
    lastEvaluationTime: "2024-12-15 14:30:00",
    evaluationCount: 12,
    summaryData: [
      {
        metricStr: "R² Score (拟合度)",
        base: 0.7523,
        applied: 0.8916,
        rate: "+18.5%"
      },
      {
        metricStr: "MAE (平均绝对误差)",
        base: 12.56,
        applied: 8.34,
        rate: "-33.6%"
      },
      {
        metricStr: "RMAE (相对误差率)",
        base: 0.1523,
        applied: 0.0987,
        rate: "-35.2%"
      }
    ]
  },
  {
    id: "model-2",
    modelName: "水质预测深度学习模型",
    modelType: "深度学习",
    version: "v1.8.5",
    lastEvaluationTime: "2024-12-10 09:20:00",
    evaluationCount: 8,
    summaryData: [
      {
        metricStr: "R² Score (拟合度)",
        base: 0.8134,
        applied: 0.9245,
        rate: "+13.7%"
      },
      {
        metricStr: "MAE (平均绝对误差)",
        base: 15.23,
        applied: 9.87,
        rate: "-35.2%"
      },
      {
        metricStr: "RMSE (均方根误差)",
        base: 18.45,
        applied: 12.36,
        rate: "-33.0%"
      }
    ]
  },
  {
    id: "model-3",
    modelName: "设备故障预测模型",
    modelType: "机器学习",
    version: "v3.0.2",
    lastEvaluationTime: "2024-12-08 16:45:00",
    evaluationCount: 15,
    summaryData: [
      {
        metricStr: "R² Score (拟合度)",
        base: 0.6987,
        applied: 0.8256,
        rate: "+18.2%"
      },
      {
        metricStr: "MAE (平均绝对误差)",
        base: 22.15,
        applied: 14.23,
        rate: "-35.8%"
      },
      {
        metricStr: "RMAE (相对误差率)",
        base: 0.2156,
        applied: 0.1345,
        rate: "-37.6%"
      }
    ]
  },
  {
    id: "model-4",
    modelName: "智能加药优化模型",
    modelType: "机器学习",
    version: "v1.5.3",
    lastEvaluationTime: "2024-12-05 11:20:00",
    evaluationCount: 6,
    summaryData: [
      {
        metricStr: "R² Score (拟合度)",
        base: 0.8156,
        applied: 0.9023,
        rate: "+10.6%"
      },
      {
        metricStr: "MAE (平均绝对误差)",
        base: 9.87,
        applied: 6.54,
        rate: "-33.7%"
      },
      {
        metricStr: "RMAE (相对误差率)",
        base: 0.1123,
        applied: 0.0745,
        rate: "-33.7%"
      }
    ]
  },
  {
    id: "model-5",
    modelName: "污泥处理预测模型",
    modelType: "深度学习",
    version: "v2.3.1",
    lastEvaluationTime: "2024-11-28 10:15:00",
    evaluationCount: 10,
    summaryData: [
      {
        metricStr: "R² Score (拟合度)",
        base: 0.7234,
        applied: 0.8845,
        rate: "+22.3%"
      },
      {
        metricStr: "MAE (平均绝对误差)",
        base: 18.92,
        applied: 11.45,
        rate: "-39.5%"
      },
      {
        metricStr: "RMSE (均方根误差)",
        base: 23.56,
        applied: 14.23,
        rate: "-39.6%"
      },
      {
        metricStr: "RMAE (相对误差率)",
        base: 0.1876,
        applied: 0.1134,
        rate: "-39.6%"
      }
    ]
  }
];

export function BenefitEvaluationPage() {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<ModelData[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 搜索表单数据
  const [formData, setFormData] = useState({
    modelName: "",
    modelType: "",
  });

  // 模型类型下拉选项
  const [modelTypeOptions] = useState<SelectOption[]>([
    { value: "机器学习", label: "机器学习" },
    { value: "深度学习", label: "深度学习" },
  ]);

  // 弹窗状态
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelData | null>(null);
  const [isShowCreateDrawer, setIsShowCreateDrawer] = useState(false);

  // 评估任务列表状态
  const [evaluationTasks, setEvaluationTasks] = useState<EvaluationTask[]>([]);
  const [taskPagination, setTaskPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // 新建评估任务表单状态
  const [selectedModel, setSelectedModel] = useState("");
  const [datasetTab, setDatasetTab] = useState<"existing" | "new">("existing");
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [customMetrics, setCustomMetrics] = useState<string[]>([]);
  const [customMetricInput, setCustomMetricInput] = useState("");

  // 评估模型选项
  const [modelOptions] = useState<SelectOption[]>([
    { value: "model-1", label: "智能调度优化模型 v2.1.0" },
    { value: "model-2", label: "水质预测深度学习模型 v1.8.5" },
    { value: "model-3", label: "设备故障预测模型 v3.0.2" },
    { value: "model-4", label: "智能加药优化模型 v1.5.3" },
    { value: "model-5", label: "污泥处理预测模型 v2.3.1" },
  ]);

  // 数据集选项
  const [datasetOptions] = useState<SelectOption[]>([
    { value: "dataset-1", label: "2024年Q1生产数据集" },
    { value: "dataset-2", label: "2024年Q2生产数据集" },
    { value: "dataset-3", label: "2024年Q3生产数据集" },
    { value: "dataset-4", label: "历史验证数据集_v1" },
  ]);

  // 默认评估指标
  const defaultMetrics = ["R² Score (拟合度)", "MAE (平均绝对误差)", "RMAE (相对误差率)"];

  // 添加自定义指标
  const handleAddMetric = () => {
    if (customMetricInput.trim() && !customMetrics.includes(customMetricInput.trim())) {
      setCustomMetrics([...customMetrics, customMetricInput.trim()]);
      setCustomMetricInput("");
    }
  };

  // 删除自定义指标
  const handleRemoveMetric = (metric: string) => {
    setCustomMetrics(customMetrics.filter((m) => m !== metric));
  };

  // 重置为默认指标
  const handleResetMetrics = () => {
    setCustomMetrics([]);
  };

  // 加载数据（带过滤条件）
  const loadDataWithFilters = useCallback(async (
    page: number,
    size: number,
    filters: { modelName: string; modelType: string }
  ) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 模拟数据过滤
      let filteredData = mockModelData.filter((item) => {
        if (filters.modelName && !item.modelName.includes(filters.modelName)) return false;
        if (filters.modelType && item.modelType !== filters.modelType) return false;
        return true;
      });

      const total = filteredData.length;
      const startIndex = (page - 1) * size;
      const endIndex = Math.min(startIndex + size, total);
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setTableData(paginatedData);
      setPagination((prev) => ({
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
  }, []);

  // 加载数据（使用当前 formData）
  const loadData = useCallback(async (page = pagination.current, size = pagination.pageSize) => {
    await loadDataWithFilters(page, size, formData);
  }, [formData, loadDataWithFilters]);

  useEffect(() => {
    loadDataWithFilters(1, pagination.pageSize, formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 搜索
  const handleSearch = (data: Record<string, any>) => {
    const newFormData = {
      modelName: data.modelName || "",
      modelType: data.modelType || "",
    };
    setFormData(newFormData);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadDataWithFilters(1, pagination.pageSize, newFormData);
  };

  // 重置
  const handleReset = () => {
    const newFormData = {
      modelName: "",
      modelType: "",
    };
    setFormData(newFormData);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadDataWithFilters(1, pagination.pageSize, newFormData);
  };

  // 分页变化
  const handlePageChange = (page: number, size: number) => {
    loadData(page, size);
  };

  // 详情
  const handleDetail = (model: ModelData) => {
    setCurrentModel(model);
    // 加载该模型的评估任务
    const modelTasks = mockEvaluationTasks.filter(task => task.modelId === model.id);
    setEvaluationTasks(modelTasks);
    setTaskPagination({
      current: 1,
      pageSize: 5,
      total: modelTasks.length,
    });
    setIsShowDetail(true);
  };

  // 关闭详情弹窗
  const handleCloseDetail = () => {
    setIsShowDetail(false);
    setCurrentModel(null);
    setEvaluationTasks([]);
  };

  // 打开新建抽屉
  const handleOpenCreateDrawer = () => {
    setIsShowCreateDrawer(true);
  };

  // 关闭新建抽屉
  const handleCloseCreateDrawer = () => {
    setIsShowCreateDrawer(false);
    // 重置表单状态
    setSelectedModel("");
    setDatasetTab("existing");
    setSelectedDatasets([]);
    setCustomMetrics([]);
    setCustomMetricInput("");
  };

  // 处理数据集多选
  const handleDatasetToggle = (datasetValue: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(datasetValue)
        ? prev.filter((v) => v !== datasetValue)
        : [...prev, datasetValue]
    );
  };

  // 全选/取消全选数据集
  const handleToggleAllDatasets = () => {
    if (selectedDatasets.length === datasetOptions.length) {
      setSelectedDatasets([]);
    } else {
      setSelectedDatasets(datasetOptions.map((opt) => opt.value));
    }
  };

  // 提交新建评估任务（批量创建）
  const handleSubmitCreateTask = () => {
    // 验证表单
    if (!selectedModel) {
      toast.error("请选择评估模型");
      return;
    }
    if (selectedDatasets.length === 0 && datasetTab === "existing") {
      toast.error("请至少选择一个数据集");
      return;
    }

    // 模拟批量创建任务
    const allMetrics = [...defaultMetrics, ...customMetrics];
    const taskCount = selectedDatasets.length;
    const datasetNames = selectedDatasets.map(value =>
      datasetOptions.find(opt => opt.value === value)?.label
    ).join("、");

    toast.success(
      `✓ 成功批量创建 ${taskCount} 个评估任务` +
      `\n数据集：${datasetNames}` +
      `\n每个任务包含 ${allMetrics.length} 个评估指标`,
      { duration: 5000 }
    );

    handleCloseCreateDrawer();
    // 重新加载数据
    loadData();
  };

  // 判断变化率颜色
  const getRateColor = (rate: string) => {
    if (rate.startsWith("+")) {
      return "text-emerald-600 bg-emerald-50";
    } else if (rate.startsWith("-")) {
      return "text-red-600 bg-red-50";
    }
    return "text-gray-600 bg-gray-50";
  };

  // 获取任务状态的颜色和文本
  const getTaskStatusInfo = (status: EvaluationTask["status"]) => {
    switch (status) {
      case "completed":
        return { text: "已完成", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "running":
        return { text: "运行中", color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "failed":
        return { text: "失败", color: "bg-red-50 text-red-700 border-red-200" };
      default:
        return { text: "未知", color: "bg-gray-50 text-gray-700 border-gray-200" };
    }
  };

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 搜索和操作区域 */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        {/* 左侧：新建评估任务按钮 */}
        <MdButton onClick={handleOpenCreateDrawer} leftIcon={<Plus className="h-4 w-4" />} className="h-9 px-3">
          新建评估任务
        </MdButton>

        {/* 右侧：搜索表单 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-80">
            <MdInput
              placeholder="搜索模型名称或描述"
              value={formData.modelName || ""}
              onChange={(e) => handleSearch({ ...formData, modelName: e.target.value })}
              className="h-9"
            />
          </div>
          <MdButton onClick={handleSearch} leftIcon={<Search className="h-4 w-4" />} className="h-9 px-3">
            查询
          </MdButton>
          <MdButton variant="outline" onClick={handleReset} leftIcon={<RotateCcw className="h-4 w-4" />} className="h-9 px-3">
            重置
          </MdButton>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-auto flex flex-col">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="border-r border-border p-3 text-center text-sm font-semibold min-w-[60px]">
                序号
              </th>
              <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[180px]">
                模型名称
              </th>
              <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[100px]">
                模型类型
              </th>
              <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[100px]">
                版本号
              </th>
              <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[160px]">
                最后一次评估时间
              </th>
              <th className="border-r border-border p-3 text-center text-sm font-semibold min-w-[80px]">
                评估次数
              </th>
              <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[200px]">
                核心评估指标
              </th>
              <th className="p-3 text-center text-sm font-semibold min-w-[80px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-muted-foreground">加载中...</span>
                  </div>
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-muted-foreground">
                  暂无数据
                </td>
              </tr>
            ) : (
              tableData.map((model, index) => (
                <tr
                  key={model.id}
                  className={cn(
                    "border-b border-border hover:bg-muted/30 transition-colors",
                    index % 2 === 1 && "bg-muted/10"
                  )}
                >
                  {/* 序号 */}
                  <td className="border-r border-border p-3 text-center">
                    {(pagination.current - 1) * pagination.pageSize + index + 1}
                  </td>

                  {/* 模型名称 */}
                  <td className="border-r border-border p-3 font-semibold text-foreground">
                    {model.modelName}
                  </td>

                  {/* 模型类型 */}
                  <td className="border-r border-border p-3 text-sm">
                    {model.modelType}
                  </td>

                  {/* 版本号 */}
                  <td className="border-r border-border p-3 text-sm font-mono text-muted-foreground">
                    {model.version}
                  </td>

                  {/* 最后一次评估时间 */}
                  <td className="border-r border-border p-3 text-sm text-muted-foreground">
                    {model.lastEvaluationTime}
                  </td>

                  {/* 评估次数 */}
                  <td className="border-r border-border p-3 text-center">
                    <MdBadge variant="secondary" className="text-xs">
                      {model.evaluationCount}
                    </MdBadge>
                  </td>

                  {/* 核心评估指标 */}
                  <td className="border-r border-border p-3 space-y-1.5">
                    {model.summaryData.map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-muted-foreground">{metric.metricStr}:</span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full font-bold text-xs font-mono",
                            getRateColor(metric.rate)
                          )}
                        >
                          {metric.rate}
                        </span>
                      </div>
                    ))}
                  </td>

                  {/* 操作 */}
                  <td className="p-3 text-center">
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDetail(model)}
                      leftIcon={<Eye className="h-3 w-3" />}
                      className="w-full"
                    >
                      详情
                    </MdButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 分页 */}
        {!loading && tableData.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              共 {pagination.total} 条数据
            </span>
            <div className="flex items-center gap-2">
              <MdButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current - 1, pagination.pageSize)}
                disabled={pagination.current === 1}
              >
                上一页
              </MdButton>
              <span className="text-sm text-foreground">
                第 {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)} 页
              </span>
              <MdButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current + 1, pagination.pageSize)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                下一页
              </MdButton>
            </div>
          </div>
        )}
      </div>

      {/* 详情弹窗 - 评估任务列表 */}
      {isShowDetail && currentModel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={handleCloseDetail} />
          <div className="relative ml-auto h-full w-[900px] bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{currentModel.modelName} - 评估任务</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentModel.modelType} · {currentModel.version} · 共 {evaluationTasks.length} 个评估任务
                </p>
              </div>
              <MdButton variant="text" size="sm" onClick={handleCloseDetail}>
                <X className="h-4 w-4" />
              </MdButton>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-background">
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="border-r border-border p-3 text-center text-sm font-semibold min-w-[60px]">
                      序号
                    </th>
                    <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[140px]">
                      任务ID
                    </th>
                    <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[140px]">
                      数据集
                    </th>
                    <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[140px]">
                      评估时间
                    </th>
                    <th className="border-r border-border p-3 text-center text-sm font-semibold min-w-[80px]">
                      状态
                    </th>
                    <th className="border-r border-border p-3 text-center text-sm font-semibold min-w-[80px]">
                      耗时
                    </th>
                    <th className="p-3 text-left text-sm font-semibold min-w-[180px]">
                      评估指标
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground">
                        暂无评估任务
                      </td>
                    </tr>
                  ) : (
                    evaluationTasks.map((task, index) => {
                      const statusInfo = getTaskStatusInfo(task.status);
                      return (
                        <tr
                          key={task.id}
                          className="border-b border-border hover:bg-muted/30 transition-colors"
                        >
                          {/* 序号 */}
                          <td className="border-r border-border p-3 text-center">
                            {index + 1}
                          </td>

                          {/* 任务ID */}
                          <td className="border-r border-border p-3">
                            <span className="font-mono text-sm">{task.taskId}</span>
                          </td>

                          {/* 数据集 */}
                          <td className="border-r border-border p-3 text-sm text-foreground">
                            {task.dataset}
                          </td>

                          {/* 评估时间 */}
                          <td className="border-r border-border p-3 text-sm text-muted-foreground">
                            {task.evaluationTime}
                          </td>

                          {/* 状态 */}
                          <td className="border-r border-border p-3 text-center">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                              statusInfo.color
                            )}>
                              {statusInfo.text}
                            </span>
                          </td>

                          {/* 耗时 */}
                          <td className="border-r border-border p-3 text-center text-sm text-muted-foreground">
                            {task.duration}
                          </td>

                          {/* 评估指标 */}
                          <td className="p-3">
                            {task.status === "completed" && task.metrics.length > 0 ? (
                              <div className="space-y-1.5">
                                {task.metrics.map((metric, idx) => (
                                  <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                                    <span className="text-muted-foreground">{metric.metricStr}:</span>
                                    <span
                                      className={cn(
                                        "px-2 py-0.5 rounded-full font-bold text-xs font-mono",
                                        getRateColor(metric.rate)
                                      )}
                                    >
                                      {metric.rate}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : task.status === "running" ? (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span>评估中...</span>
                              </div>
                            ) : (
                              <span className="text-xs text-red-500">评估失败</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-border px-6 py-4 flex justify-end">
              <MdButton variant="outline" onClick={handleCloseDetail}>关闭</MdButton>
            </div>
          </div>
        </div>
      )}

      {/* 新建评估任务抽屉 */}
      {isShowCreateDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={handleCloseCreateDrawer} />
          <div className="relative ml-auto h-full w-[600px] bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">新建评估任务</h2>
              <MdButton variant="text" size="sm" onClick={handleCloseCreateDrawer}>
                <X className="h-4 w-4" />
              </MdButton>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 步骤1：选择评估模型 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <h3 className="text-base font-semibold text-foreground">选择评估模型</h3>
                </div>
                <div className="pl-8 space-y-2">
                  <p className="text-xs text-muted-foreground">请选择需要进行效益评估的模型版本</p>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    aria-label="选择评估模型"
                    title="选择评估模型"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">请选择模型</option>
                    {modelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 步骤2：选择数据集 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <h3 className="text-base font-semibold text-foreground">选择数据集</h3>
                </div>
                <div className="pl-8 space-y-3">
                  {/* Tab切换 */}
                  <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
                    <button
                      type="button"
                      onClick={() => setDatasetTab("existing")}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                        datasetTab === "existing"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      现有数据集
                    </button>
                    <button
                      type="button"
                      onClick={() => setDatasetTab("new")}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                        datasetTab === "new"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      新建/上传
                    </button>
                  </div>

                  {datasetTab === "existing" ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">从现有数据集中选择用于评估的数据集（可多选，将为每个数据集创建独立的评估任务）</p>
                        <button
                          type="button"
                          onClick={handleToggleAllDatasets}
                          className="text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                          {selectedDatasets.length === datasetOptions.length ? "取消全选" : "全选"}
                        </button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {datasetOptions.map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                              selectedDatasets.includes(option.value)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={selectedDatasets.includes(option.value)}
                              onChange={() => handleDatasetToggle(option.value)}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
                            />
                            <span className="text-sm flex-1">{option.label}</span>
                            {selectedDatasets.includes(option.value) && (
                              <span className="text-primary">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                      {selectedDatasets.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          已选择 <span className="font-semibold text-foreground">{selectedDatasets.length}</span> 个数据集，
                          将创建 <span className="font-semibold text-foreground">{selectedDatasets.length}</span> 个评估任务
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">上传新的数据集用于模型评估</p>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="text-muted-foreground text-sm">
                          <p className="font-medium mb-1">点击上传或拖拽文件到此处</p>
                          <p className="text-xs">支持 CSV、Excel、JSON 格式</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 步骤3：评估指标 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <h3 className="text-base font-semibold text-foreground">评估指标</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetMetrics}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    重置默认
                  </button>
                </div>
                <div className="pl-8 space-y-3">
                  {/* 默认指标 */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">默认评估指标：</p>
                    <div className="flex flex-wrap gap-2">
                      {defaultMetrics.map((metric) => (
                        <span
                          key={metric}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 自定义指标 */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">自定义指标：</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customMetricInput}
                        onChange={(e) => setCustomMetricInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddMetric();
                          }
                        }}
                        placeholder="输入自定义指标名称"
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <MdButton
                        size="sm"
                        onClick={handleAddMetric}
                        disabled={!customMetricInput.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        添加
                      </MdButton>
                    </div>
                    {customMetrics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {customMetrics.map((metric) => (
                          <span
                            key={metric}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
                          >
                            {metric}
                            <button
                              type="button"
                              onClick={() => handleRemoveMetric(metric)}
                              aria-label={`删除指标 ${metric}`}
                              className="hover:text-blue-800 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end gap-2">
              <MdButton variant="outline" onClick={handleCloseCreateDrawer}>取消</MdButton>
              <MdButton onClick={handleSubmitCreateTask}>确定</MdButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
