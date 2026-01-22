// 模型调度管理功能的假数据

export interface ScheduleTask {
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
  parameters?: Record<string, any>;
  logs?: Array<{
    timestamp: string;
    status: 'success' | 'failed' | 'running';
    message: string;
  }>;
}

// 模拟调度任务数据
export const mockScheduleTasks: ScheduleTask[] = [
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
    failureCount: 2,
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
    failureCount: 2,
    parameters: {
      'api_endpoint': 'https://api.example.com/risk-assessment',
      'timeout': 5000
    }
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

// 模型选项数据
export const modelOptions = [
  { value: 'model-001', label: '推荐算法模型' },
  { value: 'model-002', label: '风控评分模型' },
  { value: 'model-003', label: '数据清洗模型' },
  { value: 'model-004', label: '销售预测模型' },
  { value: 'model-005', label: '特征提取模型' },
  { value: 'model-006', label: 'NLP文本分类' },
  { value: 'model-007', label: '图像识别模型' },
  { value: 'model-008', label: '语音识别模型' }
];

// 任务类型选项
export const taskTypeOptions = [
  { value: '定时调度', label: '定时调度' },
  { value: '任务触发', label: '任务触发' },
  { value: 'API调用', label: 'API调用' }
];

// 模拟API函数
export const scheduleApi = {
  // 获取调度任务列表
  getSchedules: (): Promise<ScheduleTask[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockScheduleTasks]); // 返回副本以防止意外修改
      }, 500); // 模拟网络延迟
    });
  },

  // 根据ID获取单个调度任务
  getScheduleById: (id: string): Promise<ScheduleTask | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const schedule = mockScheduleTasks.find(task => task.id === id);
        resolve(schedule);
      }, 300);
    });
  },

  // 创建调度任务
  createSchedule: (schedule: Omit<ScheduleTask, 'id' | 'status' | 'createTime' | 'creator' | 'triggerCount' | 'successCount' | 'failureCount'>): Promise<ScheduleTask> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSchedule: ScheduleTask = {
          ...schedule,
          id: `sched-${Date.now()}`,
          status: '已暂停', // 新创建的任务默认为暂停状态
          creator: '当前用户', // 模拟当前登录用户
          createTime: new Date().toISOString(),
          triggerCount: 0,
          successCount: 0,
          failureCount: 0
        };
        // 将新任务添加到模拟数据中
        mockScheduleTasks.push(newSchedule);
        resolve(newSchedule);
      }, 800);
    });
  },

  // 更新调度任务
  updateSchedule: (id: string, updates: Partial<ScheduleTask>): Promise<ScheduleTask | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockScheduleTasks.findIndex(task => task.id === id);
        if (index !== -1) {
          const updatedSchedule = {
            ...mockScheduleTasks[index],
            ...updates
          };
          mockScheduleTasks[index] = updatedSchedule;
          resolve(updatedSchedule);
        } else {
          resolve(null);
        }
      }, 600);
    });
  },

  // 删除调度任务
  deleteSchedule: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = mockScheduleTasks.length;
        const filteredTasks = mockScheduleTasks.filter(task => task.id !== id);
        if (filteredTasks.length !== initialLength) {
          // 如果长度不同，说明找到了并删除了元素
          resolve(true);
        } else {
          resolve(false);
        }
      }, 400);
    });
  },

  // 切换调度任务状态
  toggleScheduleStatus: (id: string): Promise<ScheduleTask | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockScheduleTasks.findIndex(task => task.id === id);
        if (index !== -1) {
          const schedule = mockScheduleTasks[index];
          const newStatus: '运行中' | '已暂停' | '已完成' | '异常' = schedule.status === '运行中' ? '已暂停' : '运行中';
          const updatedSchedule = {
            ...schedule,
            status: newStatus
          };
          mockScheduleTasks[index] = updatedSchedule;
          resolve(updatedSchedule);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },


  // 立即执行调度任务
  runScheduleNow: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockScheduleTasks.findIndex(task => task.id === id);
        if (index !== -1) {
          // 更新执行统计
          mockScheduleTasks[index].triggerCount = (mockScheduleTasks[index].triggerCount || 0) + 1;
          mockScheduleTasks[index].successCount = (mockScheduleTasks[index].successCount || 0) + 1;
          mockScheduleTasks[index].lastRunTime = new Date().toISOString().substring(0, 19).replace('T', ' ');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 700);
    });
  }
};