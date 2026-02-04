"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdTable } from '@/components/enterprise-ui/md-table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdCheckbox } from '@/components/enterprise-ui/md-checkbox';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Search, Plus, Eye, Archive, Filter, Download, GitCompare, Trash2, Settings, RotateCcw, GitBranch, Power, Activity, History, ChevronDown, ChevronUp } from 'lucide-react';

// 部署实例摘要
interface DeploymentSummary {
  id: string;
  environment: 'staging' | 'production';
  version: string;
  status: 'running' | 'stopped' | 'updating' | 'rolling_back';
  healthStatus: 'healthy' | 'unhealthy';
  endpoint: string;
}

// 完整部署实例信息
interface Deployment {
  id: string;
  modelId: string;
  modelName: string;
  modelVersion: string;
  environment: 'staging' | 'production';
  status: 'running' | 'stopped' | 'updating' | 'rolling_back';
  resourceConfig: {
    cpu: string;
    memory: string;
    gpu?: string;
  };
  endpoints: string[];
  healthCheck: {
    status: 'healthy' | 'unhealthy';
    lastCheckTime: string;
  };
  createTime: string;
  updateTime: string;
  creator: string;
}

interface DeploymentHistory {
  id: string;
  deploymentId: string;
  action: 'deploy' | 'update' | 'rollback' | 'stop' | 'start';
  fromVersion?: string;
  toVersion?: string;
  operator: string;
  operateTime: string;
  status: 'success' | 'failed';
  reason?: string;
}

interface ModelInfo {
  [key: string]: unknown;
  id: string;
  name: string;
  version: string;
  environment: 'staging' | 'production';
  framework: string;
  signature: string;
  dependencies: string[];
  createdTime: string;
  updatedTime: string;
  creator: string;
  status: 'draft' | 'registered' | 'archived';
  // 新增部署相关字段
  deployments?: DeploymentSummary[];
  deploymentCount?: number;
  runningDeploymentCount?: number;
  healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
}

const ModelRegistryPage: React.FC = () => {
  const router = useRouter();
  
  const [models, setModels] = useState<ModelInfo[]>([
    {
      id: '1',
      name: '污水处理效果预测模型',
      version: 'v1.2.3',
      environment: 'production',
      framework: 'TensorFlow',
      signature: 'input: tensor[batch, 15], output: tensor[batch, 1]',
      dependencies: ['tensorflow==2.8.0', 'numpy>=1.19.0', 'pandas>=1.3.0'],
      createdTime: '2024-01-15 10:30:00',
      updatedTime: '2024-01-20 14:22:15',
      creator: '张三',
      status: 'registered',
      deployments: [
        {
          id: 'deploy-1',
          environment: 'production',
          version: 'v1.2.3',
          status: 'running',
          healthStatus: 'healthy',
          endpoint: 'https://api.waterworks.com/v1/wastewater-prediction'
        }
      ],
      deploymentCount: 1,
      runningDeploymentCount: 1,
      healthStatus: 'healthy'
    },
    {
      id: '2',
      name: '水质监测预警模型',
      version: 'v2.1.0',
      environment: 'staging',
      framework: 'PyTorch',
      signature: 'input: features[12], output: probability[1]',
      dependencies: ['torch==1.12.0', 'scikit-learn>=1.0.0', 'scipy>=1.7.0'],
      createdTime: '2024-01-18 09:15:00',
      updatedTime: '2024-01-19 16:45:22',
      creator: '李四',
      status: 'registered',
      deployments: [],
      deploymentCount: 0,
      runningDeploymentCount: 0,
      healthStatus: 'unknown'
    },
    {
      id: '3',
      name: '污水流量预测模型',
      version: 'v1.0.5',
      environment: 'staging',
      framework: 'Transformers',
      signature: 'input: time_series[sequence], output: flow_rate[float]',
      dependencies: ['transformers==4.21.0', 'tokenizers>=0.12.0', 'statsmodels>=0.13.0'],
      createdTime: '2024-01-20 11:20:00',
      updatedTime: '2024-01-21 10:10:05',
      creator: '王五',
      status: 'registered',
      deployments: [],
      deploymentCount: 0,
      runningDeploymentCount: 0,
      healthStatus: 'unknown'
    },
    {
      id: '4',
      name: '污泥处理优化模型',
      version: 'v3.0.1',
      environment: 'production',
      framework: 'OpenCV',
      signature: 'input: sludge_params[dict], output: optimal_config[dict]',
      dependencies: ['opencv-python==4.8.0', 'pillow>=9.0.0', 'scikit-optimize>=0.9.0'],
      createdTime: '2024-01-10 08:00:00',
      updatedTime: '2024-01-22 15:30:00',
      creator: '赵六',
      status: 'archived',
      deployments: [
        {
          id: 'deploy-4-1',
          environment: 'production',
          version: 'v3.0.1',
          status: 'running',
          healthStatus: 'healthy',
          endpoint: 'https://api.waterworks.com/v1/sludge-optimization'
        },
        {
          id: 'deploy-4-2',
          environment: 'staging',
          version: 'v3.0.1',
          status: 'stopped',
          healthStatus: 'unhealthy',
          endpoint: 'https://staging-api.waterworks.com/v1/sludge-optimization'
        }
      ],
      deploymentCount: 2,
      runningDeploymentCount: 1,
      healthStatus: 'healthy'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [compareModels, setCompareModels] = useState<ModelInfo[]>([]);
  // 部署管理相关状态
  const [deploymentDrawerOpen, setDeploymentDrawerOpen] = useState(false);
  const [selectedModelForDeployment, setSelectedModelForDeployment] = useState<ModelInfo | null>(null);
  const [modelDeployments, setModelDeployments] = useState<Deployment[]>([]);
  const [expandedModelIds, setExpandedModelIds] = useState<Set<string>>(new Set());
  const [versionSwitchDrawerOpen, setVersionSwitchDrawerOpen] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [targetVersion, setTargetVersion] = useState('');
  const [grayScaleRatio, setGrayScaleRatio] = useState(10);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  // 只显示已部署到生产环境的模型
  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          model.version.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
    // 只显示生产环境的模型
    const matchesEnvironment = model.environment === 'production';
    return matchesSearch && matchesStatus && matchesEnvironment;
  });

  // 批量操作
  const handleBatchArchive = () => {
    if (selectedModels.size === 0) {
      alert('请先选择要归档的模型');
      return;
    }
    if (confirm(`确定归档选中的 ${selectedModels.size} 个模型？`)) {
      setModels(models.map(model => 
        selectedModels.has(model.id) 
          ? { ...model, status: 'archived' as const }
          : model
      ));
      setSelectedModels(new Set());
    }
  };

  const handleBatchExport = () => {
    if (selectedModels.size === 0) {
      alert('请先选择要导出的模型');
      return;
    }
    const selectedData = models.filter(m => selectedModels.has(m.id));
    const dataStr = JSON.stringify(selectedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `models_export_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 版本对比
  const handleCompareVersions = () => {
    if (selectedModels.size !== 2) {
      alert('请选择两个模型进行版本对比');
      return;
    }
    const selected = Array.from(selectedModels).map(id => 
      models.find(m => m.id === id)
    ).filter(Boolean) as ModelInfo[];
    setCompareModels(selected);
    setCompareDrawerOpen(true);
  };

  // 全选/取消全选
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedModels(new Set(filteredModels.map(m => m.id)));
    } else {
      setSelectedModels(new Set());
    }
  };

  // 切换单个选择
  const toggleSelectModel = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedModels);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedModels(newSelected);
  };

  const allSelected = filteredModels.length > 0 && filteredModels.every(m => selectedModels.has(m.id));
  const someSelected = selectedModels.size > 0 && selectedModels.size < filteredModels.length;

  // 部署管理相关函数
  const handleOpenDeploymentDrawer = (model: ModelInfo) => {
    setSelectedModelForDeployment(model);
    // 模拟获取该模型的部署实例
    const mockDeployments: Deployment[] = model.deployments?.map(dep => ({
      id: dep.id,
      modelId: model.id,
      modelName: model.name,
      modelVersion: dep.version,
      environment: dep.environment,
      status: dep.status,
      resourceConfig: {
        cpu: '4核',
        memory: '8GB',
        gpu: dep.environment === 'production' ? '1x NVIDIA T4' : undefined
      },
      endpoints: [dep.endpoint],
      healthCheck: {
        status: dep.healthStatus,
        lastCheckTime: new Date().toLocaleString('zh-CN')
      },
      createTime: model.createdTime,
      updateTime: model.updatedTime,
      creator: model.creator
    })) || [];
    setModelDeployments(mockDeployments);
    setDeploymentDrawerOpen(true);
  };

  const handleVersionSwitch = (deployment: Deployment) => {
    setSelectedDeployment(deployment);
    setVersionSwitchDrawerOpen(true);
  };

  const handleConfirmVersionSwitch = () => {
    if (!targetVersion || !selectedDeployment) {
      alert('请选择目标版本');
      return;
    }
    // 模拟版本切换
    setModelDeployments(modelDeployments.map(d => 
      d.id === selectedDeployment.id 
        ? { ...d, status: 'updating' as const, modelVersion: targetVersion }
        : d
    ));
    setTimeout(() => {
      setModelDeployments(modelDeployments.map(d => 
        d.id === selectedDeployment.id 
          ? { ...d, status: 'running' as const }
          : d
      ));
    }, 2000);
    setVersionSwitchDrawerOpen(false);
    setTargetVersion('');
  };

  const handleRollback = (deployment: Deployment) => {
    if (confirm(`确定回滚部署 ${deployment.modelName} 到上一个版本？`)) {
      setModelDeployments(modelDeployments.map(d => 
        d.id === deployment.id 
          ? { ...d, status: 'rolling_back' as const }
          : d
      ));
      setTimeout(() => {
        setModelDeployments(modelDeployments.map(d => 
          d.id === deployment.id 
            ? { ...d, status: 'running' as const, modelVersion: 'v1.2.2' }
            : d
        ));
      }, 2000);
    }
  };

  const handleStartStop = (deployment: Deployment) => {
    const action = deployment.status === 'running' ? '停止' : '启动';
    if (confirm(`确定${action}部署 ${deployment.modelName}？`)) {
      const newStatus: 'running' | 'stopped' = deployment.status === 'running' ? 'stopped' : 'running';
      setModelDeployments(modelDeployments.map(d => 
        d.id === deployment.id 
          ? { ...d, status: newStatus }
          : d
      ));
    }
  };

  const handleViewHistory = (deployment: Deployment) => {
    setSelectedDeployment(deployment);
    // 模拟部署历史
    setDeploymentHistory([
      {
        id: 'h1',
        deploymentId: deployment.id,
        action: 'deploy',
        toVersion: deployment.modelVersion,
        operator: '张三',
        operateTime: deployment.createTime,
        status: 'success'
      },
      {
        id: 'h2',
        deploymentId: deployment.id,
        action: 'update',
        fromVersion: 'v1.2.2',
        toVersion: deployment.modelVersion,
        operator: '李四',
        operateTime: deployment.updateTime,
        status: 'success'
      }
    ]);
    setHistoryDrawerOpen(true);
  };

  const toggleExpandModel = (modelId: string) => {
    const newExpanded = new Set(expandedModelIds);
    if (newExpanded.has(modelId)) {
      newExpanded.delete(modelId);
    } else {
      newExpanded.add(modelId);
    }
    setExpandedModelIds(newExpanded);
  };

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.environment === 'production').length}
              </div>
              <div className="text-xs text-muted-foreground">已部署模型总数</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.environment === 'production' && m.status === 'registered').length}
              </div>
              <div className="text-xs text-muted-foreground">运行中</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.environment === 'production' && m.status === 'archived').length}
              </div>
              <div className="text-xs text-muted-foreground">已归档</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.environment === 'production').reduce((acc, model) => acc + model.dependencies.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">依赖包总数</div>
            </div>
          </div>
        </MdCardContent>
      </MdCard>
      <MdCard>
        <MdCardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <MdInput
                  placeholder="搜索模型名称或版本..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <MdSelect 
                options={[
                  { value: 'all', label: '全部状态' }, 
                  { value: 'registered', label: '运行中' }, 
                  { value: 'archived', label: '已归档' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-[150px]"
              />
              <MdButton variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                高级筛选
              </MdButton>
            </div>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex gap-2">
              {selectedModels.size > 0 && (
                <>
                  <MdButton 
                    variant="outline" 
                    onClick={handleCompareVersions}
                    disabled={selectedModels.size !== 2}
                  >
                    <GitCompare className="mr-2 h-4 w-4" />
                    版本对比
                  </MdButton>
                  <MdButton variant="outline" onClick={handleBatchExport}>
                    <Download className="mr-2 h-4 w-4" />
                    批量导出
                  </MdButton>
                  <MdButton variant="outline" onClick={handleBatchArchive}>
                    <Archive className="mr-2 h-4 w-4" />
                    批量归档
                  </MdButton>
                </>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              已选择 {selectedModels.size} 项
            </div>
          </div>
          <MdTable<ModelInfo>
            data={filteredModels}
            columns={[
              {
                key: 'select',
                title: (
                  <MdCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleSelectAll}
                  />
                ),
                render: (value, row) => (
                  <MdCheckbox
                    checked={selectedModels.has(row.id)}
                    onChange={(checked) => toggleSelectModel(row.id, checked)}
                  />
                )
              },
              {
                key: 'name',
                title: '模型名称',
                render: (value, row) => (
                  <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">{row.signature}</div>
                  </div>
                )
              },
              {
                key: 'version',
                title: '版本',
                render: (value, row) => (
                  <span className="font-mono text-sm">{row.version}</span>
                )
              },
              {
                key: 'framework',
                title: '框架',
                render: (value, row) => row.framework
              },
              {
                key: 'dependencies',
                title: '依赖数量',
                render: (value, row) => (
                  <span className="text-sm">{row.dependencies.length} 个</span>
                )
              },
              {
                key: 'deploymentStatus',
                title: '部署状态',
                render: (value, row) => {
                  const deploymentCount = row.deploymentCount || 0;
                  const runningCount = row.runningDeploymentCount || 0;
                  const healthStatus = row.healthStatus || 'unknown';
                  
                  if (deploymentCount === 0) {
                    return <span className="text-sm text-muted-foreground">未部署</span>;
                  }

                  const isExpanded = expandedModelIds.has(row.id);
                  const deployments = row.deployments || [];

                  return (
                    <div className="space-y-2">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:text-primary"
                        onClick={() => toggleExpandModel(row.id)}
                      >
                        <div className="flex items-center gap-1">
                          {healthStatus === 'healthy' ? (
                            <span className="text-green-600">🟢</span>
                          ) : healthStatus === 'unhealthy' ? (
                            <span className="text-red-600">🔴</span>
                          ) : (
                            <span className="text-gray-400">⚪</span>
                          )}
                          <span className="text-sm">
                            {runningCount}个运行中 / {deploymentCount}个部署
                          </span>
                        </div>
                        {deployments.length > 0 && (
                          isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                      {isExpanded && deployments.length > 0 && (
                        <div className="ml-4 space-y-1 border-l-2 pl-2">
                          {deployments.map((dep) => (
                            <div key={dep.id} className="text-xs flex items-center gap-2">
                              <MdBadge 
                                variant={dep.environment === 'production' ? 'primary' : 'secondary'}
                                className="text-xs"
                              >
                                {dep.environment === 'production' ? '生产' : '预发布'}
                              </MdBadge>
                              <span className="font-mono">{dep.version}</span>
                              <MdBadge 
                                variant={
                                  dep.status === 'running' ? 'success' :
                                  dep.status === 'updating' || dep.status === 'rolling_back' ? 'warning' :
                                  'danger'
                                }
                                className="text-xs"
                              >
                                {dep.status === 'running' ? '运行中' :
                                 dep.status === 'stopped' ? '已停止' :
                                 dep.status === 'updating' ? '更新中' : '回滚中'}
                              </MdBadge>
                              {dep.healthStatus === 'unhealthy' && (
                                <span className="text-red-600">⚠️</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              },
              {
                key: 'creator',
                title: '创建者',
                render: (value, row) => row.creator
              },
              {
                key: 'createdTime',
                title: '创建时间',
                render: (value, row) => row.createdTime
              },
              {
                key: 'actions',
                title: '操作',
                render: (value, row) => (
                  <div className="flex gap-2">
                    <MdButton 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        router.push(`/categories/model-center/model-registry/model-detail?id=${row.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </MdButton>
                    {(row.deploymentCount || 0) > 0 && (
                      <MdButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDeploymentDrawer(row)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        部署管理
                      </MdButton>
                    )}
                    <MdButton 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (confirm('确定归档此模型？')) {
                          setModels(models.map(m => 
                            m.id === row.id ? { ...m, status: 'archived' as const } : m
                          ));
                        }
                      }}
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      归档
                    </MdButton>
                  </div>
                )
              }
            ]}
          />
        </MdCardContent>
      </MdCard>

      {/* 部署管理抽屉 */}
      <MdDrawer
        open={deploymentDrawerOpen}
        onClose={() => {
          setDeploymentDrawerOpen(false);
          setSelectedModelForDeployment(null);
          setModelDeployments([]);
        }}
        title={`部署管理 - ${selectedModelForDeployment?.name || ''}`}
        width="900px"
      >
        <div className="p-6 space-y-4">
          {selectedModelForDeployment && (
            <>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-semibold">{selectedModelForDeployment.name}</div>
                  <div className="text-sm text-muted-foreground">
                    版本: {selectedModelForDeployment.version} | 
                    部署实例: {modelDeployments.length} 个 | 
                    运行中: {modelDeployments.filter(d => d.status === 'running').length} 个
                  </div>
                </div>
              </div>

              {modelDeployments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  该模型暂无部署实例
                </div>
              ) : (
                <div className="space-y-4">
                  {modelDeployments.map((deployment) => (
                    <div key={deployment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <MdBadge variant={deployment.environment === 'production' ? 'primary' : 'secondary'}>
                              {deployment.environment === 'production' ? '生产' : '预发布'}
                            </MdBadge>
                            <MdBadge 
                              variant={
                                deployment.status === 'running' ? 'success' :
                                deployment.status === 'updating' || deployment.status === 'rolling_back' ? 'warning' :
                                'danger'
                              }
                            >
                              {deployment.status === 'running' ? '运行中' :
                               deployment.status === 'stopped' ? '已停止' :
                               deployment.status === 'updating' ? '更新中' :
                               '回滚中'}
                            </MdBadge>
                            <MdBadge variant={deployment.healthCheck.status === 'healthy' ? 'success' : 'danger'}>
                              {deployment.healthCheck.status === 'healthy' ? '健康' : '不健康'}
                            </MdBadge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                            <div>
                              <span className="text-muted-foreground">版本:</span>
                              <span className="ml-2 font-medium font-mono">{deployment.modelVersion}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CPU:</span>
                              <span className="ml-2">{deployment.resourceConfig.cpu}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">内存:</span>
                              <span className="ml-2">{deployment.resourceConfig.memory}</span>
                            </div>
                            {deployment.resourceConfig.gpu && (
                              <div>
                                <span className="text-muted-foreground">GPU:</span>
                                <span className="ml-2">{deployment.resourceConfig.gpu}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">端点:</span>
                            {deployment.endpoints.map((endpoint, idx) => (
                              <a 
                                key={idx} 
                                href={endpoint} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-primary hover:underline"
                              >
                                {endpoint}
                              </a>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <MdButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/categories/model-center/monitoring/performance-monitor?deploymentId=${deployment.id}`)}
                          >
                            <Activity className="mr-2 h-4 w-4" />
                            查看监控
                          </MdButton>
                          <MdButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewHistory(deployment)}
                          >
                            <History className="mr-2 h-4 w-4" />
                            部署历史
                          </MdButton>
                          <MdButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVersionSwitch(deployment)}
                            disabled={deployment.status === 'updating' || deployment.status === 'rolling_back'}
                          >
                            <GitBranch className="mr-2 h-4 w-4" />
                            版本切换
                          </MdButton>
                          {deployment.status === 'running' ? (
                            <>
                              <MdButton 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRollback(deployment)}
                                disabled={deployment.status !== 'running'}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                回滚
                              </MdButton>
                              <MdButton 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStartStop(deployment)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Power className="mr-2 h-4 w-4" />
                                停止
                              </MdButton>
                            </>
                          ) : (
                            <MdButton 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStartStop(deployment)}
                            >
                              <Power className="mr-2 h-4 w-4" />
                              启动
                            </MdButton>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </MdDrawer>

      {/* 版本切换抽屉 */}
      <MdDrawer
        open={versionSwitchDrawerOpen}
        onClose={() => {
          setVersionSwitchDrawerOpen(false);
          setSelectedDeployment(null);
          setTargetVersion('');
        }}
        title={`版本切换 - ${selectedDeployment?.modelName || ''}`}
        width="600px"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">当前版本</label>
            <div className="p-3 bg-muted rounded-lg">
              {selectedDeployment?.modelVersion}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">目标版本</label>
            <MdSelect
              options={[
                { value: 'v1.2.4', label: 'v1.2.4' },
                { value: 'v1.2.2', label: 'v1.2.2' },
                { value: 'v1.2.1', label: 'v1.2.1' }
              ]}
              value={targetVersion}
              onChange={setTargetVersion}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">灰度比例 (%)</label>
            <MdInput
              type="number"
              value={grayScaleRatio}
              onChange={(e) => setGrayScaleRatio(Number(e.target.value))}
              min={0}
              max={100}
            />
            <div className="text-xs text-muted-foreground mt-1">
              设置灰度发布的比例，0-100%
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <MdButton 
              variant="outline" 
              onClick={() => {
                setVersionSwitchDrawerOpen(false);
                setSelectedDeployment(null);
                setTargetVersion('');
              }}
            >
              取消
            </MdButton>
            <MdButton onClick={handleConfirmVersionSwitch}>
              确认切换
            </MdButton>
          </div>
        </div>
      </MdDrawer>

      {/* 部署历史抽屉 */}
      <MdDrawer
        open={historyDrawerOpen}
        onClose={() => {
          setHistoryDrawerOpen(false);
          setSelectedDeployment(null);
        }}
        title={`部署历史 - ${selectedDeployment?.modelName || ''}`}
        width="800px"
      >
        <div className="p-6 space-y-4">
          {deploymentHistory
            .filter(h => h.deploymentId === selectedDeployment?.id)
            .map((history) => (
              <div key={history.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {history.action === 'deploy' && '部署'}
                      {history.action === 'update' && '更新版本'}
                      {history.action === 'rollback' && '回滚'}
                      {history.action === 'stop' && '停止'}
                      {history.action === 'start' && '启动'}
                    </span>
                    {history.fromVersion && history.toVersion && (
                      <span className="text-sm text-muted-foreground">
                        {history.fromVersion} → {history.toVersion}
                      </span>
                    )}
                    {history.toVersion && !history.fromVersion && (
                      <span className="text-sm text-muted-foreground">
                        版本: {history.toVersion}
                      </span>
                    )}
                  </div>
                  <MdBadge variant={history.status === 'success' ? 'success' : 'danger'}>
                    {history.status === 'success' ? '成功' : '失败'}
                  </MdBadge>
                </div>
                <div className="text-sm text-muted-foreground">
                  操作人: {history.operator} | 时间: {history.operateTime}
                </div>
                {history.reason && (
                  <div className="text-sm text-muted-foreground mt-1">
                    原因: {history.reason}
                  </div>
                )}
              </div>
            ))}
        </div>
      </MdDrawer>

      {/* 版本对比抽屉 */}
      <MdDrawer
        open={compareDrawerOpen}
        onClose={() => setCompareDrawerOpen(false)}
        title="版本对比"
        width="800px"
      >
        <div className="p-6 space-y-4">
          {compareModels.length === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{compareModels[0].name}</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">版本:</span> {compareModels[0].version}</div>
                    <div><span className="text-muted-foreground">环境:</span> {compareModels[0].environment === 'production' ? '生产' : '预发布'}</div>
                    <div><span className="text-muted-foreground">框架:</span> {compareModels[0].framework}</div>
                    <div><span className="text-muted-foreground">依赖:</span> {compareModels[0].dependencies.length} 个</div>
                    <div><span className="text-muted-foreground">创建时间:</span> {compareModels[0].createdTime}</div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{compareModels[1].name}</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">版本:</span> {compareModels[1].version}</div>
                    <div><span className="text-muted-foreground">环境:</span> {compareModels[1].environment === 'production' ? '生产' : '预发布'}</div>
                    <div><span className="text-muted-foreground">框架:</span> {compareModels[1].framework}</div>
                    <div><span className="text-muted-foreground">依赖:</span> {compareModels[1].dependencies.length} 个</div>
                    <div><span className="text-muted-foreground">创建时间:</span> {compareModels[1].createdTime}</div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">依赖对比</h4>
                <div className="space-y-2">
                  {compareModels[0].dependencies.map((dep, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{dep}</span>
                      <span className={compareModels[1].dependencies.includes(dep) ? 'text-green-600' : 'text-red-600'}>
                        {compareModels[1].dependencies.includes(dep) ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </MdDrawer>
    </div>
  );
};

export { ModelRegistryPage };
