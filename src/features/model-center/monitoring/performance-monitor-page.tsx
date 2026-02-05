'use client';

import React, { useState, useEffect } from 'react';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import BeTable from '@/components/enterprise-ui/table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Search, Eye, TrendingUp, AlertTriangle, Activity, BarChart3, RefreshCw, GitCompare, Clock, FileText } from 'lucide-react';
import { MdCheckbox } from '@/components/enterprise-ui/md-checkbox';

// 定义监控数据接口
interface PerformanceMonitor {
  id: string;
  modelId: string;
  modelName: string;
  modelVersion: string;
  qps: number; // 每秒查询数
  latency: number; // 延迟（毫秒）
  errorRate: number; // 错误率（百分比）
  psi: number; // 数据漂移 PSI 值
  status: '正常' | '警告' | '异常';
  lastUpdateTime: string;
  actions?: React.ReactNode;
}

// 定义运行日志接口
interface ModelLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  source?: string;
}

// 主页面组件
export const PerformanceMonitorPage: React.FC = () => {
  const [monitors, setMonitors] = useState<PerformanceMonitor[]>([]);
  const [filteredMonitors, setFilteredMonitors] = useState<PerformanceMonitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonitor, setSelectedMonitor] = useState<PerformanceMonitor | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [showCharts, setShowCharts] = useState(true);
  const [modelLogs, setModelLogs] = useState<ModelLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ModelLog[]>([]);
  const [logLevelFilter, setLogLevelFilter] = useState<string>('all');
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logAutoRefresh, setLogAutoRefresh] = useState(false);
  const logContainerRef = React.useRef<HTMLDivElement>(null);

  // 模拟数据
  useEffect(() => {
    const mockData: PerformanceMonitor[] = [
      {
        id: '1',
        modelId: 'model-001',
        modelName: '污水处理效果预测模型',
        modelVersion: 'v1.2.3',
        qps: 1250,
        latency: 45,
        errorRate: 0.2,
        psi: 0.15,
        status: '正常',
        lastUpdateTime: '2024-01-20 14:30:00'
      },
      {
        id: '2',
        modelId: 'model-002',
        modelName: '水质监测预警模型',
        modelVersion: 'v2.0.1',
        qps: 890,
        latency: 120,
        errorRate: 1.5,
        psi: 0.35,
        status: '警告',
        lastUpdateTime: '2024-01-20 14:29:45'
      },
      {
        id: '3',
        modelId: 'model-003',
        modelName: '污水流量预测模型',
        modelVersion: 'v1.0.5',
        qps: 320,
        latency: 85,
        errorRate: 0.1,
        psi: 0.08,
        status: '正常',
        lastUpdateTime: '2024-01-20 14:30:15'
      },
      {
        id: '4',
        modelId: 'model-004',
        modelName: '污染物浓度预测模型',
        modelVersion: 'v1.5.0',
        qps: 560,
        latency: 200,
        errorRate: 3.2,
        psi: 0.65,
        status: '异常',
        lastUpdateTime: '2024-01-20 14:28:30'
      },
      {
        id: '5',
        modelId: 'model-005',
        modelName: '曝气系统控制模型',
        modelVersion: 'v1.1.2',
        qps: 2100,
        latency: 35,
        errorRate: 0.05,
        psi: 0.12,
        status: '正常',
        lastUpdateTime: '2024-01-20 14:30:30'
      }
    ];
    
    setMonitors(mockData);
  }, []);

  // 获取性能趋势数据（模拟）
  const getPerformanceTrend = (modelId: string) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return {
      qps: hours.map(h => Math.floor(Math.random() * 500) + 1000),
      latency: hours.map(h => Math.floor(Math.random() * 50) + 40),
      errorRate: hours.map(h => Math.random() * 2),
      timestamps: hours.map(h => `${h}:00`)
    };
  };

  // 获取PSI趋势数据
  const getPSITrend = (modelId: string) => {
    const days = Array.from({ length: 7 }, (_, i) => i);
    return days.map(d => ({
      date: `01-${14 + d}`,
      psi: Math.random() * 0.5
    }));
  };

  // 生成模拟运行日志
  const generateMockLogs = (modelId: string): ModelLog[] => {
    const logs: ModelLog[] = [];
    const levels: ('INFO' | 'WARN' | 'ERROR')[] = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR'];
    const messages = [
      '模型服务启动成功',
      '接收到预测请求，请求ID: req-{id}',
      '模型推理完成，耗时: {time}ms',
      '预测结果: {result}',
      '模型加载完成，版本: {version}',
      '内存使用率: {memory}%',
      'GPU使用率: {gpu}%',
      '请求超时，已重试',
      '数据预处理完成',
      '特征工程执行完成',
      '模型输出后处理完成',
      '请求处理失败: {error}',
      'PSI值检测: {psi}',
      '数据漂移警告',
      '模型性能指标更新',
      '缓存命中率: {rate}%',
      '批量预测任务完成，共处理 {count} 条数据',
      '模型版本切换完成',
      '健康检查通过',
      '服务重启完成'
    ];

    const now = new Date();
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - i * 60000 - Math.random() * 60000);
      const level = levels[Math.floor(Math.random() * levels.length)];
      const messageTemplate = messages[Math.floor(Math.random() * messages.length)];
      const message = messageTemplate
        .replace('{id}', `req-${Math.floor(Math.random() * 10000)}`)
        .replace('{time}', String(Math.floor(Math.random() * 200) + 20))
        .replace('{result}', Math.random() > 0.5 ? '通过' : '不通过')
        .replace('{version}', 'v1.2.3')
        .replace('{memory}', String(Math.floor(Math.random() * 40) + 30))
        .replace('{gpu}', String(Math.floor(Math.random() * 50) + 20))
        .replace('{error}', '连接超时')
        .replace('{psi}', (Math.random() * 0.5).toFixed(4))
        .replace('{rate}', String(Math.floor(Math.random() * 30) + 60))
        .replace('{count}', String(Math.floor(Math.random() * 1000) + 100));

      logs.push({
        id: `log-${modelId}-${i}`,
        timestamp: timestamp.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        level,
        message,
        source: 'model-service'
      });
    }
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // 加载模型日志
  useEffect(() => {
    if (selectedMonitor) {
      const logs = generateMockLogs(selectedMonitor.modelId);
      setModelLogs(logs);
      setFilteredLogs(logs);
    }
  }, [selectedMonitor]);

  // 过滤日志
  useEffect(() => {
    let result = modelLogs;

    // 按日志级别过滤
    if (logLevelFilter !== 'all') {
      result = result.filter(log => log.level === logLevelFilter);
    }

    // 按搜索词过滤
    if (logSearchTerm) {
      result = result.filter(log =>
        log.message.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
        log.timestamp.includes(logSearchTerm)
      );
    }

    setFilteredLogs(result);
  }, [modelLogs, logLevelFilter, logSearchTerm]);

  // 自动滚动到最新日志
  useEffect(() => {
    if (logContainerRef.current && filteredLogs.length > 0) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [filteredLogs]);

  // 自动刷新日志
  useEffect(() => {
    if (!logAutoRefresh || !selectedMonitor) return;

    const interval = setInterval(() => {
      const newLogs = generateMockLogs(selectedMonitor.modelId);
      setModelLogs(newLogs);
    }, 5000);

    return () => clearInterval(interval);
  }, [logAutoRefresh, selectedMonitor]);

  // 获取日志级别颜色
  const getLogLevelColor = (level: string): string => {
    switch (level) {
      case 'INFO':
        return 'text-blue-400';
      case 'WARN':
        return 'text-yellow-400';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // 获取日志级别背景色
  const getLogLevelBgColor = (level: string): string => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-500/20';
      case 'WARN':
        return 'bg-yellow-500/20';
      case 'ERROR':
        return 'bg-red-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  // 多模型对比
  const handleCompare = () => {
    if (selectedModels.size < 2) {
      alert('请至少选择两个模型进行对比');
      return;
    }
    setCompareDrawerOpen(true);
  };

  const toggleSelectModel = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedModels);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedModels(newSelected);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedModels(new Set(filteredMonitors.map(m => m.id)));
    } else {
      setSelectedModels(new Set());
    }
  };

  const allSelected = filteredMonitors.length > 0 && filteredMonitors.every(m => selectedModels.has(m.id));
  const someSelected = selectedModels.size > 0 && selectedModels.size < filteredMonitors.length;

  // 过滤数据
  useEffect(() => {
    let result = monitors;
    
    // 按搜索词过滤
    if (searchTerm) {
      result = result.filter(monitor => 
        monitor.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monitor.modelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monitor.modelVersion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 按状态过滤
    if (statusFilter !== 'all') {
      result = result.filter(monitor => monitor.status === statusFilter);
    }
    
    // 为过滤后的数据项添加操作按钮（只有一个按钮，直接显示）
    const resultWithActions = result.map(item => ({
      ...item,
      actions: (
        <MdButton 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setSelectedMonitor(item);
            setDetailOpen(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          详情
        </MdButton>
      )
    }));
    
    setFilteredMonitors(resultWithActions);
  }, [searchTerm, statusFilter, monitors]);

  // 获取状态颜色
  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (status) {
      case '正常':
        return 'success';
      case '警告':
        return 'warning';
      case '异常':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // 获取 PSI 状态
  const getPsiStatus = (psi: number): { label: string; variant: 'success' | 'warning' | 'danger' } => {
    if (psi < 0.1) {
      return { label: '无漂移', variant: 'success' };
    } else if (psi < 0.25) {
      return { label: '轻微漂移', variant: 'warning' };
    } else {
      return { label: '严重漂移', variant: 'danger' };
    }
  };

  // 表格列定义
  const columns = [
    {
      prop: 'select',
      label: (
        <MdCheckbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={toggleSelectAll}
        />
      ),
      width: 60,
      align: 'center' as const,
      render: (row: PerformanceMonitor) => (
        <MdCheckbox
          checked={selectedModels.has(row.id)}
          onChange={(checked) => toggleSelectModel(row.id, checked)}
        />
      )
    },
    {
      prop: 'modelName',
      label: '模型名称',
      width: 180,
      align: 'left' as const,
      render: (row: PerformanceMonitor) => (
        <div>
          <div className="font-medium">{row.modelName}</div>
          <div className="text-xs text-muted-foreground">{row.modelVersion}</div>
        </div>
      )
    },
    {
      prop: 'qps',
      label: 'QPS',
      width: 120,
      align: 'center' as const,
      render: (row: PerformanceMonitor) => (
        <div className="flex items-center justify-center">
          <Activity className="h-4 w-4 mr-2 text-primary" />
          <span className="font-medium">{row.qps.toLocaleString()}</span>
        </div>
      )
    },
    {
      prop: 'latency',
      label: '延迟 (ms)',
      width: 120,
      align: 'center' as const,
      render: (row: PerformanceMonitor) => {
        const color = row.latency > 150 ? 'text-danger' : row.latency > 100 ? 'text-warning' : 'text-success';
        return (
          <div className={`flex items-center justify-center ${color}`}>
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="font-medium">{row.latency}</span>
          </div>
        );
      }
    },
    {
      prop: 'errorRate',
      label: '错误率 (%)',
      width: 120,
      align: 'center' as const,
      render: (row: PerformanceMonitor) => {
        const color = row.errorRate > 2 ? 'text-danger' : row.errorRate > 1 ? 'text-warning' : 'text-success';
        return (
          <div className={`flex items-center justify-center ${color}`}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="font-medium">{row.errorRate.toFixed(2)}</span>
          </div>
        );
      }
    },
    {
      prop: 'psi',
      label: 'PSI 值',
      width: 120,
      align: 'center' as const,
      render: (row: PerformanceMonitor) => {
        const psiStatus = getPsiStatus(row.psi);
        return (
          <div className="flex items-center justify-center">
            <MdBadge variant={psiStatus.variant}>
              {row.psi.toFixed(2)} ({psiStatus.label})
            </MdBadge>
          </div>
        );
      }
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      align: 'center' as const,
      render: (row: PerformanceMonitor) => (
        <MdBadge variant={getStatusVariant(row.status)}>
          {row.status}
        </MdBadge>
      )
    },
    {
      prop: 'lastUpdateTime',
      label: '最后更新',
      width: 160,
      align: 'center' as const,
      render: (row: PerformanceMonitor) => (
        <span className="text-sm text-muted-foreground">{row.lastUpdateTime}</span>
      )
    },
    {
      prop: 'actions',
      label: '操作',
      width: 100,
      align: 'center' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MdCard>
          <MdCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">监控模型数</p>
                <p className="text-2xl font-bold">{monitors.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </MdCardContent>
        </MdCard>
        <MdCard>
          <MdCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">正常状态</p>
                <p className="text-2xl font-bold text-success">
                  {monitors.filter(m => m.status === '正常').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </MdCardContent>
        </MdCard>
        <MdCard>
          <MdCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">警告状态</p>
                <p className="text-2xl font-bold text-warning">
                  {monitors.filter(m => m.status === '警告').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </MdCardContent>
        </MdCard>
        <MdCard>
          <MdCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">异常状态</p>
                <p className="text-2xl font-bold text-danger">
                  {monitors.filter(m => m.status === '异常').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-danger" />
            </div>
          </MdCardContent>
        </MdCard>
      </div>

      {/* 性能趋势图表 */}
      {showCharts && selectedMonitor && (
        <MdCard>
          <MdCardHeader>
            <div className="flex items-center justify-between">
              <MdCardTitle>性能趋势 - {selectedMonitor.modelName}</MdCardTitle>
              <div className="flex gap-2">
                <MdSelect
                  options={[
                    { value: '1h', label: '1小时' },
                    { value: '24h', label: '24小时' },
                    { value: '7d', label: '7天' },
                    { value: '30d', label: '30天' }
                  ]}
                  value={timeRange}
                  onChange={setTimeRange}
                  className="w-[120px]"
                />
              </div>
            </div>
          </MdCardHeader>
          <MdCardContent>
            <div className="space-y-6">
              {/* QPS趋势 */}
              <div>
                <h4 className="font-semibold mb-3">QPS趋势</h4>
                <div className="h-48 border rounded-lg bg-muted/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <div className="text-sm">QPS趋势图（模拟数据）</div>
                    <div className="text-xs mt-2">
                      {getPerformanceTrend(selectedMonitor.modelId).qps.slice(-5).join(', ')} ...
                    </div>
                  </div>
                </div>
              </div>
              {/* Latency趋势 */}
              <div>
                <h4 className="font-semibold mb-3">延迟趋势</h4>
                <div className="h-48 border rounded-lg bg-muted/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <div className="text-sm">延迟趋势图（模拟数据）</div>
                    <div className="text-xs mt-2">
                      {getPerformanceTrend(selectedMonitor.modelId).latency.slice(-5).join(', ')} ms ...
                    </div>
                  </div>
                </div>
              </div>
              {/* PSI趋势 */}
              <div>
                <h4 className="font-semibold mb-3">PSI数据漂移趋势</h4>
                <div className="h-48 border rounded-lg bg-muted/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground w-full p-4">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <div className="text-sm mb-4">PSI趋势图（模拟数据）</div>
                    <div className="text-xs space-y-1">
                      {getPSITrend(selectedMonitor.modelId).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <span>{item.date}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.psi < 0.1 ? 'bg-green-600' :
                                  item.psi < 0.25 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${(item.psi / 1) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs w-12 text-right">{item.psi.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MdCardContent>
        </MdCard>
      )}

      {/* 监控列表 */}
      <MdCard>
        <MdCardHeader className="border-b">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <MdInput
                  placeholder="搜索模型名称、ID或版本..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {selectedModels.size > 0 && (
                <MdButton variant="outline" onClick={handleCompare}>
                  <GitCompare className="h-4 w-4 mr-2" />
                  对比 ({selectedModels.size})
                </MdButton>
              )}
              <MdSelect 
                options={[
                  { value: 'all', label: '全部状态' }, 
                  { value: '正常', label: '正常' }, 
                  { value: '警告', label: '警告' }, 
                  { value: '异常', label: '异常' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-[150px]"
              />
              <MdButton variant="outline" onClick={() => setShowCharts(!showCharts)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                {showCharts ? '隐藏图表' : '显示图表'}
              </MdButton>
              <MdButton 
                variant="outline" 
                onClick={() => {
                  // 刷新数据
                  window.location.reload();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </MdButton>
            </div>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-0">
          <BeTable
            tableData={filteredMonitors}
            columns={columns}
            options={{ rowKey: 'id' }}
          />
        </MdCardContent>
      </MdCard>

      {/* 详情抽屉 */}
      <MdDrawer
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setLogAutoRefresh(false);
          setLogSearchTerm('');
          setLogLevelFilter('all');
        }}
        title={`监控详情 - ${selectedMonitor?.modelName || ''}`}
        width="800px"
      >
        <div className="p-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">模型ID</p>
              <p className="font-medium">{selectedMonitor?.modelId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">模型版本</p>
              <p className="font-medium">{selectedMonitor?.modelVersion}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">状态</p>
              {selectedMonitor && (
                <MdBadge variant={getStatusVariant(selectedMonitor.status)}>
                  {selectedMonitor.status}
                </MdBadge>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">最后更新</p>
              <p className="font-medium">{selectedMonitor?.lastUpdateTime}</p>
            </div>
          </div>

          {/* 性能指标 */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">服务性能监控</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">QPS</p>
                <p className="text-2xl font-bold">{selectedMonitor?.qps.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">每秒查询数</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">延迟</p>
                <p className="text-2xl font-bold">{selectedMonitor?.latency} ms</p>
                <p className="text-xs text-muted-foreground mt-1">平均响应时间</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">错误率</p>
                <p className="text-2xl font-bold">{selectedMonitor?.errorRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">请求失败率</p>
              </div>
            </div>
          </div>

          {/* 数据漂移监控 */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">数据漂移监控 (PSI)</h4>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">PSI 值</p>
                {selectedMonitor && (
                  <MdBadge variant={getPsiStatus(selectedMonitor.psi).variant}>
                    {selectedMonitor.psi.toFixed(4)}
                  </MdBadge>
                )}
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">PSI 阈值说明：</p>
                <ul className="text-xs space-y-1">
                  <li>• PSI &lt; 0.1: 无漂移（特征分布稳定）</li>
                  <li>• 0.1 ≤ PSI &lt; 0.25: 轻微漂移（需要关注）</li>
                  <li>• PSI ≥ 0.25: 严重漂移（需要立即处理）</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 运行日志 */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                运行日志
              </h4>
              <div className="flex items-center gap-2">
                <MdButton
                  variant={logAutoRefresh ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLogAutoRefresh(!logAutoRefresh)}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${logAutoRefresh ? 'animate-spin' : ''}`} />
                  {logAutoRefresh ? '停止刷新' : '自动刷新'}
                </MdButton>
                <MdButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedMonitor) {
                      const newLogs = generateMockLogs(selectedMonitor.modelId);
                      setModelLogs(newLogs);
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  刷新
                </MdButton>
              </div>
            </div>

            {/* 日志过滤和搜索 */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <MdInput
                  placeholder="搜索日志内容..."
                  value={logSearchTerm}
                  onChange={(e) => setLogSearchTerm(e.target.value)}
                  className="pl-8"
                  inputSize="sm"
                />
              </div>
              <MdSelect
                options={[
                  { value: 'all', label: '全部级别' },
                  { value: 'INFO', label: 'INFO' },
                  { value: 'WARN', label: 'WARN' },
                  { value: 'ERROR', label: 'ERROR' }
                ]}
                value={logLevelFilter}
                onChange={setLogLevelFilter}
                className="w-[130px]"
                size="sm"
              />
            </div>

            {/* 日志列表 */}
            <div
              ref={logContainerRef}
              className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto"
            >
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`mb-2 pb-2 border-b border-slate-700/50 last:border-0 ${getLogLevelBgColor(log.level)} px-2 py-1 rounded`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`font-semibold min-w-[60px] ${getLogLevelColor(log.level)}`}>
                        [{log.level}]
                      </span>
                      <span className="text-slate-400 min-w-[160px]">{log.timestamp}</span>
                      <span className="text-slate-200 flex-1">{log.message}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  暂无日志数据
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              共 {filteredLogs.length} 条日志
              {logLevelFilter !== 'all' && ` (已过滤: ${logLevelFilter})`}
            </div>
          </div>
        </div>
      </MdDrawer>

      {/* 多模型对比抽屉 */}
      <MdDrawer
        open={compareDrawerOpen}
        onClose={() => setCompareDrawerOpen(false)}
        title="多模型性能对比"
        width="900px"
      >
        <div className="p-6 space-y-6">
          {Array.from(selectedModels).map(modelId => {
            const model = monitors.find(m => m.id === modelId);
            if (!model) return null;
            return (
              <div key={modelId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{model.modelName}</h3>
                    <div className="text-sm text-muted-foreground">{model.modelVersion}</div>
                  </div>
                  <MdBadge variant={getStatusVariant(model.status)}>
                    {model.status}
                  </MdBadge>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">QPS</div>
                    <div className="text-lg font-bold">{model.qps.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">延迟</div>
                    <div className="text-lg font-bold">{model.latency} ms</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">错误率</div>
                    <div className="text-lg font-bold">{model.errorRate.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">PSI</div>
                    <div className="text-lg font-bold">{model.psi.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </MdDrawer>
    </div>
  );
};
