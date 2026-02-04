'use client';

import React, { useState, useEffect } from 'react';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import BeTable from '@/components/enterprise-ui/table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Search, Plus, Edit, Trash2, Mail, MessageSquare, Bell, CheckCircle, XCircle, BarChart3, Settings, Wand2 } from 'lucide-react';

// 定义告警规则接口
interface AlertRule {
  id: string;
  ruleName: string;
  alertType: '性能告警' | '数据漂移告警' | '错误率告警' | '延迟告警';
  condition: string;
  threshold: string;
  notificationChannels: ('邮件' | '即时通讯')[];
  status: '启用' | '禁用';
  recipients: string[];
  createTime: string;
  updateTime: string;
  actions?: React.ReactNode;
}

// 定义告警记录接口
interface AlertRecord {
  id: string;
  ruleName: string;
  alertType: string;
  modelName: string;
  severity: '低' | '中' | '高' | '紧急';
  message: string;
  status: '已触发' | '已处理' | '已忽略';
  triggerTime: string;
  processTime?: string;
  processor?: string;
  actions?: React.ReactNode;
}

// 主页面组件
export const AlertingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'records'>('rules');
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<AlertRule[]>([]);
  const [records, setRecords] = useState<AlertRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AlertRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [channelConfigOpen, setChannelConfigOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AlertRule>>({
    ruleName: '',
    alertType: '性能告警',
    condition: '',
    threshold: '',
    notificationChannels: [],
    recipients: [],
    status: '启用'
  });

  // 模拟告警规则数据
  useEffect(() => {
    const mockRules: AlertRule[] = [
      {
        id: '1',
        ruleName: 'QPS异常告警',
        alertType: '性能告警',
        condition: 'QPS < 100',
        threshold: '100',
        notificationChannels: ['邮件', '即时通讯'],
        status: '启用',
        recipients: ['admin@example.com', 'ops@example.com'],
        createTime: '2024-01-15 10:00:00',
        updateTime: '2024-01-15 10:00:00'
      },
      {
        id: '2',
        ruleName: '延迟过高告警',
        alertType: '延迟告警',
        condition: 'Latency > 200ms',
        threshold: '200ms',
        notificationChannels: ['邮件'],
        status: '启用',
        recipients: ['dev@example.com'],
        createTime: '2024-01-16 14:30:00',
        updateTime: '2024-01-16 14:30:00'
      },
      {
        id: '3',
        ruleName: '错误率告警',
        alertType: '错误率告警',
        condition: 'Error Rate > 2%',
        threshold: '2%',
        notificationChannels: ['邮件', '即时通讯'],
        status: '启用',
        recipients: ['admin@example.com', 'ops@example.com', 'dev@example.com'],
        createTime: '2024-01-17 09:15:00',
        updateTime: '2024-01-17 09:15:00'
      },
      {
        id: '4',
        ruleName: 'PSI漂移告警',
        alertType: '数据漂移告警',
        condition: 'PSI > 0.25',
        threshold: '0.25',
        notificationChannels: ['即时通讯'],
        status: '启用',
        recipients: ['data-team@example.com'],
        createTime: '2024-01-18 11:20:00',
        updateTime: '2024-01-18 11:20:00'
      },
      {
        id: '5',
        ruleName: '模型异常告警',
        alertType: '错误率告警',
        condition: 'Error Rate > 5%',
        threshold: '5%',
        notificationChannels: ['邮件'],
        status: '禁用',
        recipients: ['admin@example.com'],
        createTime: '2024-01-19 16:45:00',
        updateTime: '2024-01-19 16:45:00'
      }
    ];

    const mockRulesWithActions = mockRules.map(item => ({
      ...item,
      actions: (
        <div className="flex space-x-2">
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              setEditingRule(item);
              setRuleDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            编辑
          </MdButton>
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              // 删除规则
              console.log('删除规则:', item.id);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            删除
          </MdButton>
        </div>
      )
    }));

    setRules(mockRules);
    setFilteredRules(mockRulesWithActions);
  }, []);

  // 模拟告警记录数据
  useEffect(() => {
    const mockRecords: AlertRecord[] = [
      {
        id: '1',
        ruleName: '错误率告警',
        alertType: '错误率告警',
        modelName: '污染物浓度预测模型',
        severity: '高',
        message: '错误率超过阈值 2%，当前值: 3.2%',
        status: '已触发',
        triggerTime: '2024-01-20 14:28:30'
      },
      {
        id: '2',
        ruleName: 'PSI漂移告警',
        alertType: '数据漂移告警',
        modelName: '水质监测预警模型',
        severity: '中',
        message: 'PSI 值超过阈值 0.25，当前值: 0.35',
        status: '已处理',
        triggerTime: '2024-01-20 13:15:20',
        processTime: '2024-01-20 13:20:15',
        processor: '张三'
      },
      {
        id: '3',
        ruleName: '延迟过高告警',
        alertType: '延迟告警',
        modelName: '污水处理效果预测模型',
        severity: '低',
        message: '延迟超过阈值 200ms，当前值: 245ms',
        status: '已处理',
        triggerTime: '2024-01-20 12:05:10',
        processTime: '2024-01-20 12:10:05',
        processor: '李四'
      },
      {
        id: '4',
        ruleName: 'QPS异常告警',
        alertType: '性能告警',
        modelName: '数据清洗模型',
        severity: '紧急',
        message: 'QPS 低于阈值 100，当前值: 45',
        status: '已触发',
        triggerTime: '2024-01-20 11:30:00'
      },
      {
        id: '5',
        ruleName: '错误率告警',
        alertType: '错误率告警',
        modelName: '曝气系统控制模型',
        severity: '中',
        message: '错误率超过阈值 2%，当前值: 2.5%',
        status: '已忽略',
        triggerTime: '2024-01-20 10:15:30'
      }
    ];

    const mockRecordsWithActions = mockRecords.map(item => ({
      ...item,
      actions: (
        <div className="flex space-x-2">
          {item.status === '已触发' && (
            <>
              <MdButton 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // 处理告警
                  console.log('处理告警:', item.id);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                处理
              </MdButton>
              <MdButton 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // 忽略告警
                  console.log('忽略告警:', item.id);
                }}
              >
                <XCircle className="h-4 w-4 mr-1" />
                忽略
              </MdButton>
            </>
          )}
        </div>
      )
    }));

    setRecords(mockRecords);
    setFilteredRecords(mockRecordsWithActions);
  }, []);

  // 过滤规则数据
  useEffect(() => {
    if (activeTab === 'rules') {
      let result = rules;
      
      if (searchTerm) {
        result = result.filter(rule => 
          rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rule.alertType.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        result = result.filter(rule => rule.status === statusFilter);
      }
      
      const resultWithActions = result.map(item => ({
        ...item,
        actions: (
          <div className="flex space-x-2">
            <MdButton 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEditingRule(item);
                setRuleDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4 mr-1" />
              编辑
            </MdButton>
            <MdButton 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('删除规则:', item.id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              删除
            </MdButton>
          </div>
        )
      }));
      
      setFilteredRules(resultWithActions);
    }
  }, [searchTerm, statusFilter, rules, activeTab]);

  // 过滤记录数据
  useEffect(() => {
    if (activeTab === 'records') {
      let result = records;
      
      if (searchTerm) {
        result = result.filter(record => 
          record.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (severityFilter !== 'all') {
        result = result.filter(record => record.severity === severityFilter);
      }
      
      const resultWithActions = result.map(item => ({
        ...item,
        actions: (
          <div className="flex space-x-2">
            {item.status === '已触发' && (
              <>
                <MdButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log('处理告警:', item.id);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  处理
                </MdButton>
                <MdButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log('忽略告警:', item.id);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  忽略
                </MdButton>
              </>
            )}
          </div>
        )
      }));
      
      setFilteredRecords(resultWithActions);
    }
  }, [searchTerm, severityFilter, records, activeTab]);

  // 获取严重程度颜色
  const getSeverityVariant = (severity: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (severity) {
      case '低':
        return 'info';
      case '中':
        return 'warning';
      case '高':
        return 'warning';
      case '紧急':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // 获取状态颜色
  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (status) {
      case '已处理':
        return 'success';
      case '已触发':
        return 'warning';
      case '已忽略':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // 告警规则表格列
  const ruleColumns = [
    {
      prop: 'ruleName',
      label: '规则名称',
      width: 180,
      align: 'left' as const,
      render: (row: AlertRule) => (
        <div className="font-medium">{row.ruleName}</div>
      )
    },
    {
      prop: 'alertType',
      label: '告警类型',
      width: 140,
      align: 'center' as const,
      render: (row: AlertRule) => (
        <MdBadge variant="secondary">{row.alertType}</MdBadge>
      )
    },
    {
      prop: 'condition',
      label: '触发条件',
      width: 200,
      align: 'left' as const,
      render: (row: AlertRule) => (
        <span className="text-sm">{row.condition}</span>
      )
    },
    {
      prop: 'notificationChannels',
      label: '通知渠道',
      width: 150,
      align: 'center' as const,
      render: (row: AlertRule) => (
        <div className="flex items-center justify-center gap-2">
          {row.notificationChannels.includes('邮件') && (
            <Mail className="h-4 w-4 text-primary" />
          )}
          {row.notificationChannels.includes('即时通讯') && (
            <MessageSquare className="h-4 w-4 text-success" />
          )}
          <span className="text-xs">{row.notificationChannels.join(', ')}</span>
        </div>
      )
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      align: 'center' as const,
      render: (row: AlertRule) => (
        <MdBadge variant={row.status === '启用' ? 'success' : 'secondary'}>
          {row.status}
        </MdBadge>
      )
    },
    {
      prop: 'recipients',
      label: '接收人',
      width: 200,
      align: 'left' as const,
      render: (row: AlertRule) => (
        <span className="text-xs text-muted-foreground">
          {row.recipients.join(', ')}
        </span>
      )
    },
    {
      prop: 'actions',
      label: '操作',
      width: 150,
      align: 'center' as const
    }
  ];

  // 告警记录表格列
  const recordColumns = [
    {
      prop: 'ruleName',
      label: '规则名称',
      width: 150,
      align: 'left' as const,
      render: (row: AlertRecord) => (
        <div className="font-medium">{row.ruleName}</div>
      )
    },
    {
      prop: 'modelName',
      label: '模型名称',
      width: 150,
      align: 'left' as const
    },
    {
      prop: 'severity',
      label: '严重程度',
      width: 120,
      align: 'center' as const,
      render: (row: AlertRecord) => (
        <MdBadge variant={getSeverityVariant(row.severity)}>
          {row.severity}
        </MdBadge>
      )
    },
    {
      prop: 'message',
      label: '告警信息',
      width: 300,
      align: 'left' as const,
      render: (row: AlertRecord) => (
        <span className="text-sm">{row.message}</span>
      )
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      align: 'center' as const,
      render: (row: AlertRecord) => (
        <MdBadge variant={getStatusVariant(row.status)}>
          {row.status}
        </MdBadge>
      )
    },
    {
      prop: 'triggerTime',
      label: '触发时间',
      width: 160,
      align: 'center' as const
    },
    {
      prop: 'processor',
      label: '处理人',
      width: 100,
      align: 'center' as const,
      render: (row: AlertRecord) => (
        <span className="text-sm">{row.processor || '-'}</span>
      )
    },
    {
      prop: 'actions',
      label: '操作',
      width: 150,
      align: 'center' as const
    }
  ];

  // 计算告警统计
  const totalRules = rules.length;
  const enabledRules = rules.filter(r => r.status === '启用').length;
  const totalAlerts = records.length;
  const unprocessedAlerts = records.filter(r => r.status === '已触发').length;
  const highSeverityAlerts = records.filter(r => r.severity === '高' || r.severity === '紧急').length;

  // 规则创建向导处理
  const handleWizardNext = () => {
    if (wizardStep < 4) {
      setWizardStep(wizardStep + 1);
    } else {
      // 完成创建
      const rule: AlertRule = {
        id: `rule-${Date.now()}`,
        ruleName: newRule.ruleName || '',
        alertType: newRule.alertType as AlertRule['alertType'],
        condition: newRule.condition || '',
        threshold: newRule.threshold || '',
        notificationChannels: newRule.notificationChannels || [],
        status: newRule.status as '启用' | '禁用',
        recipients: newRule.recipients || [],
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      };
      setRules([...rules, rule]);
      setWizardOpen(false);
      setWizardStep(1);
      setNewRule({
        ruleName: '',
        alertType: '性能告警',
        condition: '',
        threshold: '',
        notificationChannels: [],
        recipients: [],
        status: '启用'
      });
    }
  };

  const handleWizardBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* 告警统计 */}
      <MdCard>
        <MdCardHeader>
          <MdCardTitle>告警统计</MdCardTitle>
        </MdCardHeader>
        <MdCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">{totalRules}</div>
              <div className="text-xs text-muted-foreground">告警规则总数</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-green-600">{enabledRules}</div>
              <div className="text-xs text-muted-foreground">已启用规则</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">{totalAlerts}</div>
              <div className="text-xs text-muted-foreground">告警记录总数</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-yellow-600">{unprocessedAlerts}</div>
              <div className="text-xs text-muted-foreground">待处理告警</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-red-600">{highSeverityAlerts}</div>
              <div className="text-xs text-muted-foreground">高严重性告警</div>
            </div>
          </div>
        </MdCardContent>
      </MdCard>

      {/* 标签页切换 */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'rules'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('rules')}
        >
          <Bell className="h-4 w-4 inline mr-2" />
          告警规则
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'records'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('records')}
        >
          <Bell className="h-4 w-4 inline mr-2" />
          告警记录
        </button>
      </div>

      {/* 告警规则 */}
      {activeTab === 'rules' && (
        <MdCard>
          <MdCardHeader className="border-b">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <MdInput
                    placeholder="搜索规则名称或告警类型..."
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
                    { value: '启用', label: '启用' }, 
                    { value: '禁用', label: '禁用' }
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className="w-[150px]"
                />
                <MdButton 
                  variant="outline"
                  onClick={() => setChannelConfigOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  通知渠道配置
                </MdButton>
                <MdButton 
                  variant="primary" 
                  onClick={() => {
                    setWizardOpen(true);
                    setWizardStep(1);
                    setEditingRule(null);
                  }}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  创建向导
                </MdButton>
                <MdButton 
                  variant="outline" 
                  onClick={() => {
                    setEditingRule(null);
                    setRuleDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新建规则
                </MdButton>
              </div>
            </div>
          </MdCardHeader>
          <MdCardContent className="p-0">
            <BeTable
              tableData={filteredRules}
              columns={ruleColumns}
              options={{ rowKey: 'id' }}
            />
          </MdCardContent>
        </MdCard>
      )}

      {/* 告警记录 */}
      {activeTab === 'records' && (
        <MdCard>
          <MdCardHeader className="border-b">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <MdInput
                    placeholder="搜索规则名称、模型名称或告警信息..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <MdSelect 
                  options={[
                    { value: 'all', label: '全部严重程度' }, 
                    { value: '低', label: '低' }, 
                    { value: '中', label: '中' }, 
                    { value: '高', label: '高' }, 
                    { value: '紧急', label: '紧急' }
                  ]}
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  className="w-[150px]"
                />
              </div>
            </div>
          </MdCardHeader>
          <MdCardContent className="p-0">
            <BeTable
              tableData={filteredRecords}
              columns={recordColumns}
              options={{ rowKey: 'id' }}
            />
          </MdCardContent>
        </MdCard>
      )}

      {/* 新建/编辑规则抽屉 */}
      <MdDrawer
        open={ruleDialogOpen}
        onClose={() => setRuleDialogOpen(false)}
        title={editingRule ? '编辑告警规则' : '新建告警规则'}
        width="500px"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">规则名称</label>
            <MdInput
              defaultValue={editingRule?.ruleName || ''}
              placeholder="请输入规则名称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">告警类型</label>
            <MdSelect 
              options={[
                { value: '性能告警', label: '性能告警' },
                { value: '数据漂移告警', label: '数据漂移告警' },
                { value: '错误率告警', label: '错误率告警' },
                { value: '延迟告警', label: '延迟告警' }
              ]}
              value={editingRule?.alertType || '性能告警'}
              onChange={() => {}}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">触发条件</label>
            <MdInput
              defaultValue={editingRule?.condition || ''}
              placeholder="例如: QPS < 100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">通知渠道</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked={editingRule?.notificationChannels.includes('邮件')} />
                <Mail className="h-4 w-4 ml-2" />
                <span className="ml-1">邮件</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked={editingRule?.notificationChannels.includes('即时通讯')} />
                <MessageSquare className="h-4 w-4 ml-2" />
                <span className="ml-1">即时通讯</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">接收人（邮箱，多个用逗号分隔）</label>
            <MdInput
              defaultValue={editingRule?.recipients.join(', ') || ''}
              placeholder="admin@example.com, ops@example.com"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <MdButton variant="outline" onClick={() => setRuleDialogOpen(false)}>
              取消
            </MdButton>
            <MdButton variant="primary" onClick={() => {
              // 保存规则
              console.log('保存规则');
              setRuleDialogOpen(false);
            }}>
              保存
            </MdButton>
          </div>
        </div>
      </MdDrawer>
    </div>
  );
};
