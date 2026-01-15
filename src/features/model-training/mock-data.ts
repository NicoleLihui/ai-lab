// 污水处理行业模型训练任务Mock数据
export interface TrainingTask {
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