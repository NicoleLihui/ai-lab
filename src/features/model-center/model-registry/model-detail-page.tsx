"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdTable } from '@/components/enterprise-ui/md-table';
import { ArrowLeft, Edit, Download, Eye, Activity, Package, FileText, GitBranch, Clock } from 'lucide-react';

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

const ModelDetailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id');

  const [model, setModel] = useState<ModelInfo | null>(null);
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([]);
  const [relatedRecords, setRelatedRecords] = useState<RelatedRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'schema' | 'dependencies' | 'versions' | 'related'>('info');

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
        status: 'registered'
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
    }
  }, [modelId]);

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
              <MdButton onClick={() => router.push(`/categories/model-center/release-governance/model-release-review?modelId=${model.id}`)}>
                发布
              </MdButton>
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
              { key: 'related', label: '关联记录', icon: Activity }
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
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export { ModelDetailPage };
