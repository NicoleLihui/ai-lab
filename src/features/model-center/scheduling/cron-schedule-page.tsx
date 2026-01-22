'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import BeTable from '@/components/enterprise-ui/table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { Search, Eye, Plus, Play, Pause, Edit, Trash2, Clock, Calendar, User, Settings } from 'lucide-react';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';

// 定义调度任务数据接口
interface ScheduleTask {
  id: string;
  taskName: string;
  taskType: '定时调度' | '任务触发' | 'API调用';
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
  actions?: React.ReactNode;
}

// 主页面组件
const CronSchedulePage: React.FC = () => {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleTask[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taskTypeFilter, setTaskTypeFilter] = useState('all');

  // 模拟数据
  useEffect(() => {
    const mockData: ScheduleTask[] = [
      {
        id: '1',
        taskName: '每日推荐模型调度',
        taskType: '定时调度',
        cronExpression: '0 9 * * *',
        lastRunTime: '2024-01-20 09:00:00',
        nextRunTime: '2024-01-21 09:00:00',
        status: '运行中',
        modelId: 'model-001',
        modelName: '推荐算法模型',
        creator: '张三',
        createTime: '2024-01-15 10:30:00',
        description: '每天上午9点执行推荐模型预测任务',
        triggerCount: 20,
        successCount: 18,
        failureCount: 2
      },
      {
        id: '2',
        taskName: '实时风控模型调度',
        taskType: 'API调用',
        status: '运行中',
        modelId: 'model-002',
        modelName: '风控评分模型',
        creator: '李四',
        createTime: '2024-01-16 14:22:15',
        description: '接收API请求触发风控模型执行',
        triggerCount: 156,
        successCount: 154,
        failureCount: 2
      },
      {
        id: '3',
        taskName: '数据预处理调度',
        taskType: '定时调度',
        cronExpression: '0 2 * * *',
        lastRunTime: '2024-01-20 02:00:00',
        nextRunTime: '2024-01-21 02:00:00',
        status: '已暂停',
        modelId: 'model-003',
        modelName: '数据清洗模型',
        creator: '王五',
        createTime: '2024-01-17 09:15:00',
        description: '每天凌晨2点执行数据预处理任务',
        triggerCount: 15,
        successCount: 15,
        failureCount: 0
      },
      {
        id: '4',
        taskName: '批量预测调度',
        taskType: '任务触发',
        lastRunTime: '2024-01-19 16:30:00',
        nextRunTime: '2024-01-21 16:30:00',
        status: '异常',
        modelId: 'model-004',
        modelName: '销售预测模型',
        creator: '赵六',
        createTime: '2024-01-18 11:20:00',
        description: '每两天下午4点半执行销售预测任务',
        triggerCount: 8,
        successCount: 6,
        failureCount: 2
      },
      {
        id: '5',
        taskName: '特征工程调度',
        taskType: '定时调度',
        cronExpression: '0 0 * * 0',
        lastRunTime: '2024-01-14 00:00:00',
        nextRunTime: '2024-01-21 00:00:00',
        status: '运行中',
        modelId: 'model-005',
        modelName: '特征提取模型',
        creator: '孙七',
        createTime: '2024-01-10 15:45:20',
        description: '每周日凌晨执行特征工程任务',
        triggerCount: 3,
        successCount: 3,
        failureCount: 0
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
            onClick={() => router.push(`/categories/model-center/scheduling/schedule-detail?id=${item.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            详情
          </MdButton>
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/categories/model-center/scheduling/schedule-edit?id=${item.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            编辑
          </MdButton>
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              // 实现暂停/启动功能
              console.log(`切换任务状态: ${item.id}`);
            }}
          >
            {item.status === '运行中' ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {item.status === '运行中' ? '暂停' : '启动'}
          </MdButton>
        </div>
      )
    }));
    
    setSchedules(mockData);
    setFilteredSchedules(mockDataWithActions);
  }, []);

  // 过滤数据
  useEffect(() => {
    let result = schedules;
    
    // 按搜索词过滤
    if (searchTerm) {
      result = result.filter(schedule => 
        schedule.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.creator.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 按状态过滤
    if (statusFilter !== 'all') {
      result = result.filter(schedule => schedule.status === statusFilter);
    }
    
    // 按任务类型过滤
    if (taskTypeFilter !== 'all') {
      result = result.filter(schedule => schedule.taskType === taskTypeFilter);
    }
    
    // 为过滤后的数据项添加操作按钮
    const resultWithActions = result.map(item => ({
      ...item,
      actions: (
        <div className="flex space-x-2">
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/categories/model-center/scheduling/schedule-detail?id=${item.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            详情
          </MdButton>
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/categories/model-center/scheduling/schedule-edit?id=${item.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            编辑
          </MdButton>
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              // 实现暂停/启动功能
              console.log(`切换任务状态: ${item.id}`);
            }}
          >
            {item.status === '运行中' ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {item.status === '运行中' ? '暂停' : '启动'}
          </MdButton>
        </div>
      )
    }));
    
    setFilteredSchedules(resultWithActions);
  }, [searchTerm, statusFilter, taskTypeFilter, schedules]);

  // 表格列定义
  const columns = [
    {
      prop: 'taskName',
      label: '任务名称',
      width: 180,
      align: 'left',
      render: (row: ScheduleTask) => (
        <div className="font-medium">{row.taskName}</div>
      )
    },
    {
      prop: 'taskType',
      label: '任务类型',
      width: 120,
      align: 'center',
      render: (row: ScheduleTask) => (
        <MdBadge variant="secondary">{row.taskType}</MdBadge>
      )
    },
    {
      prop: 'modelName',
      label: '关联模型',
      width: 150,
      align: 'left',
      render: (row: ScheduleTask) => (
        <span>{row.modelName}</span>
      )
    },
    {
      prop: 'cronExpression',
      label: 'Cron表达式',
      width: 150,
      align: 'center',
      render: (row: ScheduleTask) => (
        <span>{row.cronExpression || '-'}</span>
      )
    },
    {
      prop: 'lastRunTime',
      label: '上次执行',
      width: 150,
      align: 'center',
      render: (row: ScheduleTask) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.lastRunTime || '-'}
        </div>
      )
    },
    {
      prop: 'nextRunTime',
      label: '下次执行',
      width: 150,
      align: 'center',
      render: (row: ScheduleTask) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.nextRunTime || '-'}
        </div>
      )
    },
    {
      prop: 'creator',
      label: '创建人',
      width: 100,
      align: 'center',
      render: (row: ScheduleTask) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.creator}
        </div>
      )
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      align: 'center',
      render: (row: ScheduleTask) => (
        <MdBadge 
          variant={
            row.status === '运行中' ? 'success' : 
            row.status === '已暂停' ? 'warning' : 
            row.status === '已完成' ? 'secondary' : 'danger'
          }
        >
          {row.status}
        </MdBadge>
      )
    },
    {
      prop: 'triggerCount',
      label: '触发次数',
      width: 100,
      align: 'center',
      render: (row: ScheduleTask) => (
        <span>{row.triggerCount || 0}</span>
      )
    },
    {
      prop: 'actions',
      label: '操作',
      width: 240,
      align: 'center'
    }
  ];

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader className="border-b">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <MdInput
                  placeholder="搜索任务名称、模型名称或创建人..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <MdSelect 
                options={[
                  { value: 'all', label: '全部类型' }, 
                  { value: '定时调度', label: '定时调度' }, 
                  { value: '任务触发', label: '任务触发' }, 
                  { value: 'API调用', label: 'API调用' }
                ]}
                value={taskTypeFilter}
                onChange={setTaskTypeFilter}
                className="w-[150px]"
              />
              <MdSelect 
                options={[
                  { value: 'all', label: '全部状态' }, 
                  { value: '运行中', label: '运行中' }, 
                  { value: '已暂停', label: '已暂停' }, 
                  { value: '已完成', label: '已完成' }, 
                  { value: '异常', label: '异常' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-[150px]"
              />
              <MdButton 
                variant="primary" 
                onClick={() => router.push('/categories/model-center/scheduling/schedule-create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                新建调度
              </MdButton>
            </div>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-0">
          <BeTable
            tableData={filteredSchedules}
            columns={columns}
            options={{ rowKey: 'id' }}
          />
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export { CronSchedulePage };