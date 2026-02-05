"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { ArrowLeft, Download, Upload, Package, FileText, History } from 'lucide-react';

interface ModelVersion {
  id: string;
  version: string;
  stage: 'staging' | 'production' | 'archived';
  createdTime: string;
  creator: string;
  description: string;
}

interface ModelSignature {
  inputs: {
    name: string;
    type: string;
    shape: string;
    description: string;
  }[];
  outputs: {
    name: string;
    type: string;
    shape: string;
    description: string;
  }[];
}

interface Dependency {
  name: string;
  version: string;
  status: 'installed' | 'missing' | 'outdated';
}

interface ModelDetail {
  id: string;
  name: string;
  description: string;
  framework: string;
  version: string;
  stage: 'staging' | 'production' | 'archived';
  createdTime: string;
  updatedTime: string;
  creator: string;
  tags: string[];
  versions: ModelVersion[];
  signature: ModelSignature;
  dependencies: Dependency[];
}

const ModelDetailPage: React.FC = () => {
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id') || '1';
  // 这里可以根据传入的 modelId 获取真实的模型数据
  // 暂时使用模拟数据
  const modelDetail: ModelDetail = {
    id: modelId,
    name: modelId === '1' ? '水质预测模型' : modelId === '2' ? '用水量预测模型' : '管网漏损检测模型',
    description: modelId === '1' ? '基于历史水质数据预测pH、浊度、余氯等水质指标，适用于供水水质监测场景' : 
                modelId === '2' ? '基于时间序列的用水量预测模型，用于供水调度优化' : 
                '基于压力、流量数据检测管网漏损位置，用于管网维护',
    framework: modelId === '1' ? 'TensorFlow' : modelId === '2' ? 'PyTorch' : 'Scikit-learn',
    version: 'v1.2.3',
    stage: 'production',
    createdTime: '2024-01-15 10:30:00',
    updatedTime: '2024-01-20 14:22:15',
    creator: '张三',
    tags: ['水质监测', '回归模型', '时间序列'],
    versions: [
      {
        id: 'v1.0.0',
        version: 'v1.0.0',
        stage: 'archived',
        createdTime: '2024-01-10 09:15:00',
        creator: '张三',
        description: '初始版本，实现基础协同过滤算法'
      },
      {
        id: 'v1.1.0',
        version: 'v1.1.0',
        stage: 'staging',
        createdTime: '2024-01-12 14:20:00',
        creator: '李四',
        description: '加入深度学习特征提取模块'
      },
      {
        id: 'v1.2.3',
        version: 'v1.2.3',
        stage: 'production',
        createdTime: '2024-01-20 14:22:15',
        creator: '张三',
        description: '优化性能，增加实时更新能力'
      }
    ],
    signature: {
      inputs: [
        {
          name: 'user_features',
          type: 'tensor',
          shape: '[batch_size, user_feature_dim]',
          description: '用户特征向量'
        },
        {
          name: 'item_features',
          type: 'tensor',
          shape: '[batch_size, item_feature_dim]',
          description: '物品特征向量'
        },
        {
          name: 'context_features',
          type: 'tensor',
          shape: '[batch_size, context_feature_dim]',
          description: '上下文特征向量'
        }
      ],
      outputs: [
        {
          name: 'recommendation_scores',
          type: 'tensor',
          shape: '[batch_size, num_items]',
          description: '推荐分数，表示每个物品的推荐度'
        }
      ]
    },
    dependencies: [
      { name: 'tensorflow', version: '2.8.0', status: 'installed' },
      { name: 'numpy', version: '1.21.0', status: 'installed' },
      { name: 'pandas', version: '1.4.0', status: 'installed' },
      { name: 'scikit-learn', version: '1.1.0', status: 'outdated' },
      { name: 'requests', version: '2.28.0', status: 'installed' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <MdButton 
          variant="outline" 
          size="sm"
          onClick={() => {
            window.location.href = '/categories/model-center/model-registry/model-registry';
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </MdButton>
        <h1 className="text-2xl font-bold tracking-tight">{modelDetail.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>模型信息</MdCardTitle>
              <MdCardDescription>模型的基本信息和元数据</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">模型ID</h3>
                  <p className="text-sm">{modelDetail.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">版本</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{modelDetail.version}</p>
                    <MdBadge variant={modelDetail.stage === 'production' ? 'primary' : 
                                    modelDetail.stage === 'staging' ? 'secondary' : 'danger'}>
                      {modelDetail.stage === 'production' ? '生产' : 
                       modelDetail.stage === 'staging' ? '预发布' : '已归档'}
                    </MdBadge>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">框架</h3>
                  <p className="text-sm">{modelDetail.framework}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">创建者</h3>
                  <p className="text-sm">{modelDetail.creator}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">描述</h3>
                  <p className="text-sm">{modelDetail.description}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {modelDetail.tags.map((tag, index) => (
                      <MdBadge key={index} variant="outline">{tag}</MdBadge>
                    ))}
                  </div>
                </div>
              </div>
            </MdCardContent>
          </MdCard>

          <MdCard>
            <MdCardHeader>
              <MdCardTitle>模型签名</MdCardTitle>
              <MdCardDescription>定义模型输入输出的数据格式和类型</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    输入 (Inputs)
                  </h3>
                  <div className="border rounded-lg divide-y">
                    {modelDetail.signature.inputs.map((input, index) => (
                      <div key={index} className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground">名称</h4>
                          <p className="text-sm">{input.name}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground">类型</h4>
                          <p className="text-sm">{input.type}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground">形状</h4>
                          <p className="text-sm">{input.shape}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground">描述</h4>
                          <p className="text-sm">{input.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    输出 (Outputs)
                  </h3>
                  <div className="border rounded-lg divide-y">
                    {modelDetail.signature.outputs.map((output, index) => (
                      <div key={index} className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground">名称</h4>
                          <p className="text-sm">{output.name}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground">类型</h4>
                          <p className="text-sm">{output.type}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground">形状</h4>
                          <p className="text-sm">{output.shape}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground">描述</h4>
                          <p className="text-sm">{output.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MdCardContent>
          </MdCard>

          <MdCard>
            <MdCardHeader>
              <MdCardTitle>依赖包管理</MdCardTitle>
              <MdCardDescription>模型运行所需的依赖包及其版本</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <div className="border rounded-lg divide-y">
                {modelDetail.dependencies.map((dep, index) => (
                  <div key={index} className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">包名</h4>
                      <p className="text-sm">{dep.name}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">版本</h4>
                      <p className="text-sm">{dep.version}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">状态</h4>
                      <MdBadge variant={dep.status === 'installed' ? 'success' : 
                                      dep.status === 'missing' ? 'danger' : 'warning'}>
                        {dep.status === 'installed' ? '已安装' : 
                         dep.status === 'missing' ? '缺失' : '待更新'}
                      </MdBadge>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">操作</h4>
                      <div className="flex gap-2">
                        <MdButton variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          下载
                        </MdButton>
                        <MdButton variant="outline" size="sm">
                          <Upload className="h-3 w-3 mr-1" />
                          更新
                        </MdButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MdCardContent>
          </MdCard>
        </div>

        <div className="space-y-6">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>版本历史</MdCardTitle>
              <MdCardDescription>模型的所有版本记录</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <div className="space-y-4">
                {modelDetail.versions.map((version, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{version.version}</h4>
                        <p className="text-xs text-muted-foreground">{version.createdTime} · {version.creator}</p>
                      </div>
                      <MdBadge variant={version.stage === 'production' ? 'primary' : 
                                      version.stage === 'staging' ? 'secondary' : 'danger'}>
                        {version.stage === 'production' ? '生产' : 
                         version.stage === 'staging' ? '预发布' : '已归档'}
                      </MdBadge>
                    </div>
                    <p className="text-sm mt-2 text-muted-foreground">{version.description}</p>
                  </div>
                ))}
              </div>
            </MdCardContent>
          </MdCard>

          <MdCard>
            <MdCardHeader>
              <MdCardTitle>操作</MdCardTitle>
              <MdCardDescription>对模型执行的操作</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-3">
              <MdButton className="w-full">
                <Download className="h-4 w-4 mr-2" />
                下载模型
              </MdButton>
              <MdButton variant="outline" className="w-full">
                <History className="h-4 w-4 mr-2" />
                版本管理
              </MdButton>
              <MdButton variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                查看文档
              </MdButton>
              <MdButton variant="outline" className="w-full text-red-600 hover:text-red-700">
                <Upload className="h-4 w-4 mr-2" />
                部署到生产环境
              </MdButton>
            </MdCardContent>
          </MdCard>
        </div>
      </div>
    </div>
  );
};

export { ModelDetailPage };