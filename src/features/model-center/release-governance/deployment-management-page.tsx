"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Search, Plus, Eye, Edit, RotateCcw, Power, Activity, History, GitBranch, Settings } from 'lucide-react';

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

const DeploymentManagementPage: React.FC = () => {
  const router = useRouter();
  
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [filteredDeployments, setFilteredDeployments] = useState<Deployment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [versionSwitchDrawerOpen, setVersionSwitchDrawerOpen] = useState(false);
  const [createDeployDrawerOpen, setCreateDeployDrawerOpen] = useState(false);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);
  const [targetVersion, setTargetVersion] = useState('');
  const [grayScaleRatio, setGrayScaleRatio] = useState(10);
  
  // 新建部署表单数据
  const [newDeployment, setNewDeployment] = useState({
    modelId: '',
    modelName: '',
    modelVersion: '',
    environment: 'staging' as 'staging' | 'production',
    cpu: '2',
    memory: '4GB',
    gpu: '',
    endpoint: '',
    description: ''
  });

  useEffect(() => {
    // 模拟数据
    const mockDeployments: Deployment[] = [
      {
        id: '1',
        modelId: 'model-001',
        modelName: '污水处理效果预测模型',
        modelVersion: 'v1.2.3',
        environment: 'production',
        status: 'running',
        resourceConfig: {
          cpu: '4核',
          memory: '8GB',
          gpu: '1x NVIDIA T4'
        },
        endpoints: ['https://api.waterworks.com/v1/wastewater-prediction'],
        healthCheck: {
          status: 'healthy',
          lastCheckTime: '2024-01-20 16:00:00'
        },
        createTime: '2024-01-20 15:00:00',
        updateTime: '2024-01-20 15:00:00',
        creator: '张三'
      },
      {
        id: '2',
        modelId: 'model-002',
        modelName: '水质监测预警模型',
        modelVersion: 'v2.1.0',
        environment: 'staging',
        status: 'running',
        resourceConfig: {
          cpu: '2核',
          memory: '4GB'
        },
        endpoints: ['https://staging-api.waterworks.com/v1/water-quality-monitor'],
        healthCheck: {
          status: 'healthy',
          lastCheckTime: '2024-01-20 16:00:00'
        },
        createTime: '2024-01-19 10:00:00',
        updateTime: '2024-01-19 10:00:00',
        creator: '李四'
      },
      {
        id: '3',
        modelId: 'model-003',
        modelName: '污水流量预测模型',
        modelVersion: 'v1.0.5',
        environment: 'production',
        status: 'updating',
        resourceConfig: {
          cpu: '8核',
          memory: '16GB',
          gpu: '2x NVIDIA V100'
        },
        endpoints: ['https://api.waterworks.com/v1/flow-prediction'],
        healthCheck: {
          status: 'unhealthy',
          lastCheckTime: '2024-01-20 15:30:00'
        },
        createTime: '2024-01-18 14:00:00',
        updateTime: '2024-01-20 15:30:00',
        creator: '王五'
      }
    ];
    setDeployments(mockDeployments);
    setFilteredDeployments(mockDeployments);

    // 模拟部署历史
    setDeploymentHistory([
      {
        id: 'h1',
        deploymentId: '1',
        action: 'deploy',
        toVersion: 'v1.2.3',
        operator: '张三',
        operateTime: '2024-01-20 15:00:00',
        status: 'success'
      },
      {
        id: 'h2',
        deploymentId: '2',
        action: 'update',
        fromVersion: 'v2.0.0',
        toVersion: 'v2.1.0',
        operator: '李四',
        operateTime: '2024-01-19 10:00:00',
        status: 'success'
      },
      {
        id: 'h3',
        deploymentId: '3',
        action: 'update',
        fromVersion: 'v1.0.4',
        toVersion: 'v1.0.5',
        operator: '王五',
        operateTime: '2024-01-20 15:30:00',
        status: 'success'
      }
    ]);
  }, []);

  useEffect(() => {
    let result = deployments;
    
    if (searchTerm) {
      result = result.filter(d => 
        d.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.modelVersion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (environmentFilter !== 'all') {
      result = result.filter(d => d.environment === environmentFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter);
    }
    
    setFilteredDeployments(result);
  }, [searchTerm, environmentFilter, statusFilter, deployments]);

  const handleDeploy = () => {
    setCreateDeployDrawerOpen(true);
    // 重置表单
    setNewDeployment({
      modelId: '',
      modelName: '',
      modelVersion: '',
      environment: 'staging',
      cpu: '2',
      memory: '4GB',
      gpu: '',
      endpoint: '',
      description: ''
    });
  };

  const handleCreateDeployment = () => {
    // 验证必填字段
    if (!newDeployment.modelId || !newDeployment.modelName || !newDeployment.modelVersion) {
      alert('请填写模型信息');
      return;
    }
    if (!newDeployment.endpoint) {
      alert('请填写部署端点');
      return;
    }

    // 创建新部署
    const deployment: Deployment = {
      id: `deploy-${Date.now()}`,
      modelId: newDeployment.modelId,
      modelName: newDeployment.modelName,
      modelVersion: newDeployment.modelVersion,
      environment: newDeployment.environment,
      status: 'running',
      resourceConfig: {
        cpu: `${newDeployment.cpu}核`,
        memory: newDeployment.memory,
        ...(newDeployment.gpu && { gpu: newDeployment.gpu })
      },
      endpoints: [newDeployment.endpoint],
      healthCheck: {
        status: 'healthy',
        lastCheckTime: new Date().toLocaleString('zh-CN')
      },
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
      creator: '当前用户' // 实际应该从用户上下文获取
    };

    setDeployments([...deployments, deployment]);
    setCreateDeployDrawerOpen(false);
    alert('部署任务创建成功！');
  };

  const handleUpdateVersion = (deployment: Deployment) => {
    setSelectedDeployment(deployment);
    setVersionSwitchDrawerOpen(true);
  };

  const handleRollback = (deployment: Deployment) => {
    if (confirm(`确定回滚部署 ${deployment.modelName} 到上一个版本？`)) {
      // 模拟回滚
      setDeployments(deployments.map(d => 
        d.id === deployment.id 
          ? { ...d, status: 'rolling_back' as const }
          : d
      ));
      setTimeout(() => {
        setDeployments(deployments.map(d => 
          d.id === deployment.id 
            ? { ...d, status: 'running' as const, modelVersion: 'v1.2.2' }
            : d
        ));
      }, 2000);
    }
  };

  const handleStop = (deployment: Deployment) => {
    if (confirm(`确定停止部署 ${deployment.modelName}？`)) {
      setDeployments(deployments.map(d => 
        d.id === deployment.id 
          ? { ...d, status: 'stopped' as const }
          : d
      ));
    }
  };

  const handleStart = (deployment: Deployment) => {
    setDeployments(deployments.map(d => 
      d.id === deployment.id 
        ? { ...d, status: 'running' as const }
        : d
    ));
  };

  const handleViewHistory = (deployment: Deployment) => {
    setSelectedDeployment(deployment);
    setHistoryDrawerOpen(true);
  };

  const handleVersionSwitch = () => {
    if (!targetVersion) {
      alert('请选择目标版本');
      return;
    }
    if (selectedDeployment) {
      setDeployments(deployments.map(d => 
        d.id === selectedDeployment.id 
          ? { ...d, status: 'updating' as const, modelVersion: targetVersion }
          : d
      ));
      setTimeout(() => {
        setDeployments(deployments.map(d => 
          d.id === selectedDeployment.id 
            ? { ...d, status: 'running' as const }
            : d
        ));
      }, 3000);
      setVersionSwitchDrawerOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <MdCardTitle>部署管理</MdCardTitle>
              <MdCardDescription>
                管理模型在生产环境的部署实例，支持版本切换、回滚等操作
              </MdCardDescription>
            </div>
            <MdButton onClick={handleDeploy}>
              <Plus className="mr-2 h-4 w-4" />
              新建部署
            </MdButton>
          </div>
        </MdCardHeader>
        <MdCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">{deployments.length}</div>
              <div className="text-xs text-muted-foreground">部署总数</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-green-600">
                {deployments.filter(d => d.status === 'running').length}
              </div>
              <div className="text-xs text-muted-foreground">运行中</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-blue-600">
                {deployments.filter(d => d.status === 'updating').length}
              </div>
              <div className="text-xs text-muted-foreground">更新中</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-red-600">
                {deployments.filter(d => d.healthCheck.status === 'unhealthy').length}
              </div>
              <div className="text-xs text-muted-foreground">不健康</div>
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
                  { value: 'all', label: '全部环境' }, 
                  { value: 'staging', label: '预发布' }, 
                  { value: 'production', label: '生产' }
                ]}
                value={environmentFilter}
                onChange={setEnvironmentFilter}
                className="w-[150px]"
              />
              <MdSelect 
                options={[
                  { value: 'all', label: '全部状态' }, 
                  { value: 'running', label: '运行中' }, 
                  { value: 'stopped', label: '已停止' },
                  { value: 'updating', label: '更新中' },
                  { value: 'rolling_back', label: '回滚中' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-[150px]"
              />
            </div>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-0">
          <div className="space-y-4 p-4">
            {filteredDeployments.map((deployment) => (
              <div key={deployment.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{deployment.modelName}</h3>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">版本:</span>
                        <span className="ml-2 font-medium">{deployment.modelVersion}</span>
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
                    <div className="text-xs text-muted-foreground mt-2">
                      创建时间: {deployment.createTime} | 创建者: {deployment.creator}
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
                      onClick={() => handleUpdateVersion(deployment)}
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
                          disabled={deployment.status === 'updating' || deployment.status === 'rolling_back'}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          回滚
                        </MdButton>
                        <MdButton 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStop(deployment)}
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
                        onClick={() => handleStart(deployment)}
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
        </MdCardContent>
      </MdCard>

      {/* 部署历史抽屉 */}
      <MdDrawer
        open={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        title={`部署历史 - ${selectedDeployment?.modelName}`}
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

      {/* 版本切换抽屉 */}
      <MdDrawer
        open={versionSwitchDrawerOpen}
        onClose={() => setVersionSwitchDrawerOpen(false)}
        title={`版本切换 - ${selectedDeployment?.modelName}`}
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
            <MdButton variant="outline" onClick={() => setVersionSwitchDrawerOpen(false)}>
              取消
            </MdButton>
            <MdButton onClick={handleVersionSwitch}>
              确认切换
            </MdButton>
          </div>
        </div>
      </MdDrawer>

      {/* 新建部署抽屉 */}
      <MdDrawer
        open={createDeployDrawerOpen}
        onClose={() => setCreateDeployDrawerOpen(false)}
        title="新建部署任务"
        width="700px"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              选择模型 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <MdInput
                placeholder="模型ID"
                value={newDeployment.modelId}
                onChange={(e) => setNewDeployment({ ...newDeployment, modelId: e.target.value })}
                className="flex-1"
              />
              <MdButton 
                variant="outline"
                onClick={() => {
                  // 模拟从模型注册表选择模型
                  const mockModels = [
                    { id: 'model-001', name: '污水处理效果预测模型', versions: ['v1.2.3', 'v1.2.4'] },
                    { id: 'model-002', name: '水质监测预警模型', versions: ['v2.1.0', 'v2.1.1'] },
                    { id: 'model-003', name: '污水流量预测模型', versions: ['v1.0.5', 'v1.0.6'] }
                  ];
                  const selected = mockModels[0];
                  setNewDeployment({
                    ...newDeployment,
                    modelId: selected.id,
                    modelName: selected.name,
                    modelVersion: selected.versions[0]
                  });
                }}
              >
                选择模型
              </MdButton>
            </div>
            {newDeployment.modelName && (
              <div className="mt-2 text-sm text-muted-foreground">
                已选择: {newDeployment.modelName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              模型版本 <span className="text-red-500">*</span>
            </label>
            <MdSelect
              options={[
                { value: 'v1.2.3', label: 'v1.2.3' },
                { value: 'v1.2.4', label: 'v1.2.4' },
                { value: 'v2.1.0', label: 'v2.1.0' },
                { value: 'v1.0.5', label: 'v1.0.5' }
              ]}
              value={newDeployment.modelVersion}
              onChange={(value) => setNewDeployment({ ...newDeployment, modelVersion: value })}
              placeholder="请选择模型版本"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              部署环境 <span className="text-red-500">*</span>
            </label>
            <MdSelect
              options={[
                { value: 'staging', label: '预发布环境' },
                { value: 'production', label: '生产环境' }
              ]}
              value={newDeployment.environment}
              onChange={(value) => setNewDeployment({ ...newDeployment, environment: value as 'staging' | 'production' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                CPU资源 <span className="text-red-500">*</span>
              </label>
              <MdSelect
                options={[
                  { value: '1', label: '1核' },
                  { value: '2', label: '2核' },
                  { value: '4', label: '4核' },
                  { value: '8', label: '8核' },
                  { value: '16', label: '16核' }
                ]}
                value={newDeployment.cpu}
                onChange={(value) => setNewDeployment({ ...newDeployment, cpu: value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                内存资源 <span className="text-red-500">*</span>
              </label>
              <MdSelect
                options={[
                  { value: '2GB', label: '2GB' },
                  { value: '4GB', label: '4GB' },
                  { value: '8GB', label: '8GB' },
                  { value: '16GB', label: '16GB' },
                  { value: '32GB', label: '32GB' }
                ]}
                value={newDeployment.memory}
                onChange={(value) => setNewDeployment({ ...newDeployment, memory: value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GPU资源（可选）</label>
            <MdSelect
              options={[
                { value: '', label: '不使用GPU' },
                { value: '1x NVIDIA T4', label: '1x NVIDIA T4' },
                { value: '2x NVIDIA T4', label: '2x NVIDIA T4' },
                { value: '1x NVIDIA V100', label: '1x NVIDIA V100' },
                { value: '2x NVIDIA V100', label: '2x NVIDIA V100' }
              ]}
              value={newDeployment.gpu}
              onChange={(value) => setNewDeployment({ ...newDeployment, gpu: value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              部署端点 <span className="text-red-500">*</span>
            </label>
            <MdInput
              placeholder="https://api.example.com/v1/model"
              value={newDeployment.endpoint}
              onChange={(e) => setNewDeployment({ ...newDeployment, endpoint: e.target.value })}
            />
            <div className="text-xs text-muted-foreground mt-1">
              模型的API访问地址
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">部署描述（可选）</label>
            <textarea
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="请输入部署描述..."
              value={newDeployment.description}
              onChange={(e) => setNewDeployment({ ...newDeployment, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <MdButton variant="outline" onClick={() => setCreateDeployDrawerOpen(false)}>
              取消
            </MdButton>
            <MdButton onClick={handleCreateDeployment}>
              创建部署任务
            </MdButton>
          </div>
        </div>
      </MdDrawer>
    </div>
  );
};

export { DeploymentManagementPage };
