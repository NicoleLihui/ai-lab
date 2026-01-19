"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { MdButton, MdCard, MdBadge } from "@/components/enterprise-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getModelDetailById, type ModelDetailInfo, type ModelParam, type ModelEvaluation, type RelatedDataset } from "./mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ModelDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get("modelId") || "";
  const square = searchParams.get("square") || "";

  const [loading, setLoading] = useState(true);
  const [modelDetail, setModelDetail] = useState<ModelDetailInfo | null>(null);
  const [activeTab, setActiveTab] = useState("modelIntroduction");

  useEffect(() => {
    if (modelId) {
      setLoading(true);
      // 模拟加载延迟
      setTimeout(() => {
        const detail = getModelDetailById(modelId);
        setModelDetail(detail);
        setLoading(false);
        if (!detail) {
          toast.error("模型不存在");
        }
      }, 300);
    }
  }, [modelId]);

  const handleBack = () => {
    router.back();
  };

  const handleTrial = () => {
    toast.info("试用功能开发中");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!modelDetail) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">模型不存在</p>
          <MdButton onClick={handleBack}>返回</MdButton>
        </div>
      </div>
    );
  }

  const isDataRuleModel = modelDetail.modelTypeNum === 3;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* 顶部标题和操作栏 */}
      <div className="flex-none bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{modelDetail.modelName || modelDetail.name}</h1>
          <div className="flex items-center gap-2">
            <MdButton onClick={handleTrial} variant="primary" size="sm">
              <Play className="h-4 w-4 mr-1" />
              试用
            </MdButton>
            <MdButton onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </MdButton>
          </div>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* 基本信息卡片 */}
          <MdCard className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">基本信息</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">模型名称</div>
                <div className="text-sm font-medium">{modelDetail.modelName || modelDetail.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">模型类型</div>
                <div className="text-sm font-medium">{modelDetail.modelType}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">模型所有者</div>
                <div className="text-sm font-medium">{modelDetail.owner || "-"}</div>
              </div>
              {modelDetail.developLanguage && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">编程语言</div>
                  <div className="text-sm font-medium">{modelDetail.developLanguage}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">模型使用场景</div>
                <div className="text-sm font-medium">{modelDetail.applicableScenarioStr || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">创建时间</div>
                <div className="text-sm font-medium">{modelDetail.createTime}</div>
              </div>
              {modelDetail.updateTime && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">最近更新时间</div>
                  <div className="text-sm font-medium">{modelDetail.updateTime}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">版本</div>
                <div className="text-sm font-medium">{modelDetail.version}</div>
              </div>
            </div>
            {modelDetail.tags && modelDetail.tags.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">标签</div>
                <div className="flex flex-wrap gap-2">
                  {modelDetail.tags.map((tag, index) => (
                    <MdBadge key={index} variant="secondary">{tag}</MdBadge>
                  ))}
                </div>
              </div>
            )}
          </MdCard>

          {/* 底部内容：左侧Tabs + 右侧关联数据集 */}
          <div className="flex gap-6">
            {/* 左侧：Tabs内容 */}
            <div className="flex-1 min-w-0">
              <MdCard className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="modelIntroduction">模型介绍</TabsTrigger>
                    <TabsTrigger value="parameterConfig">
                      {isDataRuleModel ? "数据规则" : "参数设置"}
                    </TabsTrigger>
                    <TabsTrigger value="modelEvaluation">模型评价</TabsTrigger>
                  </TabsList>

                  <TabsContent value="modelIntroduction" className="mt-6">
                    <ModelIntroduction modelDetail={modelDetail} />
                  </TabsContent>

                  <TabsContent value="parameterConfig" className="mt-6">
                    {isDataRuleModel ? (
                      <DataRuleConfig modelDetail={modelDetail} />
                    ) : (
                      <ParameterConfig modelDetail={modelDetail} />
                    )}
                  </TabsContent>

                  <TabsContent value="modelEvaluation" className="mt-6">
                    <ModelEvaluation modelDetail={modelDetail} square={square} />
                  </TabsContent>
                </Tabs>
              </MdCard>
            </div>

            {/* 右侧：关联数据集 */}
            <div className="w-[400px] flex-none">
              <MdCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">关联数据集</h3>
                <RelatedDatasets datasets={modelDetail.relatedDatasets || []} />
              </MdCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 模型介绍组件
function ModelIntroduction({ modelDetail }: { modelDetail: ModelDetailInfo }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">模型描述</h3>
        <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
          {modelDetail.notes || modelDetail.description || "暂无描述"}
        </div>
      </div>
    </div>
  );
}

// 参数设置组件
function ParameterConfig({ modelDetail }: { modelDetail: ModelDetailInfo }) {
  const paramInList = modelDetail.paramInList || [];
  const paramOutList = modelDetail.paramOutList || [];

  return (
    <div className="space-y-6">
      {paramInList.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4">输入参数</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">参数名称</th>
                  <th className="px-4 py-2 text-left font-medium">英文名称</th>
                  <th className="px-4 py-2 text-left font-medium">单位</th>
                  <th className="px-4 py-2 text-left font-medium">数据类型</th>
                  <th className="px-4 py-2 text-left font-medium">必填</th>
                </tr>
              </thead>
              <tbody>
                {paramInList.map((param) => (
                  <tr key={param.id} className="border-t border-border">
                    <td className="px-4 py-2">{param.paramName}</td>
                    <td className="px-4 py-2 text-muted-foreground">{param.paramDesc}</td>
                    <td className="px-4 py-2">{param.unit}</td>
                    <td className="px-4 py-2">{param.dataType}</td>
                    <td className="px-4 py-2">
                      {param.required ? (
                        <MdBadge variant="danger" className="text-xs">是</MdBadge>
                      ) : (
                        <span className="text-muted-foreground">否</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {paramOutList.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4">输出参数</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">参数名称</th>
                  <th className="px-4 py-2 text-left font-medium">英文名称</th>
                  <th className="px-4 py-2 text-left font-medium">单位</th>
                  <th className="px-4 py-2 text-left font-medium">数据类型</th>
                </tr>
              </thead>
              <tbody>
                {paramOutList.map((param) => (
                  <tr key={param.id} className="border-t border-border">
                    <td className="px-4 py-2">{param.paramName}</td>
                    <td className="px-4 py-2 text-muted-foreground">{param.paramDesc}</td>
                    <td className="px-4 py-2">{param.unit}</td>
                    <td className="px-4 py-2">{param.dataType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {paramInList.length === 0 && paramOutList.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">暂无参数配置</div>
      )}
    </div>
  );
}

// 数据规则配置组件
function DataRuleConfig({ modelDetail }: { modelDetail: ModelDetailInfo }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        数据规则模型的具体规则配置信息将在此处显示。
      </div>
      <div className="border border-border rounded-lg p-4 bg-muted/50">
        <p className="text-sm">规则配置详情开发中...</p>
      </div>
    </div>
  );
}

// 模型评价组件
function ModelEvaluation({ modelDetail, square }: { modelDetail: ModelDetailInfo; square: string }) {
  const evaluations = modelDetail.evaluations || [];

  return (
    <div className="space-y-4">
      {evaluations.length > 0 ? (
        evaluations.map((evaluation) => (
          <div key={evaluation.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{evaluation.evaluator}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "text-lg",
                        i < Math.floor(evaluation.score) ? "text-yellow-500" : "text-gray-300"
                      )}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">{evaluation.score}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{evaluation.createTime}</span>
            </div>
            <p className="text-sm text-foreground mb-3">{evaluation.comment}</p>
            {evaluation.metrics && (
              <div className="grid grid-cols-4 gap-4 pt-3 border-t border-border">
                {evaluation.metrics.accuracy !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">准确率</div>
                    <div className="text-sm font-medium">{(evaluation.metrics.accuracy * 100).toFixed(1)}%</div>
                  </div>
                )}
                {evaluation.metrics.precision !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">精确率</div>
                    <div className="text-sm font-medium">{(evaluation.metrics.precision * 100).toFixed(1)}%</div>
                  </div>
                )}
                {evaluation.metrics.recall !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">召回率</div>
                    <div className="text-sm font-medium">{(evaluation.metrics.recall * 100).toFixed(1)}%</div>
                  </div>
                )}
                {evaluation.metrics.f1Score !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">F1分数</div>
                    <div className="text-sm font-medium">{(evaluation.metrics.f1Score * 100).toFixed(1)}%</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">暂无评价</div>
      )}
    </div>
  );
}

// 关联数据集组件
function RelatedDatasets({ datasets }: { datasets: RelatedDataset[] }) {
  if (datasets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">暂无关联数据集</div>
    );
  }

  return (
    <div className="space-y-3">
      {datasets.map((dataset) => (
        <div key={dataset.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-foreground">{dataset.name}</h4>
            <MdBadge variant="secondary" className="text-xs">{dataset.type}</MdBadge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{dataset.description}</p>
          <div className="text-xs text-muted-foreground">{dataset.createTime}</div>
        </div>
      ))}
    </div>
  );
}
