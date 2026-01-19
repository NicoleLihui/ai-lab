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
}

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