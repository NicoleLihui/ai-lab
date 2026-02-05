"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, CheckCircle, XCircle, Loader2, Database, FileText } from "lucide-react";
import { MdButton, MdInput, MdSelect, MdCard, MdBadge, MdDrawer, type SelectOption } from "@/components/enterprise-ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getMockEvaluationMgmtData, type EvaluationMgmtModel } from "../benefit-evaluation/mock-evaluation-mgmt-data";
import { DatasetSelectionModal } from "./dataset-selection-modal";

// 评估表单数据类型
interface EvaluationFormData {
  evaluationName: string;
  modelId: string;
  modelName: string;
  modelVersion: string;
  datasetId: string;
  datasetName: string;
  description: string;
}

// 评估结果类型
interface EvaluationResult {
  status: "running" | "success" | "failed";
  metrics?: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    mae?: number;
    rmse?: number;
    r2Score?: number;
    [key: string]: number | undefined;
  };
  errorMessage?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

// Mock数据集数据
interface Dataset {
  id: string;
  name: string;
  dataVolume: string;
  ldmName: string;
  dataType: string;
  orgDimension: string;
  timeRange: string;
}

// Mock数据集列表
const mockDatasets: Dataset[] = [
  {
    id: "dataset-001",
    name: "污水处理厂运行数据集A",
    dataVolume: "10万条",
    ldmName: "污水处理厂",
    dataType: "时序数据",
    orgDimension: "华东大区",
    timeRange: "2024-01-01 ~ 2024-12-31",
  },
  {
    id: "dataset-002",
    name: "水质监测数据集B",
    dataVolume: "5万条",
    ldmName: "水质监测",
    dataType: "结构化数据",
    orgDimension: "华南大区",
    timeRange: "2024-06-01 ~ 2024-12-31",
  },
  {
    id: "dataset-003",
    name: "设备运行数据集C",
    dataVolume: "20万条",
    ldmName: "设备管理",
    dataType: "时序数据",
    orgDimension: "华北大区",
    timeRange: "2024-03-01 ~ 2024-12-31",
  },
];

export function EvaluationCreateEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [formData, setFormData] = useState<EvaluationFormData>({
    evaluationName: "",
    modelId: "",
    modelName: "",
    modelVersion: "",
    datasetId: "",
    datasetName: "",
    description: "",
  });

  const [availableModels, setAvailableModels] = useState<EvaluationMgmtModel[]>([]);
  const [modelOptions, setModelOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);

  // 加载已测试部署的模型列表
  const loadAvailableModels = useCallback(() => {
    const allModels = getMockEvaluationMgmtData();
    // 只选择已测试部署的模型 (deployTestStatus === 1)
    const deployedModels = allModels.filter((model) => model.deployTestStatus === 1);
    setAvailableModels(deployedModels);
    setModelOptions(
      deployedModels.map((model) => ({
        value: model.modelId,
        label: `${model.modelName} (${model.version})`,
      }))
    );
  }, []);

  // 加载编辑数据
  const loadEditData = useCallback(() => {
    if (!editId) return;

    // Mock编辑数据
    const mockEditData: EvaluationFormData = {
      evaluationName: "水质预测模型评估_2024",
      modelId: "MLModel-523",
      modelName: "金刚钻-015-污水厂核心单元自适应系统",
      modelVersion: "V001",
      datasetId: "dataset-001",
      datasetName: "污水处理厂运行数据集A",
      description: "对水质预测模型进行综合评估",
    };

    setFormData(mockEditData);
  }, [editId]);

  useEffect(() => {
    loadAvailableModels();
    if (editId) {
      loadEditData();
    }
  }, [loadAvailableModels, editId, loadEditData]);

  // 处理模型选择
  const handleModelChange = (modelId: string) => {
    const selectedModel = availableModels.find((m) => m.modelId === modelId);
    if (selectedModel) {
      setFormData((prev) => ({
        ...prev,
        modelId: selectedModel.modelId,
        modelName: selectedModel.modelName,
        modelVersion: selectedModel.version,
      }));
    }
  };

  // 处理数据集选择
  const handleDatasetSelect = (dataset: Dataset) => {
    setFormData((prev) => ({
      ...prev,
      datasetId: dataset.id,
      datasetName: dataset.name,
    }));
    setIsDatasetModalOpen(false);
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (!formData.evaluationName.trim()) {
      toast.error("请输入评估名称");
      return false;
    }
    if (!formData.modelId) {
      toast.error("请选择模型");
      return false;
    }
    if (!formData.datasetId) {
      toast.error("请选择数据集");
      return false;
    }
    return true;
  };

  // 运行评估
  const handleRunEvaluation = async () => {
    if (!validateForm()) return;

    setIsRunning(true);
    setEvaluationResult({
      status: "running",
      startTime: new Date().toLocaleString("zh-CN"),
    });

    try {
      // 模拟评估运行过程
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock评估结果
      const mockResult: EvaluationResult = {
        status: "success",
        metrics: {
          accuracy: 0.925,
          precision: 0.891,
          recall: 0.862,
          f1Score: 0.876,
          mae: 0.4876,
          rmse: 0.6234,
          r2Score: 0.9721,
        },
        startTime: new Date().toLocaleString("zh-CN"),
        endTime: new Date().toLocaleString("zh-CN"),
        duration: 3,
      };

      setEvaluationResult(mockResult);
      toast.success("评估运行成功");
    } catch (error) {
      setEvaluationResult({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "评估运行失败",
      });
      toast.error("评估运行失败");
    } finally {
      setIsRunning(false);
    }
  };

  // 保存评估
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 模拟保存
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(editId ? "评估更新成功" : "评估创建成功");
      router.back();
    } catch (error) {
      toast.error(editId ? "评估更新失败" : "评估创建失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MdButton variant="ghost" size="sm" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            返回
          </MdButton>
          <h1 className="text-2xl font-bold">{editId ? "编辑评估" : "新增评估"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <MdButton variant="outline" onClick={() => router.back()}>
            取消
          </MdButton>
          <MdButton onClick={handleSave} loading={loading}>
            保存
          </MdButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-auto">
        {/* 左侧表单区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本信息 */}
          <MdCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  评估名称 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  placeholder="请输入评估名称"
                  value={formData.evaluationName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, evaluationName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  选择模型 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={modelOptions}
                  value={formData.modelId}
                  onChange={handleModelChange}
                  placeholder="请选择已测试部署的模型"
                />
                {formData.modelName && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    已选择: {formData.modelName} ({formData.modelVersion})
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  选择数据集 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <MdInput
                    placeholder="请选择数据集"
                    value={formData.datasetName}
                    readOnly
                    className="flex-1"
                    leftIcon={<Database className="h-4 w-4" />}
                  />
                  <MdButton variant="outline" onClick={() => setIsDatasetModalOpen(true)}>
                    选择数据集
                  </MdButton>
                </div>
                {formData.datasetName && (
                  <div className="mt-2 text-sm text-muted-foreground">已选择: {formData.datasetName}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">描述</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入评估描述（可选）"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </MdCard>

          {/* 评估结果 */}
          {evaluationResult && (
            <MdCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">评估结果</h2>
                {evaluationResult.status === "running" && (
                  <MdBadge variant="warning">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    运行中
                  </MdBadge>
                )}
                {evaluationResult.status === "success" && (
                  <MdBadge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    成功
                  </MdBadge>
                )}
                {evaluationResult.status === "failed" && (
                  <MdBadge variant="danger">
                    <XCircle className="h-3 w-3 mr-1" />
                    失败
                  </MdBadge>
                )}
              </div>

              {evaluationResult.status === "running" && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">评估运行中，请稍候...</p>
                  {evaluationResult.startTime && (
                    <p className="text-sm text-muted-foreground mt-2">开始时间: {evaluationResult.startTime}</p>
                  )}
                </div>
              )}

              {evaluationResult.status === "success" && evaluationResult.metrics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(evaluationResult.metrics).map(([key, value]) => {
                      if (value === undefined) return null;
                      const labelMap: Record<string, string> = {
                        accuracy: "准确率",
                        precision: "精确率",
                        recall: "召回率",
                        f1Score: "F1分数",
                        mae: "平均绝对误差(MAE)",
                        rmse: "均方根误差(RMSE)",
                        r2Score: "拟合度(R²)",
                      };
                      const label = labelMap[key] || key;
                      const isPercentage = ["accuracy", "precision", "recall", "f1Score", "r2Score"].includes(key);
                      return (
                        <div key={key} className="border rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {isPercentage ? `${(value * 100).toFixed(2)}%` : value.toFixed(4)}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{label}</div>
                        </div>
                      );
                    })}
                  </div>
                  {evaluationResult.endTime && (
                    <div className="text-sm text-muted-foreground pt-4 border-t">
                      <p>开始时间: {evaluationResult.startTime}</p>
                      <p>结束时间: {evaluationResult.endTime}</p>
                      {evaluationResult.duration && <p>耗时: {evaluationResult.duration}秒</p>}
                    </div>
                  )}
                </div>
              )}

              {evaluationResult.status === "failed" && (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <p className="text-destructive font-semibold">评估运行失败</p>
                  {evaluationResult.errorMessage && (
                    <p className="text-sm text-muted-foreground mt-2">{evaluationResult.errorMessage}</p>
                  )}
                </div>
              )}
            </MdCard>
          )}
        </div>

        {/* 右侧操作区域 */}
        <div className="space-y-6">
          <MdCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">操作</h2>
            <div className="space-y-3">
              <MdButton
                className="w-full"
                onClick={handleRunEvaluation}
                disabled={isRunning || !formData.modelId || !formData.datasetId}
                leftIcon={isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              >
                {isRunning ? "运行中..." : "运行评估"}
              </MdButton>
              <p className="text-xs text-muted-foreground">
                选择模型和数据集后，点击运行评估开始评估任务
              </p>
            </div>
          </MdCard>

          {/* 模型信息 */}
          {formData.modelId && (
            <MdCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">模型信息</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">模型名称:</span>
                  <span className="ml-2 font-medium">{formData.modelName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">版本号:</span>
                  <span className="ml-2 font-medium">{formData.modelVersion}</span>
                </div>
                {availableModels.find((m) => m.modelId === formData.modelId) && (
                  <>
                    <div>
                      <span className="text-muted-foreground">模型类型:</span>
                      <span className="ml-2 font-medium">
                        {availableModels.find((m) => m.modelId === formData.modelId)?.modelType}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">开发语言:</span>
                      <span className="ml-2 font-medium">
                        {availableModels.find((m) => m.modelId === formData.modelId)?.developLanguage}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </MdCard>
          )}

          {/* 数据集信息 */}
          {formData.datasetId && (
            <MdCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">数据集信息</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">数据集名称:</span>
                  <span className="ml-2 font-medium">{formData.datasetName}</span>
                </div>
                {mockDatasets.find((d) => d.id === formData.datasetId) && (
                  <>
                    <div>
                      <span className="text-muted-foreground">数据规模:</span>
                      <span className="ml-2 font-medium">
                        {mockDatasets.find((d) => d.id === formData.datasetId)?.dataVolume}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">业务实体:</span>
                      <span className="ml-2 font-medium">
                        {mockDatasets.find((d) => d.id === formData.datasetId)?.ldmName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">时间范围:</span>
                      <span className="ml-2 font-medium">
                        {mockDatasets.find((d) => d.id === formData.datasetId)?.timeRange}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </MdCard>
          )}
        </div>
      </div>

      {/* 数据集选择弹窗 */}
      <DatasetSelectionModal
        open={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        onSelect={handleDatasetSelect}
        datasets={mockDatasets}
      />
    </div>
  );
}
