// 可训练模型数据接口
export interface TrainableModel {
  id: string;
  modelId: string;
  modelName: string;
  version: string;
  modelType: string;
  developLanguage: string;
  status: string; // 模型状态（如：已发布、草稿、已下线）
  description: string;
  applicableScenario: string; // 适用场景
  createTime: string;
  updateTime: string;
  tags?: string[];
  parameters?: ModelParameter[]; // 模型可配置参数
}

// 模型参数接口
export interface ModelParameter {
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  defaultValue: any;
  description: string;
  required: boolean;
  options?: string[]; // 仅当type为select时使用
}

// 污水处理行业模型训练任务Mock数据
export interface TrainingTask extends Record<string, unknown> {
  id: string;
  taskName: string;
  modelName: string;
  version: string;
  modelType: string;
  developLanguage: string;
  statusName: string;
  trainTime: number;
  deployTestStatus: number;
  evaluateIndex?: string;
  evaluateIndexData?: Record<string, any>;
  createTime: string;
  modelId: string;
  runId: string;
  modelKey: string;
}

export interface TrainingResult {
  runId: string;
  inputJson: string;
  runDataVO: {
    picList: string[];
    csvReturnVO: {
      titleMap: Record<string, string>;
      dataList: Record<string, string | number>[];
    };
    evaIndexList: Array<{ name: string; desc: string; value: string }>;
  };
};

// 可训练模型的模拟数据
export const mockTrainableModels: TrainableModel[] = [
  {
    id: "1",
    modelId: "model_001",
    modelName: "水质预测模型",
    version: "v1.2.0",
    modelType: "回归模型",
    developLanguage: "Python",
    status: "已发布",
    description: "基于历史水质数据预测未来水质指标变化趋势",
    applicableScenario: "污水处理厂水质预测",
    createTime: "2025-12-10 09:30:00",
    updateTime: "2026-01-10 14:20:00",
    tags: ["水质预测", "回归分析", "时间序列"],
    parameters: [
      {
        name: "window_size",
        displayName: "时间窗口大小",
        type: "number",
        defaultValue: 24,
        description: "用于预测的时间窗口大小（小时）",
        required: true
      },
      {
        name: "learning_rate",
        displayName: "学习率",
        type: "number",
        defaultValue: 0.001,
        description: "模型训练的学习率",
        required: true
      },
      {
        name: "epochs",
        displayName: "训练轮数",
        type: "number",
        defaultValue: 100,
        description: "模型训练的轮数",
        required: true
      }
    ]
  },
  {
    id: "2",
    modelId: "model_002",
    modelName: "污泥浓度识别模型",
    version: "v2.1.3",
    modelType: "分类模型",
    developLanguage: "Python",
    status: "已发布",
    description: "识别和分类污泥浓度水平，辅助工艺调控",
    applicableScenario: "污泥处理工艺",
    createTime: "2025-11-15 10:45:00",
    updateTime: "2026-01-08 11:15:00",
    tags: ["分类", "污泥处理", "工艺优化"],
    parameters: [
      {
        name: "threshold",
        displayName: "识别阈值",
        type: "number",
        defaultValue: 0.7,
        description: "分类的置信度阈值",
        required: true
      },
      {
        name: "batch_size",
        displayName: "批次大小",
        type: "number",
        defaultValue: 32,
        description: "训练时的批次大小",
        required: true
      }
    ]
  },
  {
    id: "3",
    modelId: "model_003",
    modelName: "COD去除率优化模型",
    version: "v1.1.0",
    modelType: "强化学习",
    developLanguage: "Python",
    status: "已发布",
    description: "优化COD去除率的强化学习模型",
    applicableScenario: "COD去除工艺优化",
    createTime: "2025-10-20 14:30:00",
    updateTime: "2026-01-05 16:40:00",
    tags: ["强化学习", "工艺优化", "COD去除"],
    parameters: [
      {
        name: "gamma",
        displayName: "折扣因子",
        type: "number",
        defaultValue: 0.99,
        description: "强化学习折扣因子",
        required: true
      },
      {
        name: "epsilon",
        displayName: "探索率",
        type: "number",
        defaultValue: 0.1,
        description: "探索策略的随机性",
        required: true
      }
    ]
  },
  {
    id: "4",
    modelId: "model_004",
    modelName: "曝气池溶解氧预测",
    version: "v3.0.1",
    modelType: "时间序列",
    developLanguage: "Python",
    status: "已发布",
    description: "预测曝气池中溶解氧浓度的变化",
    applicableScenario: "曝气池溶解氧控制",
    createTime: "2025-09-12 08:20:00",
    updateTime: "2025-12-28 10:30:00",
    tags: ["时间序列", "溶解氧", "曝气控制"],
    parameters: [
      {
        name: "forecast_horizon",
        displayName: "预测范围",
        type: "number",
        defaultValue: 24,
        description: "预测未来多少小时的数据",
        required: true
      },
      {
        name: "seasonal_periods",
        displayName: "季节周期",
        type: "number",
        defaultValue: 24,
        description: "季节性周期长度",
        required: true
      }
    ]
  },
  {
    id: "5",
    modelId: "model_005",
    modelName: "能耗预测模型",
    version: "v1.3.2",
    modelType: "深度学习",
    developLanguage: "Python",
    status: "已发布",
    description: "预测污水处理厂整体能耗",
    applicableScenario: "能耗管理",
    createTime: "2025-08-05 13:15:00",
    updateTime: "2025-12-20 15:20:00",
    tags: ["深度学习", "能耗预测", "节能优化"],
    parameters: [
      {
        name: "hidden_units",
        displayName: "隐藏单元数",
        type: "number",
        defaultValue: 128,
        description: "神经网络隐藏层单元数量",
        required: true
      },
      {
        name: "dropout_rate",
        displayName: "丢弃率",
        type: "number",
        defaultValue: 0.2,
        description: "防止过拟合的丢弃率",
        required: true
      }
    ]
  },
  {
    id: "6",
    modelId: "model_006",
    modelName: "出水氨氮浓度监测",
    version: "v2.0.0",
    modelType: "异常检测",
    developLanguage: "Python",
    status: "已发布",
    description: "监测出水氨氮浓度异常",
    applicableScenario: "水质异常检测",
    createTime: "2025-07-18 11:40:00",
    updateTime: "2025-12-15 09:10:00",
    tags: ["异常检测", "氨氮监测", "水质安全"],
    parameters: [
      {
        name: "anomaly_threshold",
        displayName: "异常阈值",
        type: "number",
        defaultValue: 0.95,
        description: "异常检测的置信阈值",
        required: true
      },
      {
        name: "window_size",
        displayName: "检测窗口",
        type: "number",
        defaultValue: 12,
        description: "异常检测的时间窗口",
        required: true
      }
    ]
  }
];

// Mock评估指标数据
const mockEvaluateIndices = [
  {
    name: "准确率",
    value: "92.5%"
  },
  {
    name: "召回率",
    value: "89.3%"
  },
  {
    name: "F1分数",
    value: "90.8%"
  },
  {
    name: "AUC",
    value: "0.942"
  }
];

const createPlaceholderImage = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="320">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-size="18" font-family="Arial" fill="#6b7280" dominant-baseline="middle" text-anchor="middle">${label}</text>
    </svg>`,
  )}`;

const mockTrainingResults: Record<string, TrainingResult> = {
  run_001: {
    runId: "run_001",
    inputJson: JSON.stringify(
      {
        windowSize: 12,
        learningRate: 0.001,
        batchSize: 64,
        epochs: 80,
        optimizer: "Adam",
      },
      null,
      2,
    ),
    runDataVO: {
      picList: [createPlaceholderImage("训练结果图 1"), createPlaceholderImage("训练结果图 2")],
      csvReturnVO: {
        titleMap: {
          column1: "样本编号",
          column2: "预测值",
          column3: "真实值",
          column4: "误差",
        },
        dataList: [
          { column1: "A001", column2: 12.3, column3: 11.8, column4: 0.5 },
          { column1: "A002", column2: 10.9, column3: 11.2, column4: -0.3 },
          { column1: "A003", column2: 13.1, column3: 12.9, column4: 0.2 },
        ],
      },
      evaIndexList: [
        { name: "RMSE", desc: "均方根误差", value: "0.15" },
        { name: "MAE", desc: "平均绝对误差", value: "0.08" },
        { name: "R²", desc: "拟合优度", value: "0.87" },
      ],
    },
  },
  run_004: {
    runId: "run_004",
    inputJson: JSON.stringify(
      {
        forecastHorizon: 24,
        seasonal: true,
        trend: "additive",
        confidence: 0.9,
      },
      null,
      2,
    ),
    runDataVO: {
      picList: [createPlaceholderImage("预测曲线图")],
      csvReturnVO: {
        titleMap: {
          column1: "时间点",
          column2: "预测DO",
          column3: "实际DO",
        },
        dataList: [
          { column1: "2026-01-08 12:00", column2: 2.6, column3: 2.4 },
          { column1: "2026-01-08 13:00", column2: 2.8, column3: 2.7 },
          { column1: "2026-01-08 14:00", column2: 2.5, column3: 2.6 },
        ],
      },
      evaIndexList: [
        { name: "MAPE", desc: "平均绝对百分比误差", value: "8.3%" },
        { name: "RMSE", desc: "均方根误差", value: "0.22" },
      ],
    },
  },
  run_006: {
    runId: "run_006",
    inputJson: JSON.stringify(
      {
        anomalyThreshold: 0.92,
        featureCount: 18,
        batchSize: 32,
        epochs: 60,
      },
      null,
      2,
    ),
    runDataVO: {
      picList: [],
      csvReturnVO: {
        titleMap: {
          column1: "样本编号",
          column2: "预测结果",
          column3: "真实标记",
        },
        dataList: [
          { column1: "B1001", column2: "正常", column3: "正常" },
          { column1: "B1002", column2: "异常", column3: "异常" },
          { column1: "B1003", column2: "正常", column3: "正常" },
        ],
      },
      evaIndexList: [
        { name: "准确率", desc: "预测准确率", value: "96.7%" },
        { name: "误报率", desc: "误报占比", value: "2.1%" },
      ],
    },
  },
};

// 污水处理行业相关的模型任务数据
export const mockTrainingTasks: TrainingTask[] = [
  {
    id: "1",
    taskName: "水质预测模型训练_v1.0",
    modelName: "WaterQualityPredictor",
    version: "1.0.0",
    modelType: "回归模型",
    developLanguage: "Python",
    statusName: "训练完成",
    trainTime: 1245,
    deployTestStatus: 1,
    evaluateIndex: JSON.stringify([
      { name: "RMSE", value: "0.15" },
      { name: "MAE", value: "0.08" },
      { name: "R²", value: "0.87" }
    ]),
    evaluateIndexData: {
      "RMSE": "0.15",
      "MAE": "0.08",
      "R²": "0.87"
    },
    createTime: "2026-01-10 14:30:25",
    modelId: "model_001",
    runId: "run_001",
    modelKey: "water_quality_predictor"
  },
  {
    id: "2",
    taskName: "污泥浓度识别模型_v2.1",
    modelName: "SludgeConcentrationClassifier",
    version: "2.1.3",
    modelType: "分类模型",
    developLanguage: "Python",
    statusName: "训练中",
    trainTime: 856,
    deployTestStatus: 0,
    evaluateIndex: JSON.stringify([
      { name: "准确率", value: "94.2%" },
      { name: "精确率", value: "92.8%" },
      { name: "召回率", value: "95.1%" }
    ]),
    evaluateIndexData: {
      "准确率": "94.2%",
      "精确率": "92.8%",
      "召回率": "95.1%"
    },
    createTime: "2026-01-12 09:15:42",
    modelId: "model_002",
    runId: "run_002",
    modelKey: "sludge_concentration_classifier"
  },
  {
    id: "3",
    taskName: "COD去除率优化模型",
    modelName: "CODOptimizationModel",
    version: "1.2.0",
    modelType: "强化学习",
    developLanguage: "Python",
    statusName: "等待中",
    trainTime: 0,
    deployTestStatus: 0,
    createTime: "2026-01-13 16:45:18",
    modelId: "model_003",
    runId: "run_003",
    modelKey: "cod_optimization_model"
  },
  {
    id: "4",
    taskName: "曝气池溶解氧预测",
    modelName: "DOPredictionModel",
    version: "3.0.1",
    modelType: "时间序列",
    developLanguage: "R",
    statusName: "训练完成",
    trainTime: 2103,
    deployTestStatus: 1,
    evaluateIndex: JSON.stringify([
      { name: "MAPE", value: "8.3%" },
      { name: "RMSE", value: "0.22" }
    ]),
    evaluateIndexData: {
      "MAPE": "8.3%",
      "RMSE": "0.22"
    },
    createTime: "2026-01-08 11:20:33",
    modelId: "model_004",
    runId: "run_004",
    modelKey: "do_prediction_model"
  },
  {
    id: "5",
    taskName: "污水处理厂能耗预测",
    modelName: "EnergyConsumptionForecaster",
    version: "1.5.2",
    modelType: "深度学习",
    developLanguage: "Python",
    statusName: "训练失败",
    trainTime: 456,
    deployTestStatus: 0,
    createTime: "2026-01-11 13:42:17",
    modelId: "model_005",
    runId: "run_005",
    modelKey: "energy_consumption_forecaster"
  },
  {
    id: "6",
    taskName: "出水氨氮浓度监测",
    modelName: "AmmoniaMonitor",
    version: "2.0.0",
    modelType: "异常检测",
    developLanguage: "Python",
    statusName: "训练完成",
    trainTime: 1876,
    deployTestStatus: 1,
    evaluateIndex: JSON.stringify([
      { name: "准确率", value: "96.7%" },
      { name: "误报率", value: "2.1%" }
    ]),
    evaluateIndexData: {
      "准确率": "96.7%",
      "误报率": "2.1%"
    },
    createTime: "2026-01-09 15:30:45",
    modelId: "model_006",
    runId: "run_006",
    modelKey: "ammonia_monitor"
  },
  {
    id: "7",
    taskName: "生物反应器状态预测",
    modelName: "BioreactorStatePredictor",
    version: "1.1.0",
    modelType: "多任务学习",
    developLanguage: "Python",
    statusName: "训练中",
    trainTime: 634,
    deployTestStatus: 0,
    createTime: "2026-01-14 10:15:22",
    modelId: "model_007",
    runId: "run_007",
    modelKey: "bioreactor_state_predictor"
  },
  {
    id: "8",
    taskName: "污泥沉降比预测模型",
    modelName: "SVIPredictor",
    version: "1.3.4",
    modelType: "集成学习",
    developLanguage: "Python",
    statusName: "训练完成",
    trainTime: 1567,
    deployTestStatus: 1,
    evaluateIndex: JSON.stringify([
      { name: "R²", value: "0.91" },
      { name: "MAE", value: "1.2%" }
    ]),
    evaluateIndexData: {
      "R²": "0.91",
      "MAE": "1.2%"
    },
    createTime: "2026-01-07 08:45:30",
    modelId: "model_008",
    runId: "run_008",
    modelKey: "svi_predictor"
  }
];

// 分页数据生成函数
export const getMockTrainingPage = (params: {
  currentPage: number;
  pageSize: number;
  searchWord?: string;
  sort?: number;
  pageType?: number;
}) => {
  let filteredData = [...mockTrainingTasks];
  
  // 搜索过滤
  if (params.searchWord) {
    const searchLower = params.searchWord.toLowerCase();
    filteredData = filteredData.filter(task => 
      task.taskName.toLowerCase().includes(searchLower) ||
      task.modelName.toLowerCase().includes(searchLower)
    );
  }
  
  // 排序
  if (params.sort === 1) {
    filteredData.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  }
  
  // 分页
  const total = filteredData.length;
  const startIndex = (params.currentPage - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const body = filteredData.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: {
      body,
      total
    },
    message: "获取成功"
  };
};

// 部署测试模拟函数
export const mockDeployTest = (params: {
  modelId: string;
  runId: string;
  modelKey: string;
  modelName: string;
  version: string;
}) => {
  // 模拟部署测试过程
  return {
    success: true,
    message: `模型 ${params.modelName} v${params.version} 部署测试启动成功`,
    data: {
      deploymentId: `deploy_${Date.now()}`,
      status: "deploying"
    }
  };
};

export const getMockTrainingResult = (params: { runId: string }) => {
  const data = mockTrainingResults[params.runId] ?? mockTrainingResults.run_001;
  return {
    success: true,
    data,
    message: "获取成功",
  };
};

// 获取可训练模型列表
export const getMockTrainableModels = (params: {
  currentPage: number;
  pageSize: number;
  searchWord?: string;
  modelType?: string;
  status?: string;
}) => {
  let filteredData = [...mockTrainableModels];
  
  // 搜索过滤
  if (params.searchWord) {
    const searchLower = params.searchWord.toLowerCase();
    filteredData = filteredData.filter(model => 
      model.modelName.toLowerCase().includes(searchLower) ||
      model.description.toLowerCase().includes(searchLower) ||
      model.applicableScenario.toLowerCase().includes(searchLower)
    );
  }
  
  // 按模型类型过滤
  if (params.modelType) {
    filteredData = filteredData.filter(model => 
      model.modelType.includes(params.modelType!)
    );
  }
  
  // 按状态过滤
  if (params.status) {
    filteredData = filteredData.filter(model => 
      model.status.includes(params.status!)
    );
  }
  
  // 分页
  const total = filteredData.length;
  const startIndex = (params.currentPage - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const body = filteredData.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: {
      body,
      total
    },
    message: "获取成功"
  };
};

// 启动模型训练模拟函数
export const mockStartTraining = (params: {
  modelId: string;
  modelName: string;
  version: string;
  taskName: string;
  trainingParams: Record<string, any>;
}) => {
  return {
    success: true,
    message: `模型 ${params.modelName} 的训练任务已启动`,
    data: {
      taskId: `task_${Date.now()}`,
      taskName: params.taskName,
      status: "pending",
      startTime: new Date().toISOString()
    }
  };
};