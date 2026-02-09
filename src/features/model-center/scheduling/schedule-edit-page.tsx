'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent, MdCardDescription } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdCheckbox } from '@/components/enterprise-ui/md-checkbox';
import { OrganizationTree, OrgTreeNode } from '@/components/enterprise-ui/organization-tree';
import { Save, ArrowLeft } from 'lucide-react';

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
  timeoutAlert: boolean; // 执行超时告警
  timeoutMinutes?: number; // 超时时间（分钟）
}

type TaskStatus = '运行中' | '已暂停' | '已完成' | '异常';

interface ScheduleTask {
  id: string;
  taskName: string;
  taskType: '按时间' | '按任务' | 'API方式' | '单次触发';
  cronExpression?: string;
  lastRunTime?: string;
  nextRunTime?: string;
  status: TaskStatus;
  modelId: string;
  modelName: string;
  creator: string;
  createTime: string;
  description: string;
  triggerCount?: number;
  successCount?: number;
  failureCount?: number;
  scheduleConfig?: ScheduleConfig;
}

interface ScheduleEditPageProps {
  schedule?: ScheduleTask;
  onSave?: (schedule: ScheduleTask) => void;
}

const ScheduleEditPage: React.FC<ScheduleEditPageProps> = ({ schedule: externalSchedule, onSave }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [schedule, setSchedule] = useState<ScheduleTask | null>(externalSchedule || null);
  
  // 任务基本信息
  const [taskName, setTaskName] = useState('');
  const [modelId, setModelId] = useState('');
  const [description, setDescription] = useState('');
  
  // 调度配置
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    applicationScope: [],
    taskType: '按时间',
    scheduleType: 'periodic',
    retryEnabled: false,
    timeoutAlert: false,
    timeoutMinutes: 30
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 组织树数据
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

  // 模拟模型列表
  const modelOptions = [
    { value: 'model-001', label: '污水处理效果预测模型' },
    { value: 'model-002', label: '水质监测预警模型' },
    { value: 'model-003', label: '污水流量预测模型' },
    { value: 'model-004', label: '污染物浓度预测模型' },
    { value: 'model-005', label: '曝气系统控制模型' }
  ];

  // 初始化表单数据
  useEffect(() => {
    if (externalSchedule) {
      setTaskName(externalSchedule.taskName);
      setModelId(externalSchedule.modelId);
      setDescription(externalSchedule.description);
      if (externalSchedule.scheduleConfig) {
        setScheduleConfig(externalSchedule.scheduleConfig);
      }
    } else {
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
            applicationScope: ['taiyuan-beijiao', 'yuhang'],
            taskType: '按时间',
            scheduleType: 'periodic',
            periodType: 'daily',
            cronExpression: '0 9 * * *',
            retryEnabled: true,
            retryCount: 3,
            retryInterval: 5,
            timeoutAlert: true,
            timeoutMinutes: 30
          }
        };
        setSchedule(mockSchedule);
        setTaskName(mockSchedule.taskName);
        setModelId(mockSchedule.modelId);
        setDescription(mockSchedule.description);
        if (mockSchedule.scheduleConfig) {
          setScheduleConfig(mockSchedule.scheduleConfig);
        }
      }
    }
  }, [externalSchedule, searchParams]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!taskName.trim()) {
      newErrors.taskName = '请输入任务名称';
    }
    
    if (!modelId) {
      newErrors.modelId = '请选择关联模型';
    }
    
    if (scheduleConfig.applicationScope.length === 0) {
      newErrors.applicationScope = '请至少选择一个应用范围';
    }
    
    if (scheduleConfig.taskType === '按时间') {
      if (scheduleConfig.scheduleType === 'periodic' && scheduleConfig.periodType === 'custom' && !scheduleConfig.cronExpression?.trim()) {
        newErrors.cronExpression = '请输入Cron表达式';
      }
      if (scheduleConfig.scheduleType === 'interval') {
        if (!scheduleConfig.intervalStartTime) {
          newErrors.intervalStartTime = '请选择开始时间';
        }
        if (!scheduleConfig.intervalEndTime) {
          newErrors.intervalEndTime = '请选择结束时间';
        }
        if (!scheduleConfig.intervalFrequency) {
          newErrors.intervalFrequency = '请选择频率';
        }
      }
    }
    
    if (scheduleConfig.retryEnabled) {
      if (!scheduleConfig.retryCount || scheduleConfig.retryCount <= 0) {
        newErrors.retryCount = '请输入有效的重试次数';
      }
      if (!scheduleConfig.retryInterval || scheduleConfig.retryInterval <= 0) {
        newErrors.retryInterval = '请输入有效的重试间隔';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 准备提交数据
      const submitData: ScheduleTask = {
        ...schedule!,
        taskName,
        modelId,
        modelName: modelOptions.find(m => m.value === modelId)?.label || schedule?.modelName || '',
        description,
        taskType: scheduleConfig.taskType,
        cronExpression: scheduleConfig.cronExpression,
        scheduleConfig: {
          ...scheduleConfig
        }
      };
      
      // 调用保存回调
      onSave?.(submitData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存成功后跳转到详情页
      router.push(`/categories/model-center/scheduling/schedule-detail?id=${schedule?.id}`);
      router.refresh(); // 刷新页面
      
      console.log('调度任务更新成功:', submitData);
    } catch (error) {
      console.error('更新调度任务失败:', error);
      alert('更新调度任务失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!schedule) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-12 w-12 text-muted-foreground mx-auto animate-spin">⏳</div>
          <p className="mt-4 text-muted-foreground">正在加载调度任务...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">编辑调度任务</h1>
          <p className="text-sm text-muted-foreground">
            修改模型调度任务的配置
          </p>
        </div>
        <div className="flex space-x-2">
          <MdButton 
            variant="outline" 
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            取消
          </MdButton>
          <MdButton 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? '提交中...' : '保存更改'}
          </MdButton>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本配置 */}
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>基本配置</MdCardTitle>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                任务名称 <span className="text-red-500">*</span>
              </label>
              <MdInput
                placeholder="请输入调度任务名称"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className={errors.taskName ? 'border-red-500' : ''}
              />
              {errors.taskName && (
                <p className="mt-1 text-sm text-red-600">{errors.taskName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                关联模型 <span className="text-red-500">*</span>
              </label>
              <MdSelect
                options={modelOptions}
                value={modelId}
                onChange={(value) => setModelId(value)}
                className={errors.modelId ? 'border-red-500' : ''}
              />
              {errors.modelId && (
                <p className="mt-1 text-sm text-red-600">{errors.modelId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                描述
              </label>
              <textarea
                placeholder="请输入任务描述..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </MdCardContent>
        </MdCard>

        {/* 运行调度管理 */}
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>运行调度管理</MdCardTitle>
            <MdCardDescription>配置模型的运行调度策略</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-6">
            {/* 选择应用范围 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                选择应用范围 <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="text-sm text-muted-foreground mb-3">从组织树中选择调度的应用范围（可多选）</div>
                <OrganizationTree
                  data={orgTreeData}
                  selectedIds={scheduleConfig.applicationScope}
                  onSelectionChange={(selectedIds) => {
                    setScheduleConfig({
                      ...scheduleConfig,
                      applicationScope: selectedIds
                    });
                    if (errors.applicationScope) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.applicationScope;
                        return newErrors;
                      });
                    }
                  }}
                  defaultExpanded={true}
                />
                {errors.applicationScope && (
                  <p className="mt-2 text-sm text-red-600">{errors.applicationScope}</p>
                )}
                {scheduleConfig.applicationScope.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-1">已选择 {scheduleConfig.applicationScope.length} 个组织</div>
                  </div>
                )}
              </div>
            </div>

            {/* 任务类型 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                任务类型 <span className="text-red-500">*</span>
              </label>
              <MdSelect
                options={[
                  { value: '按时间', label: '按时间' },
                  { value: '按任务', label: '按任务' },
                  { value: 'API方式', label: 'API方式' },
                  { value: '单次触发', label: '单次触发' }
                ]}
                value={scheduleConfig.taskType}
                onChange={(value) => setScheduleConfig({ ...scheduleConfig, taskType: value as any })}
              />
            </div>

            {/* 按时间时的运行机制配置 */}
            {scheduleConfig.taskType === '按时间' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">运行机制</label>
                  <MdSelect
                    options={[
                      { value: 'periodic', label: '周期性' },
                      { value: 'interval', label: '区间运行' }
                    ]}
                    value={scheduleConfig.scheduleType}
                    onChange={(value) => setScheduleConfig({ ...scheduleConfig, scheduleType: value as any })}
                  />
                </div>

                {scheduleConfig.scheduleType === 'periodic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">周期类型</label>
                      <MdSelect
                        options={[
                          { value: 'daily', label: '每天' },
                          { value: 'hourly', label: '每小时' },
                          { value: 'weekly', label: '每周' },
                          { value: 'monthly', label: '每月' },
                          { value: 'custom', label: '自定义Cron' }
                        ]}
                        value={scheduleConfig.periodType}
                        onChange={(value) => setScheduleConfig({ ...scheduleConfig, periodType: value as any })}
                      />
                    </div>
                    {scheduleConfig.periodType === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Cron表达式</label>
                        <MdInput
                          value={scheduleConfig.cronExpression || ''}
                          onChange={(e) => setScheduleConfig({ ...scheduleConfig, cronExpression: e.target.value })}
                          placeholder="例如: 0 9 * * *"
                          className={errors.cronExpression ? 'border-red-500' : ''}
                        />
                        {errors.cronExpression && (
                          <p className="mt-1 text-sm text-red-600">{errors.cronExpression}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {scheduleConfig.scheduleType === 'interval' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">开始时间</label>
                      <MdInput
                        type="datetime-local"
                        value={scheduleConfig.intervalStartTime || ''}
                        onChange={(e) => setScheduleConfig({ ...scheduleConfig, intervalStartTime: e.target.value })}
                        className={errors.intervalStartTime ? 'border-red-500' : ''}
                      />
                      {errors.intervalStartTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.intervalStartTime}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">结束时间</label>
                      <MdInput
                        type="datetime-local"
                        value={scheduleConfig.intervalEndTime || ''}
                        onChange={(e) => setScheduleConfig({ ...scheduleConfig, intervalEndTime: e.target.value })}
                        className={errors.intervalEndTime ? 'border-red-500' : ''}
                      />
                      {errors.intervalEndTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.intervalEndTime}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">频率</label>
                      <MdSelect
                        options={[
                          { value: '30min', label: '每30分钟' },
                          { value: '1hour', label: '每小时' },
                          { value: '6hour', label: '每6小时' },
                          { value: 'daily', label: '每天' }
                        ]}
                        value={scheduleConfig.intervalFrequency}
                        onChange={(value) => setScheduleConfig({ ...scheduleConfig, intervalFrequency: value as any })}
                        className={errors.intervalFrequency ? 'border-red-500' : ''}
                      />
                      {errors.intervalFrequency && (
                        <p className="mt-1 text-sm text-red-600">{errors.intervalFrequency}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 失败重试策略 */}
            <div>
              <div className="flex items-center mb-2">
                <MdCheckbox
                  checked={scheduleConfig.retryEnabled}
                  onChange={(checked) => setScheduleConfig({ ...scheduleConfig, retryEnabled: checked })}
                />
                <span className="ml-2">支持失败重试</span>
              </div>
              {scheduleConfig.retryEnabled && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">重试次数</label>
                    <MdInput
                      type="number"
                      value={scheduleConfig.retryCount?.toString() || ''}
                      onChange={(e) => setScheduleConfig({ ...scheduleConfig, retryCount: parseInt(e.target.value) || 0 })}
                      className={errors.retryCount ? 'border-red-500' : ''}
                    />
                    {errors.retryCount && (
                      <p className="mt-1 text-sm text-red-600">{errors.retryCount}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">重试间隔（分钟）</label>
                    <MdInput
                      type="number"
                      value={scheduleConfig.retryInterval?.toString() || ''}
                      onChange={(e) => setScheduleConfig({ ...scheduleConfig, retryInterval: parseInt(e.target.value) || 0 })}
                      className={errors.retryInterval ? 'border-red-500' : ''}
                    />
                    {errors.retryInterval && (
                      <p className="mt-1 text-sm text-red-600">{errors.retryInterval}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 高级选项 */}
            <div className="space-y-2">
              <div className="flex items-center">
                <MdCheckbox
                  checked={scheduleConfig.timeoutAlert}
                  onChange={(checked) => setScheduleConfig({ ...scheduleConfig, timeoutAlert: checked })}
                />
                <span className="ml-2">执行超时告警（运行超过 {scheduleConfig.timeoutMinutes || 30} 分钟发送告警给负责人）</span>
              </div>
              {scheduleConfig.timeoutAlert && (
                <div className="ml-6">
                  <label className="block text-sm font-medium mb-2">超时时间（分钟）</label>
                  <MdInput
                    type="number"
                    value={scheduleConfig.timeoutMinutes?.toString() || '30'}
                    onChange={(e) => setScheduleConfig({ ...scheduleConfig, timeoutMinutes: parseInt(e.target.value) || 30 })}
                    className="w-48"
                  />
                </div>
              )}
            </div>
          </MdCardContent>
        </MdCard>
      </form>
    </div>
  );
};

export { ScheduleEditPage };