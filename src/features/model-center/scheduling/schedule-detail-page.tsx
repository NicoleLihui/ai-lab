'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent, MdCardDescription } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { OrganizationTree, OrgTreeNode } from '@/components/enterprise-ui/organization-tree';
import { Check, X, Eye, User, Calendar, Clock, Settings, Play, Pause, RefreshCw, AlertTriangle, Activity } from 'lucide-react';

// 调度配置接口
interface ScheduleConfig {
  applicationScope: string[]; // 应用范围（组织ID列表）
  taskType: '按时间' | '按任务' | 'API方式' | '单次触发';
  scheduleType?: 'periodic' | 'interval'; // 周期性或区间运行
  cronExpression?: string; // Cron表达式
  periodType?: 'daily' | 'hourly' | 'weekly' | 'monthly' | 'custom'; // 周期类型
  intervalStartTime?: string; // 区间开始时间
  intervalEndTime?: string; // 区间结束时间
  intervalFrequency?: '30min' | '1hour' | '6hour' | 'daily'; // 区间频率
  retryEnabled: boolean;
  retryCount?: number;
  retryInterval?: number; // 重试间隔（分钟）
  waitDataReady: boolean; // 等待数据源就绪
  timeoutAlert: boolean; // 执行超时告警
  timeoutMinutes?: number; // 超时时间（分钟）
}

interface ScheduleTask {
  id: string;
  taskName: string;
  taskType: '按时间' | '按任务' | 'API方式' | '单次触发';
  cronExpression?: string;
  lastRunTime?: string;
  nextRunTime?: string;
  status: '运行中' | '已暂停' | '已完成' | '异常';
  modelId: string;
  modelName: string;
  creator: string;
  createTime: string;
  description: string;
  triggerCount?: number;
  successCount?: number;
  failureCount?: number;
  scheduleConfig?: ScheduleConfig; // 调度配置
  parameters?: Record<string, any>;
  logs?: Array<{
    timestamp: string;
    status: 'success' | 'failed' | 'running';
    message: string;
  }>;
}

interface ScheduleDetailPageProps {
  schedule?: ScheduleTask;
  onToggleStatus?: (schedule: ScheduleTask) => void;
  onRunNow?: (schedule: ScheduleTask) => void;
}

const ScheduleDetailPage: React.FC<ScheduleDetailPageProps> = ({ 
  schedule: externalSchedule, 
  onToggleStatus, 
  onRunNow 
}) => {
  const searchParams = useSearchParams();
  const [schedule, setSchedule] = useState<ScheduleTask | null>(externalSchedule || null);

  // 组织树数据（用于回显）
  const orgTreeData: OrgTreeNode[] = [
    {
      id: 'group',
      name: '集团',
      children: [
        {
          id: 'east',
          name: '东大区',
          children: [
            {
              id: 'taiyuan',
              name: '太原区域公司',
              children: [
                { id: 'taiyuan-beijiao', name: '太原市北郊污水处理厂' },
                { id: 'taiyuan-nanjiao', name: '太原市南郊污水处理厂' }
              ]
            },
            {
              id: 'hangzhou',
              name: '杭湖区域公司',
              children: [
                { id: 'yuhang', name: '余杭污水处理厂' },
                { id: 'xihu', name: '西湖污水处理厂' }
              ]
            }
          ]
        },
        {
          id: 'south',
          name: '南大区',
          children: [
            {
              id: 'guangzhou',
              name: '广州区域公司',
              children: [
                { id: 'guangzhou-tianhe', name: '广州天河污水处理厂' },
                { id: 'guangzhou-yuexiu', name: '广州越秀污水处理厂' }
              ]
            }
          ]
        },
        {
          id: 'west',
          name: '西大区',
          children: [
            {
              id: 'chengdu',
              name: '成都区域公司',
              children: [
                { id: 'chengdu-jinjiang', name: '成都锦江污水处理厂' },
                { id: 'chengdu-qingyang', name: '成都青羊污水处理厂' }
              ]
            }
          ]
        },
        {
          id: 'north',
          name: '北大区',
          children: [
            {
              id: 'beijing',
              name: '北京区域公司',
              children: [
                { id: 'beijing-chaoyang', name: '北京朝阳污水处理厂' },
                { id: 'beijing-haidian', name: '北京海淀污水处理厂' }
              ]
            }
          ]
        }
      ]
    }
  ];

  // 如果没有传入外部数据，则从URL参数获取ID并加载数据
  useEffect(() => {
    if (!externalSchedule) {
      const id = searchParams.get('id');
      if (id) {
        // 模拟从API获取数据
        const mockSchedule: ScheduleTask = {
          id: id,
          taskName: '每日推荐模型调度',
          taskType: '按时间',
          cronExpression: '0 9 * * *',
          lastRunTime: '2024-01-20 09:00:00',
          nextRunTime: '2024-01-21 09:00:00',
          status: '运行中',
          modelId: 'model-001',
          modelName: '污水处理效果预测模型',
          creator: '张三',
          createTime: '2024-01-15 10:30:00',
          description: '每天上午9点执行推荐模型预测任务',
          triggerCount: 20,
          successCount: 18,
          failureCount: 2,
          scheduleConfig: {
            applicationScope: ['taiyuan-beijiao', 'yuhang', 'guangzhou-tianhe'],
            taskType: '按时间',
            scheduleType: 'periodic',
            periodType: 'daily',
            cronExpression: '0 9 * * *',
            retryEnabled: true,
            retryCount: 3,
            retryInterval: 5,
            waitDataReady: true,
            timeoutAlert: true,
            timeoutMinutes: 30
          },
          parameters: {
            'input_path': '/data/input/recommendation_data.csv',
            'output_path': '/data/output/predictions.csv',
            'threshold': 0.7
          },
          logs: [
            {
              timestamp: '2024-01-20 09:00:00',
              status: 'success',
              message: '任务执行成功，处理了1000条记录'
            },
            {
              timestamp: '2024-01-19 09:00:00',
              status: 'success',
              message: '任务执行成功，处理了980条记录'
            },
            {
              timestamp: '2024-01-18 09:00:00',
              status: 'failed',
              message: '连接数据库失败'
            },
            {
              timestamp: '2024-01-17 09:00:00',
              status: 'success',
              message: '任务执行成功，处理了1020条记录'
            }
          ]
        };
        setSchedule(mockSchedule);
      }
    }
  }, [externalSchedule, searchParams]);

  if (!schedule) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground">正在加载调度任务详情...</p>
        </div>
      </div>
    );
  }

  const handleToggleStatus = () => {
    onToggleStatus?.(schedule);
    // 更新本地状态
    setSchedule(prev => prev ? {
      ...prev,
      status: prev.status === '运行中' ? '已暂停' : '运行中'
    } : null);
  };

  const handleRunNow = () => {
    onRunNow?.(schedule);
    // 模拟立即运行
    alert(`正在立即执行任务: ${schedule.taskName}`);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{schedule.taskName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              调度任务详情 - {schedule.id}
            </p>
          </div>
          <div className="flex space-x-2">
            <MdButton 
              variant="outline"
              onClick={handleRunNow}
            >
              <Play className="h-4 w-4 mr-2" />
              立即执行
            </MdButton>
            <MdButton 
              variant={schedule.status === '运行中' ? 'warning' : 'success'}
              onClick={handleToggleStatus}
            >
              {schedule.status === '运行中' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {schedule.status === '运行中' ? '暂停' : '启动'}
            </MdButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MdCard>
              <MdCardHeader>
                <MdCardTitle>基本信息</MdCardTitle>
                <MdCardDescription>调度任务的基本信息和配置</MdCardDescription>
              </MdCardHeader>
              <MdCardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">任务类型</div>
                    <div className="font-medium">
                      <MdBadge variant="secondary">{schedule.taskType}</MdBadge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Cron表达式</div>
                    <div className="font-mono text-sm">{schedule.cronExpression || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">关联模型</div>
                    <div className="font-medium">{schedule.modelName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">创建时间</div>
                    <div className="font-medium">{schedule.createTime}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">描述</div>
                  <div className="font-medium">{schedule.description}</div>
                </div>
              </MdCardContent>
            </MdCard>

            <MdCard>
              <MdCardHeader>
                <MdCardTitle>执行统计</MdCardTitle>
                <MdCardDescription>调度任务的执行情况统计</MdCardDescription>
              </MdCardHeader>
              <MdCardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {schedule.triggerCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">触发次数</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {schedule.successCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">成功次数</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {schedule.failureCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">失败次数</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {schedule.triggerCount ? Math.round(((schedule.successCount || 0) / schedule.triggerCount) * 100) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">成功率</div>
                  </div>
                </div>
                
                {/* 应用范围 */}
                {schedule.scheduleConfig && schedule.scheduleConfig.applicationScope && schedule.scheduleConfig.applicationScope.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-3">应用范围</div>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-muted/30">
                      <OrganizationTree
                        data={orgTreeData}
                        selectedIds={schedule.scheduleConfig.applicationScope || []}
                        defaultExpanded={true}
                        readonly={true}
                      />
                    </div>
                  </div>
                )}
              </MdCardContent>
            </MdCard>

            <MdCard>
              <MdCardHeader>
                <MdCardTitle>参数配置</MdCardTitle>
                <MdCardDescription>调度任务的参数配置</MdCardDescription>
              </MdCardHeader>
              <MdCardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参数名</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参数值</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedule.parameters ? Object.entries(schedule.parameters).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{JSON.stringify(value)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">暂无参数配置</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </MdCardContent>
            </MdCard>
          </div>

          <div className="space-y-6">
            <MdCard>
              <MdCardHeader>
                <MdCardTitle>状态信息</MdCardTitle>
                <MdCardDescription>调度任务的当前状态信息</MdCardDescription>
              </MdCardHeader>
              <MdCardContent className="space-y-4">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">当前状态</div>
                    <div className="font-medium">
                      <MdBadge 
                        variant={
                          schedule.status === '运行中' ? 'success' : 
                          schedule.status === '已暂停' ? 'warning' : 
                          schedule.status === '已完成' ? 'secondary' : 'danger'
                        }
                      >
                        {schedule.status}
                      </MdBadge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">上次执行时间</div>
                    <div className="font-medium">{schedule.lastRunTime || '-'}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">下次执行时间</div>
                    <div className="font-medium">{schedule.nextRunTime || '-'}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">创建人</div>
                    <div className="font-medium">{schedule.creator}</div>
                  </div>
                </div>
              </MdCardContent>
            </MdCard>

            <MdCard>
              <MdCardHeader>
                <MdCardTitle>最近执行日志</MdCardTitle>
                <MdCardDescription>调度任务最近的执行日志</MdCardDescription>
              </MdCardHeader>
              <MdCardContent className="space-y-3">
                {schedule.logs && schedule.logs.length > 0 ? (
                  schedule.logs.slice(0, 5).map((log, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {log.status === 'success' ? (
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                          ) : log.status === 'failed' ? (
                            <X className="h-4 w-4 mr-2 text-red-600" />
                          ) : (
                            <Activity className="h-4 w-4 mr-2 text-yellow-600" />
                          )}
                          <span className="font-medium">{log.status === 'success' ? '成功' : log.status === 'failed' ? '失败' : '运行中'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-sm mt-1 text-muted-foreground">{log.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    暂无执行日志
                  </div>
                )}
              </MdCardContent>
            </MdCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ScheduleDetailPage };