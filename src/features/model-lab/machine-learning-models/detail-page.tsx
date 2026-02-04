"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Edit, Send, Rocket } from 'lucide-react';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MachineLearningModel {
  id: number;
  name: string;
  type: string;
  version: string;
  status: string;
  createdTime: string;
  accuracy: number;
  description: string;
  published: boolean;
  deployed: boolean;
  owner: string;
  applicableScenario: string[];
  inputParameters?: Array<{
    name: string;
    physicalFieldName: string;
    dataType: string;
    description: string;
  }>;
  outputParameters?: Array<{
    name: string;
    physicalFieldName: string;
    dataType: string;
    description: string;
  }>;
  evaluationMetrics?: Array<{
    metricType: string;
    value?: number;
    enabled: boolean;
  }>;
}

const MachineLearningModelDetailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<MachineLearningModel | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (modelId) {
      setLoading(true);
      // TODO: 从API加载模型数据
      setTimeout(() => {
        // 模拟数据
        const mockModel: MachineLearningModel = {
          id: Number(modelId),
          name: '客户流失预测模型',
          type: '分类模型',
          version: 'v1.2.0',
          status: '已发布',
          createdTime: '2023-06-15',
          accuracy: 0.92,
          description: '基于历史客户数据预测客户流失概率',
          published: true,
          deployed: true,
          owner: '张三',
          applicableScenario: ['水质分析'],
          inputParameters: [
            { name: '客户ID', physicalFieldName: 'customer_id', dataType: 'string', description: '客户唯一标识' },
            { name: '年龄', physicalFieldName: 'age', dataType: 'number', description: '客户年龄' }
          ],
          outputParameters: [
            { name: '流失概率', physicalFieldName: 'churn_probability', dataType: 'float', description: '客户流失概率' }
          ],
          evaluationMetrics: [
            { metricType: 'Accuracy', value: 0.92, enabled: true },
            { metricType: 'Precision_0', value: 0.89, enabled: true },
            { metricType: 'Recall_1', value: 0.85, enabled: true }
          ]
        };
        setModel(mockModel);
        setLoading(false);
      }, 300);
    }
  }, [modelId]);

  const handleEdit = () => {
    if (model) {
      router.push(`/categories/model-lab/model-development/machine-learning-models-create?id=${model.id}`);
    }
  };

  const handlePublish = () => {
    if (model && !model.published) {
      if (confirm(`确定要将模型"${model.name}"发布到模型广场吗？`)) {
        // TODO: 调用发布API
        alert('模型已发布到模型广场');
      }
    }
  };

  const handleDeploy = () => {
    if (model && !model.deployed) {
      router.push(`/categories/model-lab/model-development/machine-learning-models-deploy?id=${model.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">模型不存在</p>
          <MdButton onClick={() => router.back()}>返回</MdButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MdButton variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </MdButton>
          <h1 className="text-2xl font-bold tracking-tight">{model.name}</h1>
          <MdBadge variant={model.status === '已发布' ? 'success' : model.status === '测试中' ? 'warning' : 'secondary'}>
            {model.status}
          </MdBadge>
        </div>
        <div className="flex gap-2">
          {model.status !== '已发布' && (
            <MdButton variant="outline" onClick={handleEdit} leftIcon={<Edit className="h-4 w-4" />}>
              编辑
            </MdButton>
          )}
          {!model.published && model.status !== '开发中' && (
            <MdButton variant="outline" onClick={handlePublish} leftIcon={<Send className="h-4 w-4" />}>
              发布
            </MdButton>
          )}
          {!model.deployed && model.status !== '开发中' && (
            <MdButton variant="outline" onClick={handleDeploy} leftIcon={<Rocket className="h-4 w-4" />}>
              部署
            </MdButton>
          )}
        </div>
      </div>

      {/* 标签页内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="parameters">参数定义</TabsTrigger>
          <TabsTrigger value="metrics">评估指标</TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value="basic" className="space-y-4">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>模型基本信息</MdCardTitle>
              <MdCardDescription>模型的基础信息和元数据</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">模型名称</label>
                  <div className="mt-1 text-sm">{model.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">模型类型</label>
                  <div className="mt-1 text-sm">{model.type}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">版本</label>
                  <div className="mt-1 text-sm">{model.version}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">状态</label>
                  <div className="mt-1">
                    <MdBadge variant={model.status === '已发布' ? 'success' : model.status === '测试中' ? 'warning' : 'secondary'}>
                      {model.status}
                    </MdBadge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">负责人</label>
                  <div className="mt-1 text-sm">{model.owner}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                  <div className="mt-1 text-sm">{model.createdTime}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">发布状态</label>
                  <div className="mt-1">
                    <MdBadge variant={model.published ? 'success' : 'secondary'}>
                      {model.published ? '已发布' : '未发布'}
                    </MdBadge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">部署状态</label>
                  <div className="mt-1">
                    <MdBadge variant={model.deployed ? 'success' : 'secondary'}>
                      {model.deployed ? '已部署' : '未部署'}
                    </MdBadge>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">功能描述</label>
                  <div className="mt-1 text-sm">{model.description}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">适用场景</label>
                  <div className="mt-1 flex gap-2">
                    {model.applicableScenario?.map((scenario, index) => (
                      <MdBadge key={index} variant="outline">{scenario}</MdBadge>
                    ))}
                  </div>
                </div>
              </div>
            </MdCardContent>
          </MdCard>
        </TabsContent>

        {/* 参数定义 */}
        <TabsContent value="parameters" className="space-y-4">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>输入参数</MdCardTitle>
              <MdCardDescription>模型的输入参数定义</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              {model.inputParameters && model.inputParameters.length > 0 ? (
                <div className="space-y-2">
                  {model.inputParameters.map((param, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground">参数名称</label>
                          <div className="font-medium">{param.name}</div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">物理字段名</label>
                          <div className="font-medium">{param.physicalFieldName}</div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">数据类型</label>
                          <div>
                            <MdBadge variant="outline">{param.dataType}</MdBadge>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">描述</label>
                          <div className="text-sm">{param.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">暂无输入参数</div>
              )}
            </MdCardContent>
          </MdCard>

          <MdCard>
            <MdCardHeader>
              <MdCardTitle>输出参数</MdCardTitle>
              <MdCardDescription>模型的输出参数定义</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              {model.outputParameters && model.outputParameters.length > 0 ? (
                <div className="space-y-2">
                  {model.outputParameters.map((param, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground">参数名称</label>
                          <div className="font-medium">{param.name}</div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">物理字段名</label>
                          <div className="font-medium">{param.physicalFieldName}</div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">数据类型</label>
                          <div>
                            <MdBadge variant="outline">{param.dataType}</MdBadge>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">描述</label>
                          <div className="text-sm">{param.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">暂无输出参数</div>
              )}
            </MdCardContent>
          </MdCard>
        </TabsContent>

        {/* 评估指标 */}
        <TabsContent value="metrics" className="space-y-4">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>评估指标</MdCardTitle>
              <MdCardDescription>模型的评估指标和性能数据</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              {model.evaluationMetrics && model.evaluationMetrics.filter(m => m.enabled).length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {model.evaluationMetrics
                    .filter(m => m.enabled)
                    .map((metric, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{metric.metricType}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {metric.metricType === 'MAE' && '平均绝对误差'}
                              {metric.metricType === 'MSE' && '均方误差'}
                              {metric.metricType === 'R²' && '决定系数'}
                              {metric.metricType === 'RMSE' && '均方根误差'}
                              {metric.metricType === 'Accuracy' && '准确率'}
                              {metric.metricType === 'Precision_0' && '精确率'}
                              {metric.metricType === 'Recall_1' && '召回率'}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {metric.value !== undefined ? (
                              metric.metricType === 'Accuracy' || metric.metricType === 'Precision_0' || metric.metricType === 'Recall_1' || metric.metricType === 'R²'
                                ? `${(metric.value * 100).toFixed(2)}%`
                                : metric.value.toFixed(4)
                            ) : '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">暂无评估指标</div>
              )}
            </MdCardContent>
          </MdCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MachineLearningModelDetailPage;
