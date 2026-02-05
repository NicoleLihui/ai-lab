"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdTable } from '@/components/enterprise-ui/md-table';
import { ArrowLeft, Edit, Download, Eye, Activity, Package, FileText, GitBranch, Clock, Settings, RotateCcw, Power, History as HistoryIcon, Send } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'info' | 'schema' | 'dependencies' | 'versions' | 'related' | 'deployments'>(
    (tabParam === 'deployments' ? 'deployments' : 'info') as 'info' | 'schema' | 'dependencies' | 'versions' | 'related' | 'deployments'
  );
  // 部署管理相关状态
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [versionSwitchDrawerOpen, setVersionSwitchDrawerOpen] = useState(false);
  const [targetVersion, setTargetVersion] = useState('');
  const [grayScaleRatio, setGrayScaleRatio] = useState(10);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

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
              <MdButton variant="outline" onClick={() => router.push(`/categories/model-center/model-registry/model-edit?id=${model.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
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
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">框架</div>
              <div className="font-medium">{model.framework}</div>
            </div>
            <div>
              <div className="text-muted-foreground">创建者</div>
              <div className="font-medium">{model.creator}</div>
            </div>
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
              { key: 'dependencies', label: '依赖包', icon: Package },
              { key: 'versions', label: '版本历史', icon: GitBranch },
              { key: 'related', label: '关联记录', icon: Activity },
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
              <div>
                <h3 className="font-semibold mb-4">环境配置</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Python版本</div>
                    <div className="font-medium">{model.pythonVersion}</div>
                  </div>
                  {model.cudaVersion && (
                    <div>
                      <div className="text-sm text-muted-foreground">CUDA版本</div>
                      <div className="font-medium">{model.cudaVersion}</div>
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

          {/* 依赖包 */}
          {activeTab === 'dependencies' && (
            <div>
              <h3 className="font-semibold mb-4">Python依赖包 ({model.dependencies.length}个)</h3>
              <div className="space-y-2">
                {model.dependencies.map((dep, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <span className="font-medium">{dep.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">{dep.version}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">requirements.txt</div>
                <pre className="text-xs font-mono">
                  {model.dependencies.map(dep => `${dep.name}${dep.version}`).join('\n')}
                </pre>
              </div>
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
                        创建者: {version.creator}
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
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-4">测试记录</h3>
                <div className="space-y-2">
                  {relatedRecords.filter(r => r.type === 'test').map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-muted-foreground">{record.time}</div>
                      </div>
                      <MdBadge variant={record.status === '通过' ? 'success' : 'danger'}>
                        {record.status}
                      </MdBadge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">部署记录</h3>
                <div className="space-y-2">
                  {relatedRecords.filter(r => r.type === 'deployment').map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-muted-foreground">{record.time}</div>
                      </div>
                      <MdBadge variant={record.status === '运行中' ? 'primary' : 'secondary'}>
                        {record.status}
                      </MdBadge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">监控记录</h3>
                <div className="space-y-2">
                  {relatedRecords.filter(r => r.type === 'monitoring').map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-muted-foreground">{record.time}</div>
                      </div>
                      <MdButton
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/categories/model-center/monitoring/performance-monitor?modelId=${model.id}`)}
                      >
                        查看监控
                      </MdButton>
                    </div>
                  ))}
                </div>
              </div>
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
