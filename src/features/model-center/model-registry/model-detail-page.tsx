"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdTable } from '@/components/enterprise-ui/md-table';
import { ArrowLeft, Download, Eye, Activity, FileText, GitBranch, Clock, Settings, RotateCcw, Power, History as HistoryIcon, Send, List, Layout, Sparkles, Loader2, Wrench, Monitor, Package } from 'lucide-react';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';

interface ModelInfo {
  id: string;
  name: string;
  version: string;
  environment: 'staging' | 'production';
  framework: string;
  description: string;
  modelCode?: string; // 模型编码
  inputSchema: Array<{ name: string; type: string; required: boolean; description: string; example?: string }>;
  outputSchema: Array<{ name: string; type: string; required: boolean; description: string; example?: string }>;
  evaluationMetrics?: Array<{ metricType: string; value?: number; description?: string }>;
  dependencies: Array<{ name: string; version: string }>;
  pythonVersion: string;
  cudaVersion?: string;
  fileSize: number;
  filePath: string;
  creator: string;
  createdTime: string;
  updatedTime: string;
  status: 'draft' | 'registered' | 'archived';
  published?: boolean; // 是否已发布到模型广场
  // 模型实验室创建时的字段
  category?: string; // 分类：回归、分类、排序、时序序列
  owner?: string; // 模型所有者：个人、所在组织
  programmingLanguage?: string; // 编程语言
  applicableScenarios?: string[]; // 适用场景（多选）
  tags?: string[]; // 标签（多选）
}

interface VersionHistory {
  version: string;
  environment: 'staging' | 'production';
  creator: string;
  createTime: string;
  description: string;
}

interface RelatedRecord {
  type: 'test' | 'deployment' | 'monitoring';
  id: string;
  name: string;
  status: string;
  time: string;
}

interface EvaluationMetrics {
  // 核心指标
  primaryMetric: {
    name: string; // 核心指标名称
    currentValue: number; // 当前值
    averageValue: number; // 平均值
    targetThreshold: string; // 目标阈值
    change?: number; // 变化百分比
  };
  // 误差指标
  errorMetric: {
    name: string; // 误差指标名称
    currentValue: number; // 当前值
    averageValue: number; // 平均值
    baselineValue?: number; // 基线值
    isBetterThanBaseline?: boolean; // 是否优于基线
  };
  // 评估次数
  evaluationCount: number;
  // 详细指标清单
  detailedMetrics: Array<{
    name: string; // 指标名称
    description: string; // 说明
    currentValue: string; // 当前值
    targetThreshold: string; // 目标/阈值
    deviation: string; // 偏差
    status: '达标' | '临界警告' | '不达标'; // 状态
  }>;
  // 历史趋势数据
  historicalTrend: Array<{
    runId: string; // 运行ID
    value: number; // 核心指标值
    date: string; // 日期
  }>;
  // 评估时间
  evaluationTime: string;
  // 模型ID
  modelRunId: string;
}

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

const ModelDetailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id');
  const tabParam = searchParams.get('tab');

  const [model, setModel] = useState<ModelInfo | null>(null);
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([]);
  const [relatedRecords, setRelatedRecords] = useState<RelatedRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'schema' | 'versions' | 'related' | 'deployments'>(
    (tabParam === 'deployments' ? 'deployments' : 'info') as 'info' | 'schema' | 'versions' | 'related' | 'deployments'
  );
  // 部署管理相关状态
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [versionSwitchDrawerOpen, setVersionSwitchDrawerOpen] = useState(false);
  const [targetVersion, setTargetVersion] = useState('');
  const [grayScaleRatio, setGrayScaleRatio] = useState(10);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  // 评价指标相关状态
  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetrics | null>(null);
  // 参数定义tab切换
  const [schemaViewMode, setSchemaViewMode] = useState<'list' | 'visual'>('visual');
  // 动态表单值
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  // AI输入文本
  const [aiInputText, setAiInputText] = useState('');
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);

  useEffect(() => {
    // 模拟数据加载
    if (modelId) {
      const mockModel: ModelInfo = {
        id: modelId,
        name: '污水处理效果预测模型',
        version: 'v1.2.3',
        environment: 'production',
        framework: 'TensorFlow',
        description: '基于历史污水处理数据预测出水水质指标，支持COD、BOD、NH3-N等关键参数预测',
        modelCode: 'MODEL-WW-001',
        category: '回归',
        owner: '所在组织',
        programmingLanguage: 'Python',
        applicableScenarios: ['污水处理', '水质预测'],
        tags: ['预测模型', '水质监测'],
        inputSchema: [
          { name: 'inflow_ph', type: 'float', required: true, description: '进水pH值', example: '7.2' },
          { name: 'inflow_cod', type: 'float', required: true, description: '进水COD浓度(mg/L)', example: '250.5' },
          { name: 'inflow_bod', type: 'float', required: true, description: '进水BOD浓度(mg/L)', example: '120.3' },
          { name: 'inflow_nh3_n', type: 'float', required: true, description: '进水氨氮浓度(mg/L)', example: '35.8' },
          { name: 'inflow_flow', type: 'float', required: true, description: '进水流量(m³/h)', example: '1500.0' },
          { name: 'temperature', type: 'float', required: true, description: '水温(℃)', example: '18.5' },
          { name: 'do_concentration', type: 'float', required: true, description: '溶解氧浓度(mg/L)', example: '4.2' },
          { name: 'mlss', type: 'float', required: true, description: '混合液悬浮固体浓度(mg/L)', example: '3500.0' },
          { name: 'sludge_age', type: 'float', required: true, description: '污泥龄(天)', example: '12.5' },
          { name: 'aeration_time', type: 'float', required: true, description: '曝气时间(小时)', example: '8.0' },
          { name: 'chemical_dosage', type: 'float', required: true, description: '加药量(kg)', example: '25.0' },
          { name: 'process_params', type: 'dict', required: true, description: '工艺参数', example: '{"a2o": true, "mbr": false}' }
        ],
        outputSchema: [
          { name: 'outflow_cod', type: 'float', required: true, description: '出水COD浓度(mg/L)', example: '45.2' },
          { name: 'outflow_bod', type: 'float', required: true, description: '出水BOD浓度(mg/L)', example: '12.5' },
          { name: 'outflow_nh3_n', type: 'float', required: true, description: '出水氨氮浓度(mg/L)', example: '3.2' },
          { name: 'removal_rate', type: 'float', required: true, description: '去除率(%)', example: '85.5' },
          { name: 'compliance_status', type: 'bool', required: true, description: '达标状态', example: 'true' }
        ],
        evaluationMetrics: [
          { metricType: 'R²', value: 0.92, description: '决定系数，衡量模型拟合优度' },
          { metricType: 'RMSE', value: 8.5, description: '均方根误差，预测误差的标准差' },
          { metricType: 'MAE', value: 6.2, description: '平均绝对误差，预测误差的平均值' },
          { metricType: 'MAPE', value: 5.8, description: '平均绝对百分比误差，相对误差指标' }
        ],
        dependencies: [
          { name: 'tensorflow', version: '==2.8.0' },
          { name: 'numpy', version: '>=1.19.0' },
          { name: 'pandas', version: '>=1.3.0' },
          { name: 'scikit-learn', version: '>=1.0.0' }
        ],
        pythonVersion: '3.8',
        cudaVersion: '11.8',
        fileSize: 125 * 1024 * 1024, // 125MB
        filePath: '/models/wastewater-treatment/v1.2.3/model.pkl',
        creator: '张三',
        createdTime: '2024-01-15 10:30:00',
        updatedTime: '2024-01-20 14:22:15',
        status: 'registered',
        published: true
      };
      setModel(mockModel);
      
      // 初始化表单值
      const initialValues: Record<string, any> = {};
      mockModel.inputSchema.forEach(param => {
        if (param.example) {
          try {
            // 尝试解析JSON示例
            initialValues[param.name] = JSON.parse(param.example);
          } catch {
            // 如果不是JSON，直接使用字符串
            initialValues[param.name] = param.example;
          }
        }
      });
      setFormValues(initialValues);

      // 版本历史
      setVersionHistory([
        { version: 'v1.2.3', environment: 'production', creator: '张三', createTime: '2024-01-20 14:22:15', description: '性能优化版本' },
        { version: 'v1.2.2', environment: 'staging', creator: '张三', createTime: '2024-01-18 09:15:00', description: '修复bug' },
        { version: 'v1.2.1', environment: 'production', creator: '李四', createTime: '2024-01-15 10:30:00', description: '初始版本' }
      ]);

      // 关联记录
      setRelatedRecords([
        { type: 'test', id: 'test-1', name: '冒烟测试-20240120', status: '通过', time: '2024-01-20 14:30:00' },
        { type: 'deployment', id: 'deploy-1', name: '生产环境部署', status: '运行中', time: '2024-01-20 15:00:00' },
        { type: 'monitoring', id: 'monitor-1', name: '性能监控', status: '正常', time: '2024-01-20 16:00:00' }
      ]);

      // 评价指标数据（T-1日离线计算）
      const today = new Date();
      const evaluationDate = new Date(today);
      evaluationDate.setDate(evaluationDate.getDate() - 1);
      
      setEvaluationMetrics({
        modelRunId: `run_${evaluationDate.toISOString().split('T')[0].replace(/-/g, '')}_v92`,
        evaluationTime: `${evaluationDate.toISOString().split('T')[0]} 08:00 (每日离线)`,
        primaryMetric: {
          name: 'R² Score (拟合度)',
          currentValue: 0.942,
          averageValue: 0.930,
          targetThreshold: '> 0.90',
          change: 1.2
        },
        errorMetric: {
          name: 'Error Rate (误差率)',
          currentValue: 0.058,
          averageValue: 0.061,
          baselineValue: 0.061,
          isBetterThanBaseline: true
        },
        evaluationCount: 156,
        detailedMetrics: [
          {
            name: 'R² Score (拟合度)',
            description: '模型对数据的解释能力',
            currentValue: '0.942',
            targetThreshold: '> 0.85',
            deviation: '+0.092',
            status: '达标'
          },
          {
            name: 'MAE (平均绝对误差)',
            description: '预测值与真实值的平均差距',
            currentValue: '1.24',
            targetThreshold: '< 2.00',
            deviation: '-0.76',
            status: '达标'
          },
          {
            name: 'RMAE (相对误差率)',
            description: '误差占真实值的百分比',
            currentValue: '4.8%',
            targetThreshold: '< 5.0%',
            deviation: '-0.2%',
            status: '临界警告'
          },
          {
            name: 'Inference Latency (耗时)',
            description: '单次推理平均耗时 (P99)',
            currentValue: '45ms',
            targetThreshold: '< 100ms',
            deviation: '-',
            status: '达标'
          }
        ],
        historicalTrend: [
          { runId: 'Run 86', value: 0.925, date: '2024-01-30' },
          { runId: 'Run 87', value: 0.928, date: '2024-01-31' },
          { runId: 'Run 88', value: 0.951, date: '2024-02-01' },
          { runId: 'Run 89', value: 0.935, date: '2024-02-02' },
          { runId: 'Run 90', value: 0.929, date: '2024-02-03' },
          { runId: 'Run 91', value: 0.931, date: '2024-02-04' },
          { runId: 'Run 92', value: 0.942, date: '2024-02-05' }
        ]
      });

      // 模拟部署实例数据
      setDeployments([
        {
          id: 'deploy-1',
          modelId: modelId,
          modelName: mockModel.name,
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
        }
      ]);
    }
  }, [modelId]);

  // 部署管理相关函数
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
    }, 2000);
    setVersionSwitchDrawerOpen(false);
    setTargetVersion('');
  };

  const handleRollback = (deployment: Deployment) => {
    if (confirm(`确定回滚部署 ${deployment.modelName} 到上一个版本？`)) {
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

  const handleStartStop = (deployment: Deployment) => {
    const action = deployment.status === 'running' ? '停止' : '启动';
    if (confirm(`确定${action}部署 ${deployment.modelName}？`)) {
      const newStatus: 'running' | 'stopped' = deployment.status === 'running' ? 'stopped' : 'running';
      setDeployments(deployments.map(d => 
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

  if (!model) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <MdCard>
        <MdCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MdCardTitle>{model.name}</MdCardTitle>
                <MdBadge variant={model.environment === 'production' ? 'primary' : 'secondary'}>
                  {model.environment === 'production' ? '生产' : '预发布'}
                </MdBadge>
                <MdBadge variant="outline">{model.version}</MdBadge>
              </div>
              <MdCardDescription>{model.description}</MdCardDescription>
            </div>
            <div className="flex gap-2">
              <MdButton variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </MdButton>
              {!model.published && (
                <MdButton onClick={() => router.push(`/categories/model-lab/release-governance/model-release-review?modelId=${model.id}`)}>
                  <Send className="mr-2 h-4 w-4" />
                  发布
                </MdButton>
              )}
            </div>
          </div>
        </MdCardHeader>
        <MdCardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">创建时间</div>
              <div className="font-medium">{model.createdTime}</div>
            </div>
            <div>
              <div className="text-muted-foreground">更新时间</div>
              <div className="font-medium">{model.updatedTime}</div>
            </div>
          </div>
        </MdCardContent>
      </MdCard>

      {/* 标签页 */}
      <MdCard>
        <MdCardHeader>
          <div className="flex border-b">
            {[
              { key: 'info', label: '基本信息', icon: FileText },
              { key: 'schema', label: '参数定义', icon: Eye },
              { key: 'versions', label: '版本历史', icon: GitBranch },
              { key: 'related', label: '模型评估', icon: Activity },
              { key: 'deployments', label: '部署管理', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </MdCardHeader>
        <MdCardContent className="pt-6">
          {/* 基本信息 */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* 模型基础信息 */}
              <div>
                <h3 className="font-semibold mb-4">模型基础信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  {model.modelCode && (
                    <div>
                      <div className="text-sm text-muted-foreground">模型编码</div>
                      <div className="font-medium">{model.modelCode}</div>
                    </div>
                  )}
                  {model.category && (
                    <div>
                      <div className="text-sm text-muted-foreground">分类</div>
                      <div className="font-medium">{model.category}</div>
                    </div>
                  )}
                  {model.owner && (
                    <div>
                      <div className="text-sm text-muted-foreground">模型所有者</div>
                      <div className="font-medium">{model.owner}</div>
                    </div>
                  )}
                  {model.programmingLanguage && (
                    <div>
                      <div className="text-sm text-muted-foreground">编程语言</div>
                      <div className="font-medium">{model.programmingLanguage}</div>
                    </div>
                  )}
                  {model.applicableScenarios && model.applicableScenarios.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground">适用场景</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {model.applicableScenarios.map((scenario, index) => (
                          <MdBadge key={index} variant="outline">{scenario}</MdBadge>
                        ))}
                      </div>
                    </div>
                  )}
                  {model.tags && model.tags.length > 0 && (
                    <div className="col-span-2">
                      <div className="text-sm text-muted-foreground">标签</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {model.tags.map((tag, index) => (
                          <MdBadge key={index} variant="secondary">{tag}</MdBadge>
                        ))}
                      </div>
                    </div>
                  )}
                  {model.description && (
                    <div className="col-span-2">
                      <div className="text-sm text-muted-foreground">模型描述</div>
                      <div className="mt-1 text-sm">{model.description}</div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">模型文件</h3>
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{model.filePath.split('/').pop()}</div>
                    <div className="text-sm text-muted-foreground">
                      {(model.fileSize / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <MdButton variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    下载
                  </MdButton>
                </div>
              </div>
            </div>
          )}

          {/* 参数定义 */}
          {activeTab === 'schema' && (
            <div className="space-y-6">
              {/* Tab切换 - 切换按钮居右 */}
              <div className="flex items-center justify-between border-b pb-4">
                <div></div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSchemaViewMode('visual')}
                    className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                      schemaViewMode === 'visual'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Layout className="h-4 w-4" />
                    可视化
                  </button>
                  <button
                    onClick={() => setSchemaViewMode('list')}
                    className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                      schemaViewMode === 'list'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <List className="h-4 w-4" />
                    列表展示
                  </button>
                </div>
              </div>

              {/* 可视化模式 - 三栏布局 */}
              {schemaViewMode === 'visual' && (
                <div className="grid grid-cols-3 gap-4">
                  {/* 左侧：Schema Config */}
                  <MdCard className="p-6 h-[calc(100vh-300px)] flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Wrench className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">Schema Config</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-auto h-full">
                        {JSON.stringify({
                          title: model.name,
                          parameters: model.inputSchema.map(param => ({
                            name: param.name,
                            label: param.name,
                            type: param.type,
                            widget: param.type === 'float' || param.type === 'int' ? 'slider' : 
                                   param.type === 'dict' ? 'textarea' : 'textarea',
                            default: param.example || '',
                            description: param.description || '',
                            required: param.required
                          }))
                        }, null, 2)}
                      </pre>
                    </div>
                  </MdCard>

                  {/* 中间：Dynamic UI */}
                  <MdCard className="p-6 h-[calc(100vh-300px)] flex flex-col overflow-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">Dynamic UI</h3>
                    </div>
                    <div className="flex-1 overflow-auto space-y-6">
                      {/* AI输入转表单 */}
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">AI 智能生成表单</span>
                        </div>
                        <div className="space-y-3">
                          <textarea
                            value={aiInputText}
                            onChange={(e) => setAiInputText(e.target.value)}
                            placeholder="描述你的需求..."
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[60px] resize-y"
                          />
                          <MdButton
                            onClick={() => {
                              setIsGeneratingSchema(true);
                              setTimeout(() => {
                                setIsGeneratingSchema(false);
                                alert('Schema生成功能需要接入AI服务');
                              }, 1500);
                            }}
                            disabled={!aiInputText.trim() || isGeneratingSchema}
                            size="sm"
                            className="w-full"
                          >
                            {isGeneratingSchema ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                生成中...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                生成表单
                              </>
                            )}
                          </MdButton>
                        </div>
                      </div>

                      {/* 输入参数表单 */}
                      {model.inputSchema.map((param, index) => {
                        const value = formValues[param.name] ?? param.example ?? '';
                        const widgetType = param.type === 'float' || param.type === 'int' ? 'slider' : 
                                          param.type === 'dict' ? 'textarea' : 'textarea';
                        
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium">
                                {param.name}
                                {param.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              <MdBadge variant="outline" className="text-xs">{param.type}</MdBadge>
                            </div>
                            {param.description && (
                              <p className="text-xs text-muted-foreground">{param.description}</p>
                            )}
                            
                            {widgetType === 'slider' && (
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  step={param.type === 'float' ? 0.1 : 1}
                                  value={typeof value === 'number' ? value : parseFloat(value) || 0}
                                  onChange={(e) => {
                                    const newValue = param.type === 'float' 
                                      ? parseFloat(e.target.value) 
                                      : parseInt(e.target.value);
                                    setFormValues(prev => ({ ...prev, [param.name]: newValue }));
                                  }}
                                  className="flex-1"
                                />
                                <span className="text-sm font-semibold text-primary min-w-[50px] text-right">
                                  {typeof value === 'number' ? value : parseFloat(value) || 0}
                                </span>
                              </div>
                            )}
                            
                            {widgetType === 'textarea' && (
                              <textarea
                                value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                                onChange={(e) => {
                                  let newValue = e.target.value;
                                  if (param.type === 'dict') {
                                    try {
                                      newValue = JSON.parse(e.target.value);
                                    } catch {
                                      // 保持字符串格式
                                    }
                                  }
                                  setFormValues(prev => ({ ...prev, [param.name]: newValue }));
                                }}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[80px] resize-y font-mono"
                                placeholder={param.example || param.description}
                              />
                            )}
                            
                            {param.example && (
                              <p className="text-xs text-muted-foreground">
                                示例: <code className="bg-muted px-1 rounded">{param.example}</code>
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </MdCard>

                  {/* 右侧：Payload */}
                  <MdCard className="p-6 h-[calc(100vh-300px)] flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">Payload</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-auto h-full">
                        {JSON.stringify(formValues, null, 2)}
                      </pre>
                    </div>
                  </MdCard>
                </div>
              )}

              {/* 列表展示模式 */}
              {schemaViewMode === 'list' && (
                <div className="space-y-6">
                  {/* 输入参数 */}
                  <div>
                    <h3 className="font-semibold mb-4">输入参数</h3>
                    <MdTable
                      data={model.inputSchema}
                      columns={[
                        {
                          key: 'name',
                          title: '参数名称',
                          render: (value, row) => (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{row.name}</span>
                              {row.required && <MdBadge variant="danger" className="text-xs">必填</MdBadge>}
                            </div>
                          )
                        },
                        {
                          key: 'type',
                          title: '数据类型',
                          render: (value, row) => <MdBadge variant="outline">{row.type}</MdBadge>
                        },
                        {
                          key: 'description',
                          title: '说明',
                          render: (value, row) => <span className="text-sm text-muted-foreground">{row.description}</span>
                        },
                        {
                          key: 'example',
                          title: '示例值',
                          render: (value, row) => row.example ? (
                            <span className="text-xs font-mono text-muted-foreground">{row.example}</span>
                          ) : <span className="text-muted-foreground">-</span>
                        }
                      ]}
                    />
                  </div>

                  {/* 输出参数 */}
                  <div>
                    <h3 className="font-semibold mb-4">输出参数</h3>
                    <MdTable
                      data={model.outputSchema}
                      columns={[
                        {
                          key: 'name',
                          title: '参数名称',
                          render: (value, row) => (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{row.name}</span>
                              {row.required && <MdBadge variant="danger" className="text-xs">必填</MdBadge>}
                            </div>
                          )
                        },
                        {
                          key: 'type',
                          title: '数据类型',
                          render: (value, row) => <MdBadge variant="outline">{row.type}</MdBadge>
                        },
                        {
                          key: 'description',
                          title: '说明',
                          render: (value, row) => <span className="text-sm text-muted-foreground">{row.description}</span>
                        },
                        {
                          key: 'example',
                          title: '示例值',
                          render: (value, row) => row.example ? (
                            <span className="text-xs font-mono text-muted-foreground">{row.example}</span>
                          ) : <span className="text-muted-foreground">-</span>
                        }
                      ]}
                    />
                  </div>

                  {/* 评估指标 */}
                  {model.evaluationMetrics && model.evaluationMetrics.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">评估指标</h3>
                      <MdTable
                        data={model.evaluationMetrics}
                        columns={[
                          {
                            key: 'metricType',
                            title: '指标名称',
                            render: (value, row) => <span className="font-medium">{row.metricType}</span>
                          },
                          {
                            key: 'value',
                            title: '指标值',
                            render: (value, row) => row.value !== undefined ? (
                              <span className="font-semibold text-primary">{row.value}</span>
                            ) : <span className="text-muted-foreground">-</span>
                          },
                          {
                            key: 'description',
                            title: '说明',
                            render: (value, row) => <span className="text-sm text-muted-foreground">{row.description || '-'}</span>
                          }
                        ]}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 版本历史 */}
          {activeTab === 'versions' && (
            <div>
              <h3 className="font-semibold mb-4">版本历史</h3>
              <div className="space-y-4">
                {versionHistory.map((version, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      {index < versionHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-muted-foreground mt-2" />
                      )}
                    </div>
                    <div className="flex-1 border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{version.version}</span>
                          <MdBadge variant={version.environment === 'production' ? 'primary' : 'secondary'}>
                            {version.environment === 'production' ? '生产' : '预发布'}
                          </MdBadge>
                        </div>
                        <div className="text-sm text-muted-foreground">{version.createTime}</div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        修改者: {version.creator}
                      </div>
                      <div className="text-sm">{version.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 关联记录 */}
          {activeTab === 'related' && (
            <div className="space-y-6">
              {(() => {
                // 检查是否有生产环境的部署
                const hasProductionDeployment = deployments.some(d => d.environment === 'production');
                
                if (!hasProductionDeployment) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      该模型尚未部署到生产环境，暂无评价指标数据
                    </div>
                  );
                }
                
                if (!evaluationMetrics) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无评价指标数据
                    </div>
                  );
                }

                // 计算趋势图数据
                const trendData = evaluationMetrics.historicalTrend;
                const maxTrendValue = Math.max(...trendData.map(d => d.value));
                const minTrendValue = Math.min(...trendData.map(d => d.value));
                const trendRange = maxTrendValue - minTrendValue || 0.1;
                const chartHeight = 300;
                const chartWidth = 1000;
                const padding = 50;
                const plotWidth = chartWidth - padding * 2;
                const plotHeight = chartHeight - padding * 2;

                // 计算平均值
                const avgPrimaryMetric = trendData.reduce((sum, d) => sum + d.value, 0) / trendData.length;
                const bestRun = trendData.reduce((best, current) => 
                  current.value > best.value ? current : best
                );

                return (
                  <div className="space-y-6">
                    {/* 页面头部 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">模型评估报告</h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>ID: {evaluationMetrics.modelRunId}</span>
                          <span>评估时间: {evaluationMetrics.evaluationTime}</span>
                        </div>
                      </div>
                      <MdButton variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        导出报告
                      </MdButton>
                    </div>

                    {/* 第一行：核心指标平均值、误差指标平均值、评估次数 */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* 核心指标 */}
                      <MdCard className="p-6 relative">
                        <div className="absolute top-4 right-4">
                          <Activity className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">核心指标 (PRIMARY METRIC)</div>
                        <div className="text-3xl font-bold mb-2">{evaluationMetrics.primaryMetric.averageValue.toFixed(3)}</div>
                        {evaluationMetrics.primaryMetric.change !== undefined && (
                          <div className="text-sm text-green-600 mb-2">
                            ↑ {evaluationMetrics.primaryMetric.change.toFixed(1)}%
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          目标阈值: {evaluationMetrics.primaryMetric.targetThreshold}
                        </div>
                      </MdCard>

                      {/* 误差指标 */}
                      <MdCard className="p-6 relative">
                        <div className="absolute top-4 right-4">
                          <Activity className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">误差指标 (ERROR RATE)</div>
                        <div className="text-3xl font-bold mb-2">{evaluationMetrics.errorMetric.averageValue.toFixed(3)}</div>
                        {evaluationMetrics.errorMetric.isBetterThanBaseline && (
                          <div className="text-sm text-green-600 mb-2">
                            ↓ 优于基线
                          </div>
                        )}
                        {evaluationMetrics.errorMetric.baselineValue !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            基线值 (Baseline): {evaluationMetrics.errorMetric.baselineValue.toFixed(3)}
                          </div>
                        )}
                      </MdCard>

                      {/* 评估次数 */}
                      <MdCard className="p-6 relative">
                        <div className="absolute top-4 right-4">
                          <Activity className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">评估次数 (SAMPLES)</div>
                        <div className="text-3xl font-bold mb-2">
                          {evaluationMetrics.evaluationCount.toLocaleString()} <span className="text-lg font-normal">次</span>
                        </div>
                      </MdCard>
                    </div>

                    {/* 详细指标清单和历史趋势 - 左右布局 */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* 详细指标清单 */}
                      <MdCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">详细指标清单</h3>
                          <MdButton variant="outline" size="sm">
                            共检测 {evaluationMetrics.detailedMetrics.length} 项指标
                          </MdButton>
                        </div>
                        <MdTable
                          data={evaluationMetrics.detailedMetrics}
                          columns={[
                            {
                              key: 'name',
                              title: '指标名称 (Metric)',
                              render: (value, row) => (
                                <div>
                                  <div className="font-medium">{row.name}</div>
                                  <div className="text-xs text-muted-foreground">{row.description}</div>
                                </div>
                              )
                            },
                            {
                              key: 'currentValue',
                              title: '当前值',
                              render: (value) => <span className="font-semibold">{value}</span>
                            },
                            {
                              key: 'targetThreshold',
                              title: '目标/阈值',
                              render: (value) => <span className="text-sm">{value}</span>
                            },
                            {
                              key: 'deviation',
                              title: '偏差',
                              render: (value) => (
                                <span className={`text-sm ${value.startsWith('+') ? 'text-green-600' : value.startsWith('-') ? 'text-red-600' : ''}`}>
                                  {value}
                                </span>
                              )
                            },
                            {
                              key: 'status',
                              title: '状态',
                              render: (value) => (
                                <MdBadge 
                                  variant={
                                    value === '达标' ? 'success' : 
                                    value === '临界警告' ? 'warning' : 
                                    'danger'
                                  }
                                >
                                  {value}
                                </MdBadge>
                              )
                            }
                          ]}
                        />
                      </MdCard>

                      {/* 核心指标趋势折线图 */}
                      <MdCard className="p-6">
                        <h3 className="font-semibold text-lg mb-2">历史趋势 (近7次运行)</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          监控核心指标 ({evaluationMetrics.primaryMetric.name}) 的稳定性
                        </p>
                        <div className="w-full overflow-x-auto">
                          <svg width={chartWidth} height={chartHeight} className="border rounded">
                            {/* Y轴标签 */}
                            {[0, 1, 2, 3, 4].map((i) => {
                              const value = minTrendValue + (trendRange / 4) * (4 - i);
                              const y = padding + (plotHeight / 4) * i;
                              return (
                                <g key={i}>
                                  <line 
                                    x1={padding} 
                                    y1={y} 
                                    x2={chartWidth - padding} 
                                    y2={y} 
                                    stroke="#e5e7eb" 
                                    strokeWidth="1" 
                                    strokeDasharray="2,2" 
                                  />
                                  <text 
                                    x={padding - 10} 
                                    y={y + 4} 
                                    textAnchor="end" 
                                    className="text-xs fill-muted-foreground"
                                  >
                                    {value.toFixed(3)}
                                  </text>
                                </g>
                              );
                            })}
                            {/* X轴标签 */}
                            {trendData.map((d, i) => {
                              const x = padding + (plotWidth / (trendData.length - 1)) * i;
                              return (
                                <text 
                                  key={i} 
                                  x={x} 
                                  y={chartHeight - padding + 20} 
                                  textAnchor="middle" 
                                  className="text-xs fill-muted-foreground"
                                >
                                  {d.runId}
                                </text>
                              );
                            })}
                            {/* 折线 */}
                            <polyline
                              points={trendData.map((d, i) => {
                                const x = padding + (plotWidth / (trendData.length - 1)) * i;
                                const y = padding + plotHeight - ((d.value - minTrendValue) / trendRange) * plotHeight;
                                return `${x},${y}`;
                              }).join(' ')}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="3"
                            />
                            {/* 数据点 */}
                            {trendData.map((d, i) => {
                              const x = padding + (plotWidth / (trendData.length - 1)) * i;
                              const y = padding + plotHeight - ((d.value - minTrendValue) / trendRange) * plotHeight;
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#3b82f6"
                                  stroke="white"
                                  strokeWidth="2"
                                />
                              );
                            })}
                          </svg>
                        </div>
                        {/* 统计信息 */}
                        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
                          <div>
                            <div className="text-sm text-muted-foreground">当前运行 ({trendData[trendData.length - 1]?.runId})</div>
                            <div className="text-lg font-bold">{trendData[trendData.length - 1]?.value.toFixed(3)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">历史最佳 ({bestRun.runId})</div>
                            <div className="text-lg font-bold">{bestRun.value.toFixed(3)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">平均水平</div>
                            <div className="text-lg font-bold">{avgPrimaryMetric.toFixed(3)}</div>
                          </div>
                        </div>
                      </MdCard>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 部署管理 */}
          {activeTab === 'deployments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">部署实例</h3>
                <MdButton 
                  variant="outline"
                  onClick={() => router.push('/categories/model-lab/release-governance/deployment-management')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  新建部署
                </MdButton>
              </div>

              {deployments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  该模型暂无部署实例
                </div>
              ) : (
                <div className="space-y-4">
                  {deployments.map((deployment) => (
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
                          <div className="text-sm mb-2">
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
                          <div className="text-xs text-muted-foreground">
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
                            <HistoryIcon className="mr-2 h-4 w-4" />
                            部署历史
                          </MdButton>
                          <MdButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVersionSwitch(deployment)}
                            disabled={deployment.status !== 'running'}
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
            </div>
          )}
        </MdCardContent>
      </MdCard>

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
    </div>
  );
};

export { ModelDetailPage };
