// Mock data for model training page
export const mockTrainingTasks = [
  {
    id: 1,
    taskName: "水质预测模型训练",
    modelName: "Water Quality Prediction Model",
    version: "v1.2.0",
    modelType: "机器学习",
    developLanguage: "Python",
    statusName: "已完成",
    trainTime: 1250,
    deployTestStatus: 1,
    evaluateIndexData: { accuracy: 0.92, precision: 0.88, recall: 0.91 },
    createTime: "2024-01-15 10:30:00"
  },
  {
    id: 2,
    taskName: "用水量预测模型训练",
    modelName: "Water Consumption Prediction Model",
    version: "v2.1.0",
    modelType: "深度学习",
    developLanguage: "Python",
    statusName: "训练中",
    trainTime: 2400,
    deployTestStatus: 0,
    evaluateIndexData: { accuracy: 0.85, precision: 0.82, recall: 0.87 },
    createTime: "2024-01-14 14:20:00"
  },
  {
    id: 3,
    taskName: "管网漏损检测模型优化",
    modelName: "Pipeline Leak Detection Model",
    version: "v3.0.1",
    modelType: "机器学习",
    developLanguage: "R",
    statusName: "失败",
    trainTime: 0,
    deployTestStatus: 0,
    evaluateIndexData: { accuracy: 0.0, precision: 0.0, recall: 0.0 },
    createTime: "2024-01-13 09:15:00"
  }
];

// Mock data for model plaza page
export const mockModels = [
  {
    id: 1,
    name: "水质预测模型",
    modelName: "Water Quality Prediction Model",
    description: "基于历史水质数据预测pH、浊度、余氯等水质指标",
    version: "v1.2.0",
    modelType: "机器学习",
    statusName: "启用",
    createTime: "2024-01-10",
    orgName: "水质监测部"
  },
  {
    id: 2,
    name: "用水量预测模型",
    modelName: "Water Consumption Prediction Model",
    description: "预测未来用水量，支持日、周、月预测",
    version: "v2.0.0",
    modelType: "时间序列",
    statusName: "启用",
    createTime: "2024-01-08",
    orgName: "供水调度部"
  },
  {
    id: 3,
    name: "管网漏损检测模型",
    modelName: "Pipeline Leak Detection Model",
    description: "基于压力、流量数据检测管网漏损位置",
    version: "v1.5.0",
    modelType: "深度学习",
    statusName: "禁用",
    createTime: "2024-01-05",
    orgName: "管网维护部"
  }
];

// Mock data for user management page
export const mockUsers = [
  {
    id: 1,
    name: "张三",
    username: "zhangsan",
    employeeNo: "E001",
    orgName: "技术部",
    title: "高级工程师",
    roles: [{ name: "管理员" }, { name: "开发者" }],
    status: 1,
    source: 1
  },
  {
    id: 2,
    name: "李四",
    username: "lisi",
    employeeNo: "E002",
    orgName: "市场部",
    title: "产品经理",
    roles: [{ name: "普通用户" }],
    status: 1,
    source: 1
  },
  {
    id: 3,
    name: "王五",
    username: "wangwu",
    employeeNo: "E003",
    orgName: "财务部",
    title: "财务主管",
    roles: [{ name: "审计员" }],
    status: 0,
    source: 2
  }
];

// Mock data for organization tree
export const mockOrgTree = [
  {
    orgId: 1,
    name: "总部",
    children: [
      {
        orgId: 2,
        name: "技术部",
        children: [
          { orgId: 4, name: "前端组", children: [] },
          { orgId: 5, name: "后端组", children: [] }
        ]
      },
      {
        orgId: 3,
        name: "市场部",
        children: [
          { orgId: 6, name: "推广组", children: [] },
          { orgId: 7, name: "运营组", children: [] }
        ]
      }
    ]
  }
];

// Mock data for model evaluation
export const mockEvaluationData = [
  {
    id: 1,
    modelName: "水质预测模型",
    scenario: "供水水质监测",
    evaluator: "系统评估",
    evaluationTime: "2024-01-15",
    status: "通过",
    metrics: { accuracy: 0.92, precision: 0.88, recall: 0.91, f1_score: 0.89 }
  },
  {
    id: 2,
    modelName: "用水量预测模型",
    scenario: "城市供水调度",
    evaluator: "人工评估",
    evaluationTime: "2024-01-14",
    status: "待评估",
    metrics: {}
  }
];