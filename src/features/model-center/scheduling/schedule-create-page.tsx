'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { Check, X, Clock, Settings, Save, ArrowLeft } from 'lucide-react';

// 定义调度任务数据接口
type TaskType = '定时调度' | '任务触发' | 'API调用';

type TaskStatus = '运行中' | '已暂停' | '已完成' | '异常';

interface ScheduleTask {
  id: string;
  taskName: string;
  taskType: TaskType;
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
}

interface ScheduleCreatePageProps {
  onSave?: (schedule: Omit<ScheduleTask, 'id' | 'status' | 'createTime' | 'creator'> & { taskType: TaskType }) => void;
}

const ScheduleCreatePage: React.FC<ScheduleCreatePageProps> = ({ onSave }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    taskName: '',
    taskType: '定时调度',
    cronExpression: '',
    modelId: '',
    modelName: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 模拟模型列表
  const modelOptions = [
    { value: 'model-001', label: '推荐算法模型' },
    { value: 'model-002', label: '风控评分模型' },
    { value: 'model-003', label: '数据清洗模型' },
    { value: 'model-004', label: '销售预测模型' },
    { value: 'model-005', label: '特征提取模型' }
  ];

  const taskTypeOptions = [
    { value: '定时调度', label: '定时调度' },
    { value: '任务触发', label: '任务触发' },
    { value: 'API调用', label: 'API调用' }
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.taskName.trim()) {
      newErrors.taskName = '请输入任务名称';
    }
    
    if (!formData.modelId) {
      newErrors.modelId = '请选择关联模型';
    }
    
    if (formData.taskType === '定时调度' && !formData.cronExpression.trim()) {
      newErrors.cronExpression = '请输入Cron表达式';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 准备提交数据
      const submitData = {
        ...formData,
        // 确保taskType是正确的类型
        taskType: formData.taskType as TaskType,
        // 根据任务类型决定是否需要cron表达式
        ...(formData.taskType !== '定时调度' && { cronExpression: undefined })
      };
      
      // 调用保存回调
      onSave?.(submitData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存成功后跳转到列表页
      router.push('/categories/model-center/scheduling/cron-schedule');
      router.refresh(); // 刷新页面以显示新创建的任务
      
      console.log('调度任务创建成功:', submitData);
    } catch (error) {
      console.error('创建调度任务失败:', error);
      alert('创建调度任务失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">创建调度任务</h1>
          <p className="text-sm text-muted-foreground">
            配置新的模型调度任务，支持定时、触发和API三种调度方式
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
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                创建任务
              </>
            )}
          </MdButton>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>基本配置</MdCardTitle>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                任务名称 *
              </label>
              <MdInput
                placeholder="请输入调度任务名称"
                value={formData.taskName}
                onChange={(e) => handleChange('taskName', e.target.value)}
                className={errors.taskName ? 'border-red-500' : ''}
              />
              {errors.taskName && (
                <p className="mt-1 text-sm text-red-600">{errors.taskName}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                请输入一个具有描述性的任务名称
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                任务类型 *
              </label>
              <MdSelect
                options={taskTypeOptions}
                value={formData.taskType}
                onChange={(value) => handleChange('taskType', value)}
                className={errors.taskType ? 'border-red-500' : ''}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                选择调度任务的触发方式
              </p>
            </div>

            {formData.taskType === '定时调度' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cron表达式 *
                </label>
                <MdInput
                  placeholder="请输入Cron表达式，如：0 9 * * *"
                  value={formData.cronExpression}
                  onChange={(e) => handleChange('cronExpression', e.target.value)}
                  className={errors.cronExpression ? 'border-red-500' : ''}
                />
                {errors.cronExpression && (
                  <p className="mt-1 text-sm text-red-600">{errors.cronExpression}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  请输入符合标准的Cron表达式，例如：0 9 * * * 表示每天上午9点执行
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                关联模型 *
              </label>
              <MdSelect
                options={modelOptions}
                value={formData.modelId}
                onChange={(value) => handleChange('modelId', value)}
                className={errors.modelId ? 'border-red-500' : ''}
              />
              {errors.modelId && (
                <p className="mt-1 text-sm text-red-600">{errors.modelId}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                选择要调度执行的模型
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                描述
              </label>
              <textarea
                placeholder="请输入任务描述..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                输入关于此调度任务的详细描述
              </p>
            </div>
          </MdCardContent>
        </MdCard>

        <MdCard>
          <MdCardHeader>
            <MdCardTitle>高级配置</MdCardTitle>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  参数配置
                </label>
                <textarea
                  placeholder="请输入任务参数(JSON格式)..."
                  rows={4}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  输入任务执行时需要的参数，JSON格式
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  通知配置
                </label>
                <textarea
                  placeholder="请输入通知配置(JSON格式)..."
                  rows={4}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  输入任务执行通知的配置，JSON格式
                </p>
              </div>
            </div>
          </MdCardContent>
        </MdCard>
      </form>
    </div>
  );
};

// 定义MdTextarea组件（如果不存在的话）
const MdTextarea = ({ 
  placeholder, 
  value, 
  onChange, 
  rows = 3,
  className = '' 
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring ${className}`}
    />
  );
};

export { ScheduleCreatePage };