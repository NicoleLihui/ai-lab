'use client';

import React, { useState, useEffect } from 'react';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import BeTable from '@/components/enterprise-ui/table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Search, Eye, TrendingUp, AlertTriangle, Activity, BarChart3, RefreshCw } from 'lucide-react';

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

// 主页面组件
export const PerformanceMonitorPage: React.FC = () => {
  const [monitors, setMonitors] = useState<PerformanceMonitor[]>([]);
  const [filteredMonitors, setFilteredMonitors] = useState<PerformanceMonitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonitor, setSelectedMonitor] = useState<PerformanceMonitor | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // 模拟数据
  useEffect(() => {
    const mockData: PerformanceMonitor[] = [
      {
        id: '1',
        modelId: 'model-001',
        modelName: '推荐算法模型',
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
        modelName: '风控评分模型',
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
        modelName: '数据清洗模型',
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
        modelName: '销售预测模型',
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
        modelName: '特征提取模型',
        modelVersion: 'v1.1.2',
        qps: 2100,
        latency: 35,
        errorRate: 0.05,
        psi: 0.12,
        status: '正常',
        lastUpdateTime: '2024-01-20 14:30:30'
      }
    ];
    
    // 为每个数据项添加操作按钮
    const mockDataWithActions = mockData.map(item => ({
      ...item,
      actions: (
        <div className="flex space-x-2">
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedMonitor(item);
              setDetailOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            详情
          </MdButton>
        </div>
      )
    }));
    
    setMonitors(mockData);
    setFilteredMonitors(mockDataWithActions);
  }, []);

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
    
    // 为过滤后的数据项添加操作按钮
    const resultWithActions = result.map(item => ({
      ...item,
      actions: (
        <div className="flex space-x-2">
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedMonitor(item);
              setDetailOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            详情
          </MdButton>
        </div>
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
        onClose={() => setDetailOpen(false)}
        title={`监控详情 - ${selectedMonitor?.modelName || ''}`}
        width="600px"
      >
        <div className="p-6 space-y-4">
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
        </div>
      </MdDrawer>
    </div>
  );
};
